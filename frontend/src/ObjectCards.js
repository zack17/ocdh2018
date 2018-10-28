import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Error } from "./Error";
import { Loader } from "./Loader";
import { SimilarObjectCard } from "./SimilarObjectCard";
import { RandomObjectCard } from "./RandomObjectCard";
import {
  SameYearWhereClause,
  SameClassificationWhereClause,
  SameProducerWhereClause,
  SameClassificationAndProducerWhereClause,
  SameClassificationAndYearWhereClause,
  SameProducerAndYearWhereClause
} from "./fragments";
import { ObjectCard } from "./ObjectCard";

function pickOne(from) {
  const index = (Math.random() * from.length) | 0;
  const [item] = from.splice(index, 1);
  return item;
}

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

export function ObjectCards({ to }) {
  const query = gql`
    query RelationCounts($id: ID!, $yearFrom: Int!, $yearTo: Int!) {
      sameYear: objectsConnection(
        ${SameYearWhereClause}
      ) {
        aggregate {
          count
        }
      }

      sameClassification: objectsConnection(
        ${SameClassificationWhereClause}
      ) {
        aggregate {
          count
        }
      }

      sameProducer: objectsConnection(
        ${SameProducerWhereClause}
      ) {
        aggregate {
          count
        }
      }

      sameClassificationAndProducer: objectsConnection(
        ${SameClassificationAndProducerWhereClause}
      ) {
        aggregate {
          count
        }
      }

      sameClassificationAndYear: objectsConnection(
        ${SameClassificationAndYearWhereClause}
      ) {
        aggregate {
          count
        }
      }

      sameProducerAndYear: objectsConnection(
        ${SameProducerAndYearWhereClause}
      ) {
        aggregate {
          count
        }
      }
    }
  `;

  return (
    <Query
      query={query}
      variables={{
        id: to.id,
        yearFrom: to.yearfrom,
        yearTo: to.yearto
      }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <Loader />;
        }

        if (error) {
          return <Error error={error} />;
        }

        const twoCriteriaClassifiers = [
          {
            criteria: "producerAndYear",
            count: data.sameProducerAndYear.aggregate.count
          },
          {
            criteria: "classificationAndYear",
            count: data.sameClassificationAndYear.aggregate.count
          },
          {
            criteria: "classificationAndProducer",
            count: data.sameClassificationAndProducer.aggregate.count
          }
        ];

        const oneCriteriaClassifiers = [
          {
            criteria: "producer",
            count: data.sameProducer.aggregate.count
          },
          {
            criteria: "classification",
            count: data.sameClassification.aggregate.count
          },
          {
            criteria: "year",
            count: data.sameYear.aggregate.count
          }
        ];

        const twoCriteriasWithResults = twoCriteriaClassifiers.filter(
          result => result.count > 0
        );
        const singleCriteriaWithResults = oneCriteriaClassifiers.filter(
          result => result.count > 0
        );

        const otherCards = [<RandomObjectCard key="random" />];
        if (twoCriteriasWithResults.length > 0) {
          const { criteria, count } = pickOne(twoCriteriasWithResults);
          otherCards.push(
            <SimilarObjectCard
              to={to}
              criteria={criteria}
              key={criteria}
              count={count}
            />
          );
        } else if (singleCriteriaWithResults.length > 0) {
          const { criteria, count } = pickOne(singleCriteriaWithResults);
          otherCards.push(
            <SimilarObjectCard
              to={to}
              criteria={criteria}
              key={criteria}
              count={count}
            />
          );
        } else {
          otherCards.push(<RandomObjectCard key="random1" />);
        }

        if (singleCriteriaWithResults.length > 0) {
          const { criteria, count } = pickOne(singleCriteriaWithResults);
          otherCards.push(
            <SimilarObjectCard
              to={to}
              criteria={criteria}
              key={criteria}
              count={count}
            />
          );
        } else {
          otherCards.push(<RandomObjectCard key="random2" />);
        }

        shuffle(otherCards);

        return (
          <div className="container">
            <div className="row">
              <ObjectCard object={to} />
              {otherCards}
            </div>
          </div>
        );
      }}
    </Query>
  );
}
