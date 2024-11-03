import { getRankings } from "@/sdk/vote";
import PokemonSprite from "@/utils/pokemon-sprite";
import { Suspense } from "react";

export const metadata = {
  title: "Results | Roundest (RSC Version)",
  description: "See the results",
};

async function Results() {
  "use cache";
  const rankings = await getRankings();

  return (
    <div className="contents" key="results">
      {rankings.map((pokemon, index) => (
        <div
          key={pokemon.dexNumber}
          className="flex items-center gap-6 p-6 bg-gray-800/40 rounded-lg shadow hover:shadow-md transition-shadow"
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
      <div className="grid gap-4">
        <Suspense
          fallback={
            <div className="grid gap-4">
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
            </div>
          }
        >
          <Results />
        </Suspense>
      </div>
    </div>
  );
}
