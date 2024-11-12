import { PokemonSprite } from "~/utils/sprite";

import { api } from "~/utils/api";
import getLayout from "~/utils/layout";
import Head from "next/head";

function ResultsPageContents() {
  const { data, isLoading } = api.pokemon.results.useQuery();

  if (isLoading || !data) return <ResultsPageFallback />;

  return (
    <>
      {data.map((pokemon, index) => (
        <div
          key={pokemon.dexId}
          className="flex items-center gap-6 rounded-lg bg-gray-800/40 p-6 shadow transition-shadow hover:shadow-md"
        >
          <div className="w-8 text-2xl font-bold text-gray-400">
            #{index + 1}
          </div>

          <PokemonSprite dexId={pokemon.dexId} className="h-20 w-20" />

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
      {[...Array<number>(10)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-6 rounded-lg bg-gray-800/40 p-6 shadow"
        >
          <div className="h-8 w-8 rounded bg-gray-700/40" />
          <div className="h-20 w-20 rounded bg-gray-700/40" />
          <div className="flex-grow">
            <div className="mb-2 h-4 w-16 rounded bg-gray-700/40" />
            <div className="h-6 w-32 rounded bg-gray-700/40" />
          </div>
          <div className="text-right">
            <div className="mb-2 h-8 w-16 rounded bg-gray-700/40" />
            <div className="h-4 w-24 rounded bg-gray-700/40" />
          </div>
        </div>
      ))}
    </>
  );
}

function ResultsPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <Head>
        <title>Results (T3 Stack Version)</title>
      </Head>
      <div className="grid gap-4">
        <ResultsPageContents />
      </div>
    </div>
  );
}

ResultsPage.getLayout = getLayout;

export default ResultsPage;
