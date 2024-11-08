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
    .input(z.object({ upvoteId: z.number(), downvoteId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // return ctx.db.vote.create({
      //   data: input,
      // });

      console.log(input);
      // TODO: implement this
    }),
});
