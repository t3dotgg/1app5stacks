import Head from "next/head";
import { api } from "~/utils/api";
import getLayout from "~/utils/layout";

import { PokemonSprite } from "~/utils/sprite";

function VotePageContents() {
  const { data, isLoading, refetch } = api.pokemon.getPair.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const { mutate: voteMutation } = api.pokemon.vote.useMutation();

  if (isLoading || !data) return <VoteFallback />;

  const [pokemonOne, pokemonTwo] = data;

  function handleVote(winnerId: number, loserId: number) {
    void voteMutation({ votedForId: winnerId, votedAgainstId: loserId });
    void refetch();
  }

  return (
    <>
      {/* Pokemon One */}
      <div key={pokemonOne.id} className="flex flex-col items-center gap-4">
        <PokemonSprite dexId={pokemonOne.id} className="h-64 w-64" />
        <div className="text-center">
          <span className="text-lg text-gray-500">#{pokemonOne.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonOne.name}</h2>
          <button
            onClick={() => handleVote(pokemonOne.id, pokemonTwo.id)}
            className="rounded-lg bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Vote
          </button>
        </div>
      </div>

      {/* Pokemon Two */}
      <div key={pokemonTwo.id} className="flex flex-col items-center gap-4">
        <PokemonSprite dexId={pokemonTwo.id} className="h-64 w-64" />
        <div className="text-center">
          <span className="text-lg text-gray-500">#{pokemonTwo.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonTwo.name}</h2>
          <button
            onClick={() => handleVote(pokemonTwo.id, pokemonOne.id)}
            className="rounded-lg bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Vote
          </button>
        </div>
      </div>
    </>
  );
}

function VoteFallback() {
  return (
    <>
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center gap-4">
          <div className="h-64 w-64 animate-pulse rounded-lg bg-gray-800/10" />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="h-6 w-16 animate-pulse rounded bg-gray-800/10" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-800/10" />
            <div className="h-12 w-24 animate-pulse rounded bg-gray-800/10" />
          </div>
        </div>
      ))}
    </>
  );
}

function VotePage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center gap-16">
      <Head>
        <title>Roundest (T3 Stack Version)</title>
      </Head>
      <VotePageContents />
    </div>
  );
}

VotePage.getLayout = getLayout;

export default VotePage;
