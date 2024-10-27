import { getTwoRandomPokemon, PokemonPair } from "@/sdk/pokeapi";
import { recordBattle } from "@/sdk/vote";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Suspense } from "react";
import PokemonSprite from "@/utils/pokemon-sprite";
import VoteFallback from "@/utils/vote-fallback";

async function VoteContent() {
  const twoPokemonJSON = (await cookies()).get("nextTwo")?.value;
  const twoPokemon = twoPokemonJSON
    ? (JSON.parse(twoPokemonJSON) as PokemonPair)
    : await getTwoRandomPokemon();

  const futureTwo = await getTwoRandomPokemon();

  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      {/* Render next two images in hidden divs so they load faster */}
      <div className="hidden">
        {futureTwo.map((pokemon) => (
          <PokemonSprite
            key={pokemon.dexNumber}
            pokemon={pokemon}
            className="w-64 h-64"
          />
        ))}
      </div>
      {twoPokemon.map((pokemon, index) => (
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

                  const loser = twoPokemon[index === 0 ? 1 : 0];

                  await recordBattle(pokemon.dexNumber, loser.dexNumber);

                  const jar = await cookies();
                  jar.set("nextTwo", JSON.stringify(futureTwo));
                  revalidatePath("/");
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
