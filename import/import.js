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

function startImport (){
    const csv = fs.readFileSync("raw/Technologie_Brauchtum.csv", "latin1");
    const data = papa.parse(csv, {header: true});

    const rows = data.data;

    for (var i=0; i<3; i++) {
        pushToTheCloudWhereItBelongsTo(rows[i])
    }

}

function pushToTheCloudWhereItBelongsTo (row) {
console.log(row.webtext);
    client
    .mutate({
      mutation: gql`
          mutation CreateObject ($description : String) {
              createObject(
                  data: {
                  description: $description,
                  yearfrom: 2018,
                  yearto:2019
                  }) 
               {
                   description,
                   yearfrom,
                   yearto
               }
          }
      `,
      variables: {
          description : row.webtext
      }
    })
    .then(result => console.log(result)); 
}

startImport();



