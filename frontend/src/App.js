import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Query
          query={gql`     
          {
            objects {
              classification {
                name
              }
            }
          }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return data.objects.map(({ classification }) => (
              <div key={classification.name}>
                <p>{classification.name}</p>
              </div>
            ));
          }}
        </Query>
      </div>
    );
  }
}

export default App;
