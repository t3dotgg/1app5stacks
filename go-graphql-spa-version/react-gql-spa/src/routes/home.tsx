import { useQuery } from "@apollo/client";

import { gql } from "../../__generated__/";

const PokeQuery = gql(/* GraphQL */ `
  query RandomPair {
    randomPair {
      pokemonOne {
        id
        name
      }
    }
  }
`);

function VotePage() {
  const { data, loading } = useQuery(PokeQuery);

  if (loading || !data) return <div>Loading...</div>;

  console.log("data", data);

  return <div className="text-3xl font-bold">Hello</div>;
}

export default VotePage;
