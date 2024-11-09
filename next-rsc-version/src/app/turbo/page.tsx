import { getTwoRandomPokemon, PokemonPair } from "@/sdk/pokeapi";
import { recordBattle } from "@/sdk/vote";
import { cookies } from "next/headers";
import { Suspense } from "react";
import PokemonSprite from "@/utils/pokemon-sprite";
import VoteFallback from "@/utils/vote-fallback";

export const metadata = {
  title: "Over-Optimized Version | Roundest (RSC Version)",
  description: "Roundest, but implemented with React Server Commponents",
};

async function VoteContent() {
  const currentPokemonPairJSON = (await cookies()).get("currentPair")?.value;
  const currentPokemonPair = currentPokemonPairJSON
    ? (JSON.parse(currentPokemonPairJSON) as PokemonPair)
    : await getTwoRandomPokemon();

  const nextPair = await getTwoRandomPokemon();

  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      {/* Render next two images in hidden divs so they load faster */}
      <div className="hidden">
        {nextPair.map((pokemon) => (
          <PokemonSprite
            key={pokemon.dexNumber}
            pokemon={pokemon}
            className="w-64 h-64"
          />
        ))}
      </div>
      {currentPokemonPair.map((pokemon, index) => (
        <div
          key={pokemon.dexNumber}
          className="flex flex-col items-center gap-4"
        >
          <PokemonSprite pokemon={pokemon} className="w-64 h-64" />
          <div className="text-center">
            <span className="text-gray-500 text-lg">#{pokemon.dexNumber}</span>
            <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
            <form className="mt-4">
              <button
                formAction={async () => {
                  "use server";
                  console.log("voted for", pokemon.name, pokemon.dexNumber);

                  const loser = currentPokemonPair[index === 0 ? 1 : 0];

                  recordBattle(pokemon.dexNumber, loser.dexNumber);

                  const jar = await cookies();
                  jar.set("currentPair", JSON.stringify(nextPair));

                  // Uncommenting this slows things down? Asked Vercel for more info
                  // revalidatePath("/turbo");
                }}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Vote
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Suspense fallback={<VoteFallback />}>
        <VoteContent />
      </Suspense>
    </div>
  );
}
