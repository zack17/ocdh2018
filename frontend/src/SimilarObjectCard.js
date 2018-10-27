import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Loader } from "./Loader";
import { Error } from "./Error";
import { ObjectDetailsFragment } from "./fragments";
import { randomSkip } from "./util";
import { ObjectCard } from "./ObjectCard";

function pickOne(from) {
  const index = (Math.random() * from.length) | 0;
  const [item] = from.splice(index, 1);
  return item;
}

function selectCriteriasFor(object, numMatchingCriterias) {
  const possibleCriterias = ["year"];

  if (object.origin) {
    possibleCriterias.push("origin");
  }

  if (object.producer) {
    possibleCriterias.push("producer");
  }

  if (object.classification) {
    possibleCriterias.push("classification");
  }

  const selectedCriterias = [];
  for (let i = 0; i < numMatchingCriterias; ++i) {
    selectedCriterias.push(pickOne(possibleCriterias));
  }

  return selectedCriterias;
}

function buildWhereClause(to, numMatchingCriterias) {
  let where = `where: { id_not: "${to.id}"\n`;

  for (const criteria of selectCriteriasFor(to, numMatchingCriterias)) {
    if (criteria === "year") {
      where += `AND: [{yearfrom_lte: ${to.yearto}, yearto_gte: ${
        to.yearfrom
      }}]`;
    } else if (
      ["origin", "producer", "classification"].indexOf(criteria) !== -1
    ) {
      where += `${criteria}: {id: "${to[criteria].id}"}\n`;
    }
  }

  return where + "}";
}

export function SimilarObjectCard({ to, numMatchingCriterias }) {
  const whereClause = buildWhereClause(to, numMatchingCriterias);

  return (
    <Query
      query={gql`
      {
        objectsConnection(${whereClause}) {
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
          <>
            <Query
              query={gql`
                query SimilarObjects($skip: Int) {
                  objects(skip: $skip, first: 1, ${whereClause}) {
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

                if (data.objects.length === 0) {
                  return <h1>Nooo</h1>;
                }

                return <ObjectCard object={data.objects[0]} />;
              }}
            </Query>
            <p>Found Matches {data.objectsConnection.aggregate.count} for </p>
            {whereClause}
          </>
        );
      }}
    </Query>
  );
}
