import "server-only";
import { unstable_cacheLife } from "next/cache";

export type Pokemon = {
  name: string;
  dexNumber: number;
  sprite: string;
};

export type PokemonPair = [Pokemon, Pokemon];

export async function getAllPokemon() {
  "use cache";
  unstable_cacheLife("forever");

  const query = `
    query GetAllPokemon {
      pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
        id
        pokemon_v2_pokemonspecy {
          name
        }
      }
    }
  `;

  const response = await fetch("https://beta.pokeapi.co/graphql/v1beta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = (await response.json()).data as {
    pokemon_v2_pokemon: {
      id: number;
      pokemon_v2_pokemonspecy: {
        name: string;
      };
    }[];
  };

  return data.pokemon_v2_pokemon.map((pokemon) => ({
    name: pokemon.pokemon_v2_pokemonspecy.name,
    dexNumber: pokemon.id,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
  }));
}

import { connection } from "next/server";

export async function getTwoRandomPokemon() {
  await connection(); // Next needed some help knowing this is dynamic

  const allPokemon = await getAllPokemon();
  const shuffled = allPokemon.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}
