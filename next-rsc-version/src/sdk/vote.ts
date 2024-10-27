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
  // Map to values from pokemon api and sort
  const pokemonList = await getAllPokemon();

  // Get all pokemon win keys
  const winKeys = await kv.keys("pokemon:*:wins");

  // Create loss keys for the same pokemon IDs
  const lossKeys = await kv.keys("pokemon:*:losses");

  // Get the actual wins and losses values
  const [allWins, allLosses] = await Promise.all([
    kv.mget<number[]>(...winKeys),
    kv.mget<number[]>(...lossKeys),
  ]);

  // Create a map of pokemon ID to their wins/losses
  const statsMap = new Map<number, { wins: number; losses: number }>();

  winKeys.forEach((key, i) => {
    // Extract ID from key format "pokemon:{id}:wins"
    const id = parseInt(key.split(":")[1]);
    const wins = allWins[i] ?? 0;

    if (!statsMap.has(id)) {
      statsMap.set(id, { wins: 0, losses: 0 });
    }
    statsMap.get(id)!.wins = wins;
  });

  lossKeys.forEach((key, i) => {
    // Extract ID from key format "pokemon:{id}:losses"
    const id = parseInt(key.split(":")[1]);
    const losses = allLosses[i] ?? 0;

    if (!statsMap.has(id)) {
      statsMap.set(id, { wins: 0, losses: 0 });
    }
    statsMap.get(id)!.losses = losses;
  });

  // Convert map to array and calculate win rates
  const pokemonStats = Array.from(statsMap.entries()).map(([id, stats]) => {
    const totalBattles = stats.wins + stats.losses;
    const winRate = totalBattles > 0 ? stats.wins / totalBattles : 0;

    return {
      id,
      stats: {
        wins: stats.wins,
        losses: stats.losses,
        winRate,
      },
    };
  });

  return pokemonStats
    .sort((a, b) => b.stats.winRate - a.stats.winRate)
    .map((pv) => {
      const pokemon = pokemonList.find((p) => p.dexNumber === pv.id);
      return {
        ...pokemon,
        stats: pv.stats,
      };
    })
    .filter((p) => p.name != null); // Filter out any pokemon that weren't found
}
