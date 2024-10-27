import { getRankings } from "@/sdk/vote";
import PokemonSprite from "@/utils/pokemon-sprite";
import { Suspense } from "react";

async function Results() {
  "use cache";
  const rankings = await getRankings();

  return (
    <div className="contents" key="results">
      {rankings.map((pokemon, index) => (
        <div
          key={pokemon.dexNumber}
          className="flex items-center gap-6 p-6 bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="text-2xl font-bold text-gray-400 w-8">
            #{index + 1}
          </div>

          <PokemonSprite pokemon={pokemon} className="w-20 h-20" lazy />

          <div className="flex-grow">
            <div className="text-gray-400 text-sm">#{pokemon.dexNumber}</div>
            <h2 className="text-xl font-semibold capitalize">{pokemon.name}</h2>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">
              {(pokemon.stats.winRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              {pokemon.stats.wins}W - {pokemon.stats.losses}L
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Pokemon Rankings</h1>
      <div className="grid gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Results />
        </Suspense>
      </div>
    </div>
  );
}
