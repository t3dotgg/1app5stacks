import { useQuery, useMutation } from "@apollo/client";

import { gql } from "../../__generated__/";
import { PokemonSprite } from "../utils/sprite";

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

const Vote = gql(/* GraphQL */ `
  mutation Vote($upvoteId: Int!, $downvoteId: Int!) {
    vote(upvoteId: $upvoteId, downvoteId: $downvoteId) {
      success
    }
  }
`);

function VotePageContents() {
  const { data, loading, refetch } = useQuery(PokeQuery);
  const [voteMutation] = useMutation(Vote);

  if (loading || !data || !data.randomPair) return <VoteFallback />;

  const { pokemonOne, pokemonTwo } = data.randomPair;


  function handleVote(winnerId: number, loserId: number) {
    voteMutation({ variables: { upvoteId: winnerId, downvoteId: loserId } });
    refetch();
  }

  return (
    <>
      {/* Pokemon One */}
      <div key={pokemonOne.id} className="flex flex-col items-center gap-4">
        <PokemonSprite dexId={pokemonOne.id} className="w-64 h-64" />
        <div className="text-center">
          <span className="text-lg text-gray-500">#{pokemonOne.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonOne.name}</h2>
          <button
            onClick={() => handleVote(pokemonOne.id, pokemonTwo.id)}
            className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Vote
          </button>
        </div>
      </div>

      {/* Pokemon Two */}
      <div key={pokemonTwo.id} className="flex flex-col items-center gap-4">
        <PokemonSprite dexId={pokemonTwo.id} className="w-64 h-64" />
        <div className="text-center">
          <span className="text-lg text-gray-500">#{pokemonTwo.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonTwo.name}</h2>
          <button
            onClick={() => handleVote(pokemonTwo.id, pokemonOne.id)}
            className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
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
          <div className="w-64 h-64 rounded-lg bg-gray-800/10 animate-pulse" />
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div className="w-16 h-6 rounded bg-gray-800/10 animate-pulse" />
            <div className="w-32 h-8 rounded bg-gray-800/10 animate-pulse" />
            <div className="w-24 h-12 rounded bg-gray-800/10 animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}

function VotePage() {
  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      <VotePageContents />
    </div>
  );
}

export default VotePage;
