require 'net/http'
require 'json'

namespace :pokemon do
  desc "Fetch Pokémon data from PokeAPI and seed the database"
  task seed: :environment do
    puts "Fetching Pokémon data from PokeAPI..."

    # Fetch all Pokémon using GraphQL
    query = <<~GRAPHQL
      query {
        pokemon_v2_pokemon(order_by: {id: asc}) {
          name
          id
          pokemon_v2_pokemonspecy {
            name
          }
        }
      }
    GRAPHQL

    uri = URI('https://beta.pokeapi.co/graphql/v1beta')
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.path, {'Content-Type' => 'application/json'})
    request.body = {query: query}.to_json

    response = http.request(request)
    data = JSON.parse(response.body)

    pokemon_list = data['data']['pokemon_v2_pokemon'].map do |pokemon|
      {
        name: pokemon['pokemon_v2_pokemonspecy']['name'],
        dex_number: pokemon['id']
      }
    end

    total_pokemon = pokemon_list.count

    pokemon_list.each_with_index do |pokemon, index|
      puts "Processing #{pokemon[:name]} (#{index + 1}/#{total_pokemon})"

      dex_id = pokemon[:dex_number]

      # Create or update the Pokémon in the database
      Pokemon.find_or_create_by(dex_id: dex_id) do |p|
        p.name = pokemon[:name].capitalize
        p.sprite = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/#{dex_id}.png"
      end

    end

    puts "Pokémon data seeding completed!"
  end
end