import { useQuery } from "@apollo/client";

import { gql } from "../../__generated__/";
import { PokemonSprite } from "../utils/sprite";

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

function ResultsPageContents() {
  const { data, loading } = useQuery(PokeQuery);

  if (loading || !data) return <ResultsPageFallback />;

  return (
    <>
      {data.results.map((pokemon, index) => (
        <div
          key={pokemon.dexId}
          className="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-gray-400 w-8">
            #{index + 1}
          </div>

          <PokemonSprite dexId={pokemon.dexId} className="w-20 h-20" />

          <div className="flex-grow">
            <div className="text-sm text-gray-400">#{pokemon.dexId}</div>
            <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {pokemon.winPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {pokemon.upVotes}W - {pokemon.downVotes}L
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function ResultsPageFallback() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 p-6 rounded-lg shadow bg-gray-800/40 animate-pulse"
        >
          <div className="w-8 h-8 rounded bg-gray-700/40" />
          <div className="w-20 h-20 rounded bg-gray-700/40" />
          <div className="flex-grow">
            <div className="w-16 h-4 mb-2 rounded bg-gray-700/40" />
            <div className="w-32 h-6 rounded bg-gray-700/40" />
          </div>
          <div className="text-right">
            <div className="w-16 h-8 mb-2 rounded bg-gray-700/40" />
            <div className="w-24 h-4 rounded bg-gray-700/40" />
          </div>
        </div>
      ))}
    </>
  );
}

function ResultsPage() {
  return (
    <div className="container px-4 py-8 mx-auto text-white">
      <div className="grid gap-4">
        <ResultsPageContents />
      </div>
    </div>
  );
}

export default ResultsPage;
