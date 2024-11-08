export function PokemonSprite({
  dexId,
  className,
}: {
  dexId: number;
  className?: string;
}) {
  return (
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
