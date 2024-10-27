import { getAllPokemon } from "@/sdk/pokeapi";

export default async function Home() {
  const pokemonList = await getAllPokemon();

  return (
    <div>
      <h1>Pokemon List</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li
            key={pokemon.dexNumber}
            className="flex items-center gap-4 p-4 hover:bg-gray-100 rounded-lg"
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.dexNumber}.png`}
              alt={pokemon.name}
              className="w-16 h-16 image-rendering-pixelated"
              style={{ imageRendering: "pixelated" }}
            />
            <div>
              <span className="text-gray-500 text-sm">
                #{pokemon.dexNumber}
              </span>
              <h2 className="text-lg font-semibold capitalize">
                {pokemon.name}
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
