import type { Pokemon } from "@/sdk/pokeapi";

export default function PokemonSprite(props: {
  pokemon: Pokemon;
  className?: string;
}) {
  return (
    <img
      src={`/sprite/${props.pokemon.dexNumber}.png`}
      alt={props.pokemon.name}
      className={props.className}
      style={{ imageRendering: "pixelated" }}
      loading="lazy"
    />
  );
}
