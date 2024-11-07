import { useQuery } from "@apollo/client";

import { gql } from "../../__generated__/";

const PokeQuery = gql(/* GraphQL */ `
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
`);

function VotePage() {
  const { data, loading, refetch } = useQuery(PokeQuery);

  if (loading || !data || !data.randomPair) return <div>Loading...</div>;

  const twoPokemon = [data.randomPair.pokemonOne!, data.randomPair.pokemonTwo!];

  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      {twoPokemon.map((pokemon, index) => (
        <div key={pokemon.id} className="flex flex-col items-center gap-4">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
            className="w-64 h-64"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="text-center">
            <span className="text-gray-500 text-lg">#{pokemon.id}</span>
            <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
            <button
              onClick={async () => {
                console.log("voted for", pokemon.name);

                const loser = twoPokemon[index === 0 ? 1 : 0];

                refetch();
              }}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VotePage;
