const ApolloClient = require ("apollo-boost").default;
const gql = require("graphql-tag");
const fetch = require ("node-fetch")
const papa = require("papaparse");
const fs = require('fs');

require('dotenv').config();

const client = new ApolloClient({
    uri: "https://api-euwest.graphcms.com/v1/cjnr7i2yb0bje01glv5s68dio/master",
    fetch,
    headers: {
        Authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
    }
});

function importcsv () {
    const csv = fs.readFileSync("raw/Technologie_Brauchtum.csv", "utf-8");
    const data = papa.parse(csv, {header: true});
    console.log(data.data[0].datierung);

    for (var i=0; i<data.data.length; i++) {
        console.log(data.data[i].datierung);
    }
}

function pushToTheCloudWhereItBelongsTo () {
    client
    .mutate({
      mutation: gql`
          mutation {
              createObject(
                  data: {
                  description: "dieser eintrag wurde importiert",
                  dateFrom: "2018-10-27T13:00:00.000Z"
                  dateTo:"2018-10-27T15:00:00.000Z"
                  }) 
              {
                  id
                  description
                  dateFrom
                  dateTo
              }
          }
      `
    })
    .then(result => console.log(result)); 
}

importcsv();



