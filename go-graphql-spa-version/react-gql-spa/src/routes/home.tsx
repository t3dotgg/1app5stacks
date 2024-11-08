import { useQuery, useMutation } from "@apollo/client";

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

  if (!pokemonOne || !pokemonTwo) throw new Error("No pokemon found");

  function handleVote(winnerId: number, loserId: number) {
    voteMutation({ variables: { upvoteId: winnerId, downvoteId: loserId } });
    refetch();
  }

  return (
    <>
      {/* Pokemon One */}
      <div key={pokemonOne.id} className="flex flex-col items-center gap-4">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonOne.id}.png`}
          className="w-64 h-64"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="text-center">
          <span className="text-gray-500 text-lg">#{pokemonOne.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonOne.name}</h2>
          <button
            onClick={() => handleVote(pokemonOne.id!, pokemonTwo.id!)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Vote
          </button>
        </div>
      </div>

      {/* Pokemon Two */}
      <div key={pokemonTwo.id} className="flex flex-col items-center gap-4">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonTwo.id}.png`}
          className="w-64 h-64"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="text-center">
          <span className="text-gray-500 text-lg">#{pokemonTwo.id}</span>
          <h2 className="text-2xl font-bold capitalize">{pokemonTwo.name}</h2>
          <button
            onClick={() => handleVote(pokemonTwo.id!, pokemonOne.id!)}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
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
          <div className="w-64 h-64 bg-gray-800/10 rounded-lg animate-pulse" />
          <div className="text-center space-y-2 flex flex-col items-center justify-center">
            <div className="h-6 w-16 bg-gray-800/10 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-800/10 rounded animate-pulse" />
            <div className="h-12 w-24 bg-gray-800/10 rounded animate-pulse" />
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
