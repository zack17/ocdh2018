import gql from "graphql-tag";

export const ObjectDetailsFragment = gql`
  fragment ObjectDetailsFragment on Object {
    id
    yearfrom
    yearto
    description
    classification {
      id
      name
    }
    origin {
      id
      name
    }
    producer {
      id
      name
    }
    picture {
      handle
    }
  }
`;

export const SameYearWhereClause =
  "where: { id_not: $id, yearfrom_lte: $yearTo, yearto_gte: $yearFrom }";

export const SameClassificationWhereClause =
  "where: { id_not: $id, classification: { objects_some: { id: $id } } }";

export const SameProducerWhereClause =
  "where: { id_not: $id, producer: { objects_some: { id: $id } } }";

export const SameClassificationAndProducerWhereClause = `where: {
    id_not: $id
    classification: { objects_some: { id: $id } }
    producer: { objects_some: { id: $id } }
  }`;

export const SameClassificationAndYearWhereClause = `where: {
    id_not: $id
    yearfrom_lte: $yearTo
    yearto_gte: $yearFrom
    classification: { objects_some: { id: $id } }
  }`;

export const SameProducerAndYearWhereClause = `where: {
    id_not: $id
    yearfrom_lte: $yearTo
    yearto_gte: $yearFrom
    producer: { objects_some: { id: $id } }
  }`;
