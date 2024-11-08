import { useQuery } from "@apollo/client";

import { gql } from "../../__generated__/";

const PokeQuery = gql(/* GraphQL */ `
  query ResultsQuery {
    results {
      dexId
      downVotes
      upVotes
      name
      winPercentage
    }
  }
`);

function ResultsPage() {
  const { data, loading } = useQuery(PokeQuery);

  if (loading || !data || !data.results) return <div>Loading...</div>;

  const pokemonList = data.results.map((p) => {
    if (!p) throw new Error("Received a null pokemon, something is very wrong");
    return p;
  });

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="grid gap-4">
        {pokemonList.map((pokemon, index) => (
          <div
            key={pokemon.dexId}
            className="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="text-2xl font-bold text-gray-400 w-8">
              #{index + 1}
            </div>

            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexId}.png`}
              className="w-20 h-20"
              style={{ imageRendering: "pixelated" }}
            />

            <div className="flex-grow">
              <div className="text-gray-400 text-sm">#{pokemon.dexId}</div>
              <h2 className="text-xl font-semibold capitalize">
                {pokemon.name}
              </h2>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {pokemon.winPercentage!.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-400">
                {pokemon.upVotes}W - {pokemon.downVotes}L
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsPage;
