import { kv } from "@vercel/kv";
import { getAllPokemon } from "./pokeapi";

interface Battle {
  winner: number;
  loser: number;
  timestamp: number;
}

// Key structure:
// battles:all - List of all battles (List)
// pokemon:{id}:wins - Number of wins for a pokemon (Number)
// pokemon:{id}:losses - Number of losses for a pokemon (Number)

export async function recordBattle(winner: number, loser: number) {
  const battle: Battle = {
    winner,
    loser,
    timestamp: Date.now(),
  };

  // Record the battle in a list
  await kv.lpush("battles:all", JSON.stringify(battle));

  // Increment win/loss counters
  await Promise.all([
    kv.incr(`pokemon:${winner}:wins`),
    kv.incr(`pokemon:${loser}:losses`),
  ]);
}

export async function getRankings() {
  const pokemonList = await getAllPokemon();

  // Construct win/loss keys directly from pokemon list
  const winKeys = pokemonList.map((p) => `pokemon:${p.dexNumber}:wins`);
  const lossKeys = pokemonList.map((p) => `pokemon:${p.dexNumber}:losses`);

  const [wins, losses] = await Promise.all([
    kv.mget<number[]>(...winKeys),
    kv.mget<number[]>(...lossKeys),
  ]);

  const stats = pokemonList.map((pokemon, index) => {
    const totalWins = wins[index] ?? 0;
    const totalLosses = losses[index] ?? 0;
    const totalBattles = totalWins + totalLosses;

    return {
      ...pokemon,
      stats: {
        wins: totalWins,
        losses: totalLosses,
        winRate: totalBattles > 0 ? totalWins / totalBattles : 0,
      },
    };
  });

  return stats.sort((a, b) => b.stats.winRate - a.stats.winRate);
}
