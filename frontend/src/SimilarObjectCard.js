import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { Loader } from "./Loader";
import { Error } from "./Error";
import {
  ObjectDetailsFragment,
  SameYearWhereClause,
  SameProducerWhereClause,
  SameClassificationWhereClause,
  SameProducerAndYearWhereClause,
  SameClassificationAndYearWhereClause,
  SameClassificationAndProducerWhereClause
} from "./fragments";
import { randomSkip } from "./util";
import { ObjectCard } from "./ObjectCard";

function buildQuery(criteria, to, count) {
  let includeYearVariables = false;
  let whereClause;

  switch (criteria) {
    case "year":
      includeYearVariables = true;

      whereClause = SameYearWhereClause;
      break;

    case "producer":
      whereClause = SameProducerWhereClause;
      break;

    case "classification":
      whereClause = SameClassificationWhereClause;
      break;

    case "producerAndYear":
      includeYearVariables = true;
      whereClause = SameProducerAndYearWhereClause;
      break;

    case "classificationAndYear":
      includeYearVariables = true;
      whereClause = SameClassificationAndYearWhereClause;
      break;

    case "classificationAndProducer":
      whereClause = SameClassificationAndProducerWhereClause;
      break;

    default:
      throw new Error(`Unknown criteria ${criteria}`);
  }

  let variableDeclaration = "$skip: Int!, $id: ID!";
  let variables = { id: to.id, skip: randomSkip(count) };

  if (includeYearVariables) {
    variables = {
      ...variables,
      yearFrom: to.yearfrom,
      yearTo: to.yearto
    };

    variableDeclaration += "$yearFrom: Int!, $yearTo: Int!";
  }

  return {
    query: gql`query SimilarObjects(${variableDeclaration}) {
    objects(skip: $skip, first: 1, ${whereClause}) {
      ...ObjectDetailsFragment
    }
  }
  ${ObjectDetailsFragment}`,
    variables
  };
}

export function SimilarObjectCard({ to, criteria, count }) {
  const { query, variables } = buildQuery(criteria, to, count);

  return (
    <Query query={query} variables={variables}>
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
}
