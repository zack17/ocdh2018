import React from "react";
import { ObjectCard } from "./ObjectCard";
import { Query } from "react-apollo";
import { ObjectDetailsFragment } from "./fragments";
import gql from "graphql-tag";
import { Loader } from "./Loader";
import { Error } from "./Error";
import { randomSkip } from "./util";

export function RandomObjectCard(props) {
  return (
    <Query
      query={gql`
        {
          objectsConnection {
            aggregate {
              count
            }
          }
        }
      `}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />;
        }
        if (error) {
          return <Error error={error} />;
        }

        return (
          <Query
            query={gql`
              query RandomObject($skip: Int) {
                objects(skip: $skip, first: 1) {
                  ...ObjectDetailsFragment
                }
              }
              ${ObjectDetailsFragment}
            `}
            variables={{
              skip: randomSkip(data.objectsConnection.aggregate.count)
            }}
          >
            {({ loading, error, data }) => {
              if (loading) {
                return <Loader />;
              }
              if (error) {
                return <Error error={error} />;
              }

              return <ObjectCard object={data.objects[0]} />;
            }}
          </Query>
        );
      }}
    </Query>
  );
}
