const ApolloClient = require("apollo-boost").default;
const gql = require("graphql-tag");
const fetch = require("node-fetch");
const papa = require("papaparse");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

function parseYear(date) {
  const parts = date.split(".");
  return parseInt(parts[parts.length - 1], 10);
}

const client = new ApolloClient({
  uri: "https://api-euwest.graphcms.com/v1/cjnr7i2yb0bje01glv5s68dio/master",
  fetch,
  headers: {
    Authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
  }
});

async function importObjects() {
  const csv = fs.readFileSync(
    path.join(__dirname, "raw/Kutschen_Schlitten_Fahrzeuge_date_ed.csv"),
    "latin1"
  );
  const data = papa.parse(csv, { header: true });

  const rows = data.data;

  for (const object of rows) {
    if (!object.klassifikation) {
      console.log(`Skip object because classification is missing`);
      continue;
    }

    await importObject(object);
  }
}

async function importObject(object) {
  const { data: imageData } = await client.query({
    query: gql`
      query GetObjectPicture($fileName: String!) {
        assets(where: { fileName: $fileName }) {
          id
        }
      }
    `,
    variables: { fileName: `${object.oid}.jpg` }
  });

  if (imageData.assets.length === 0) {
    console.log(`Picture for object ${object.oid} not found`);
    return;
  }

  const pictureId = imageData.assets[0].id;

  if (!object.datierung.trim()) {
    console.log(`Skip object ${object.oid} because it misses a date`);
    return;
  }

  let [yearFrom, yearTo] = object.datierung.split("-");
  yearFrom = parseYear(yearFrom.trim());
  yearTo = yearTo ? parseYear(yearTo.trim()) : yearFrom;

  const { data } = await client.mutate({
    mutation: gql`
      mutation CreateOrUpdateObject(
        $description: String!
        $objectId: String!
        $pictureId: ID!
        $yearFrom: Int!
        $yearTo: Int!
      ) {
        upsertObject(
          where: { objectId: $objectId }
          create: {
            objectId: $objectId
            description: $description
            yearfrom: $yearFrom
            yearto: $yearTo
            picture: { connect: { id: $pictureId } }
          }
          update: {
            description: $description
            yearfrom: $yearFrom
            yearto: $yearTo
            picture: { connect: { id: $pictureId } }
          }
        ) {
          id
        }
      }
    `,
    variables: {
      objectId: object.oid,
      description: object.webtext,
      yearFrom,
      yearTo,
      pictureId
    }
  });

  await connect(
    data.upsertObject.id,
    object
  );
}

async function connect(objectId, row) {
  if (row.herstellung.trim()) {
    await client.mutate({
      mutation: gql`
        mutation CreateOrUpdateProducer($producer: String!, $objectId: ID!) {
          upsertProducer(
            where: { name: $producer }
            create: { name: $producer, objects: { connect: { id: $objectId } } }
            update: { objects: { connect: { id: $objectId } } }
          ) {
            id
          }
        }
      `,
      variables: {
        producer: row.herstellung,
        objectId
      }
    });
  }

  if (row.herkunft.trim()) {
    await client.mutate({
      mutation: gql`
        mutation CreateOrUpdateOrigin($origin: String!, $objectId: ID!) {
          upsertOrigin(
            where: { name: $origin }
            create: { name: $origin, objects: { connect: { id: $objectId } } }
            update: { objects: { connect: { id: $objectId } } }
          ) {
            id
          }
        }
      `,
      variables: {
        objectId,
        origin: row.herkunft
      }
    });
  }

  await client.mutate({
    mutation: gql`
      mutation CreateOrUpdateClassifier($classifier: String!, $objectId: ID!) {
        upsertClassifier(
          where: { name: $classifier }
          create: { name: $classifier, objects: { connect: { id: $objectId } } }
          update: { objects: { connect: { id: $objectId } } }
        ) {
          id
        }
      }
    `,
    variables: {
      classifier: row.klassifikation,
      objectId
    }
  });
}

importObjects();
