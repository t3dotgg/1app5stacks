import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function getTwoRandomNumbers(max: number) {
  const first = Math.floor(Math.random() * max) + 1;
  let second;
  do {
    second = Math.floor(Math.random() * max) + 1;
  } while (second === first);
  return [first, second] as const;
}

export const pokemonRouter = createTRPCRouter({
  getPair: publicProcedure.query(async ({ ctx }) => {
    const [firstId, secondId] = getTwoRandomNumbers(1025);

    const pokemon = await ctx.db.pokemon.findMany({
      where: {
        id: {
          in: [firstId, secondId],
        },
      },
    });

    return [pokemon[0]!, pokemon[1]!] as const;
  }),

  vote: publicProcedure
    .input(z.object({ votedForId: z.number(), votedAgainstId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vote.create({
        data: input,
      });
    }),

  results: publicProcedure.query(async ({ ctx }) => {
    const votesPerPokemon = await ctx.db.pokemon.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            VoteFor: true,
            VoteAgainst: true,
          },
        },
      },
    });

    return votesPerPokemon
      .map((pokemon) => {
        const upVotes = pokemon._count.VoteFor;
        const downVotes = pokemon._count.VoteAgainst;
        const totalVotes = upVotes + downVotes;

        return {
          dexId: pokemon.id,
          name: pokemon.name,
          upVotes,
          downVotes,
          winPercentage: totalVotes > 0 ? (upVotes / totalVotes) * 100 : 0,
        };
      })
      .sort((a, b) => {
        // Sort by win percentage first
        if (b.winPercentage !== a.winPercentage) {
          return b.winPercentage - a.winPercentage;
        }
        // Break ties by total votes
        return b.upVotes + b.downVotes - (a.upVotes + a.downVotes);
      });
  }),
});
