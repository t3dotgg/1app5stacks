import { kv } from "@vercel/kv";
import { getAllPokemon } from "./pokeapi";
import { waitUntil } from "@vercel/functions";

export const recordBattle = async (winner: number, loser: number) => {
  const recordPromises = Promise.all([
    // Record battle
    kv.lpush(
      "battles:all",
      JSON.stringify({
        winner,
        loser,
        timestamp: Date.now(),
      })
    ),

    // Increment win/loss counters
    kv.incr(`pokemon:${winner}:wins`),
    kv.incr(`pokemon:${loser}:losses`),
  ]);

  void waitUntil(recordPromises);
};

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
  return stats.sort((a, b) => {
    const winRateDiff = b.stats.winRate - a.stats.winRate;
    if (winRateDiff !== 0) return winRateDiff;
    return b.stats.wins - a.stats.wins;
  });
}
