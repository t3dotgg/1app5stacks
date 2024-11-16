<?php

namespace Database\Seeders;

use App\Models\Pokemon;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $query = '
            query GetAllPokemon {
                pokemon_v2_pokemon(where: {id: {_lte: 1025}}) {
                    id
                    pokemon_v2_pokemonspecy {
                        name
                    }
                }
            }
        ';
        $response = \Http::post('https://beta.pokeapi.co/graphql/v1beta', ['query' => $query]);

        $pokemon = $response->json('data.pokemon_v2_pokemon');

        $pokemon = collect($pokemon)->map(function ($pokemon) {
            return [
                'id' => $pokemon['id'],
                'name' => $pokemon['pokemon_v2_pokemonspecy']['name'],
                'url' => "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{$pokemon['id']}.png",
            ];
        })->all();

        Pokemon::insert($pokemon);
    }
}
