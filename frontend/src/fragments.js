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
