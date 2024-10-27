import { getTwoRandomPokemon } from "@/sdk/pokeapi";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";

async function VoteContent() {
  const twoPokemon = await getTwoRandomPokemon();

  return (
    <div className="flex justify-center gap-16 items-center min-h-[80vh]">
      {twoPokemon.map((pokemon) => (
        <div
          key={pokemon.dexNumber}
          className="flex flex-col items-center gap-4"
        >
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-64 h-64 image-rendering-pixelated"
            style={{ imageRendering: "pixelated" }}
          />
          <div className="text-center">
            <span className="text-gray-500 text-lg">#{pokemon.dexNumber}</span>
            <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
            <form className="mt-4">
              <button
                formAction={async () => {
                  "use server";
                  console.log("voted for", pokemon.name);
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
      <Suspense
        fallback={
          <div className="flex justify-center gap-16 items-center min-h-[80vh]">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-64 h-64 bg-gray-200 rounded-lg animate-pulse" />
                <div className="text-center space-y-2">
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse mt-4" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <VoteContent />
      </Suspense>
    </div>
  );
}
