import { useQuery } from "@apollo/client";
import { PokemonSprite } from "../utils/sprite";
import { ResultsQueryDocument } from "../../__generated__/graphql";

function ResultsPageContents() {
  const { data, loading } = useQuery(ResultsQueryDocument);

  if (loading || !data || !data.results) return <ResultsPageFallback />;

  const pokemonList = data.results.map((p) => {
    if (!p) throw new Error("Received a null pokemon, something is very wrong");
    return p;
  });

  return (
    <>
      {pokemonList.map((pokemon, index) => (
        <div
          key={pokemon.dexId}
          className="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-gray-400 w-8">
            #{index + 1}
          </div>

          <PokemonSprite dexId={pokemon.dexId!} className="w-20 h-20" />

          <div className="flex-grow">
            <div className="text-gray-400 text-sm">#{pokemon.dexId}</div>
            <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
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
    </>
  );
}

function ResultsPageFallback() {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow animate-pulse"
        >
          <div className="w-8 h-8 bg-gray-700/40 rounded" />
          <div className="w-20 h-20 bg-gray-700/40 rounded" />
          <div className="flex-grow">
            <div className="w-16 h-4 bg-gray-700/40 rounded mb-2" />
            <div className="w-32 h-6 bg-gray-700/40 rounded" />
          </div>
          <div className="text-right">
            <div className="w-16 h-8 bg-gray-700/40 rounded mb-2" />
            <div className="w-24 h-4 bg-gray-700/40 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="grid gap-4">
        <ResultsPageContents />
      </div>
    </div>
  );
}

export default ResultsPage;
