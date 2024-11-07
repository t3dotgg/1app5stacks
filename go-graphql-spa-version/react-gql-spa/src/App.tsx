import "./App.css";
import { useQuery } from "@apollo/client";

import { gql } from "./__generated__/gql";

function App() {
  const { data, loading } = useQuery(
    gql(`
    query RandomPair {
      randomPair {
        pokemonOne {
          id
          name
        }
        pokemonTwo {
          id
          name
        }
      }
    }
  `)
  );

  if (loading || !data) return <div>Loading...</div>;

  console.log("data", data);

  return <div>Hello</div>;
}

export default App;
