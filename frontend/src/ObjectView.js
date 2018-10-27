import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { ObjectCard } from "./ObjectCard";
import { ObjectDetailsFragment } from "./fragments";
import { RandomObjectCard } from "./RandomObjectCard";
import { Loader } from "./Loader";
import { Error } from "./Error";
import { SimilarObjectCard } from "./SimilarObjectCard";

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ObjectView(props) {
  const objectId = props.match.params.objectId;
  let query;

  if (objectId) {
    query = gql`
      query QueryObjectById($id: ID) {
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

        const cards = [
          <RandomObjectCard key="random" />,
          <SimilarObjectCard
            numMatchingCriterias={1}
            to={object}
            key="similar1"
          />,
          <SimilarObjectCard
            numMatchingCriterias={2}
            to={object}
            key="similar2"
          />
        ];

        shuffle(cards);

        return (
          <div>
            <ObjectCard object={object} />
            {cards}
          </div>
        );
      }}
    </Query>
  );
}
