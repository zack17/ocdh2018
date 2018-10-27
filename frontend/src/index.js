import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";

import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://api-euwest.graphcms.com/v1/cjnr7i2yb0bje01glv5s68dio/master",
  headers: {
    Authorization:
      `Bearer ${process.env.REACT_APP_GRAPH_CMS_TOKEN}`
  }
});

client
  .query({
    query: gql`
      {
        objects {
          classification {
            name
          }
        }
      }
    `
  })
  .then(result => console.log(result));

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
