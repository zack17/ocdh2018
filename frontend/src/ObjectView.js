import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { ObjectCard } from "./ObjectCard";
import { ObjectDetailsFragment } from "./fragments";
import { RandomObjectCard } from "./RandomObjectCard";
import { Loader } from "./Loader";
import { Error } from "./Error";
import { SimilarObjectCard } from "./SimilarObjectCard";
import { RelatedObjects } from "./RelatedObjects";

export function ObjectView(props) {
  const objectId = props.match.params.objectId;
  let query;

  if (objectId) {
    query = gql`
      query QueryObjectById($id: ID!) {
        objects(first: 1, where: { id: $id }) {
          ...ObjectDetailsFragment
        }
      }
      ${ObjectDetailsFragment}
    `;
  } else {
    query = gql`
      {
        objects(first: 1) {
          ...ObjectDetailsFragment
        }
      }
      ${ObjectDetailsFragment}
    `;
  }

  return (
    <Query query={query} variables={{ id: objectId }}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />;
        }

        if (error) {
          return <Error error={error} />;
        }

        const [object] = data.objects;

        return (
          <div>
            <ObjectCard object={object} />
            <RelatedObjects to={object} />
          </div>
        );
      }}
    </Query>
  );
}
