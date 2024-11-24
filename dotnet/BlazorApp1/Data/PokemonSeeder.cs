using System.Text.Json;
using System.Threading.Channels;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp1.Data;

public class PokemonSeeder(HttpClient httpClient, ILogger<PokemonSeeder> logger)
{
    public async Task Seed(PokemonDbContext dbContext, CancellationToken token)
    {
        var remotePokemonsChannel = Channel.CreateBounded<(string Name, string Url)>(100);
        var pokemonDetailsChannel = Channel.CreateBounded<Pokemon>(100);

        await Task.WhenAll(
            FetchPokemons(dbContext, remotePokemonsChannel.Writer, token),
            GetPokemonDetails(remotePokemonsChannel.Reader, pokemonDetailsChannel.Writer, token),
            SaveToDb(pokemonDetailsChannel.Reader, dbContext, token));
        
        logger.LogInformation("Seeding finished");
    }

    private async Task SaveToDb(ChannelReader<Pokemon> reader, PokemonDbContext dbContext, CancellationToken token)
    {
        int totalCount = 0;
        var pokemonsToSave = new List<Pokemon>();
        var connection = dbContext.Database.GetDbConnection();
        await connection.OpenAsync(cancellationToken: token);

        await foreach (var pokemon in reader.ReadAllAsync(token))
        {
            pokemonsToSave.Add(pokemon);
            
            // maybe too often, but I want user to be able to battle right away
            if (pokemonsToSave.Count >= 10) 
            {
                await dbContext.Pokemons.AddRangeAsync(pokemonsToSave, token);
                await dbContext.SaveChangesAsync(token);

                logger.LogInformation("Loaded {Count} pokemons in batch", pokemonsToSave.Count);
                totalCount += pokemonsToSave.Count;

                pokemonsToSave.Clear();
            }
        }

        if (pokemonsToSave.Count > 0)
        {
            await dbContext.Pokemons.AddRangeAsync(pokemonsToSave, token);
            await dbContext.SaveChangesAsync(token);

            logger.LogInformation("Loaded {Count} pokemons in batch", pokemonsToSave.Count);
            totalCount += pokemonsToSave.Count;
        }

        logger.LogInformation("Loaded {Count} pokemons in total", totalCount);
    }

    private async Task GetPokemonDetails(ChannelReader<(string Name, string Url)> reader, ChannelWriter<Pokemon> writer,
        CancellationToken token)
    {
        await foreach (var pokemon in reader.ReadAllAsync(token))
        {
            try
            {
                var response = await httpClient.GetStringAsync(pokemon.Url, cancellationToken: token);

                var pokeDexId = JsonSerializer.Deserialize<JsonElement>(response).GetProperty("id").GetInt32();
                var pokemonEntity = new Pokemon
                {
                    Name = pokemon.Name,
                    DexId = pokeDexId,
                };

                await writer.WriteAsync(pokemonEntity, token);

                logger.LogInformation("Loaded pokemon {Name}", pokemon.Name);
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error loading pokemon {Name}", pokemon.Name);
            }
        }
        
        writer.Complete();
    }

    private async Task FetchPokemons(PokemonDbContext dbContext,
        ChannelWriter<(string Name, string Url)> remotePokemonsChannel, CancellationToken token)
    {
        var dbPokemons = await dbContext.Pokemons.Select(x => x.Name).ToHashSetAsync(cancellationToken: token);

        var next = "https://pokeapi.co/api/v2/pokemon/";
        var loadingTask = FetchBatch(next);

        do
        {
            var remotePokemons = await loadingTask;
            next = remotePokemons.next;

            loadingTask = FetchBatch(next);
            foreach (var p in remotePokemons.pokemons.Where(x => !dbPokemons.Contains(x.Name)))
            {
                await remotePokemonsChannel.WriteAsync(p, token);
            }
        } while (next != null);

        remotePokemonsChannel.Complete();
    }

    private async Task<(string? next, IEnumerable<(string Name, string Url)> pokemons)> FetchBatch(string? nextUrl)
    {
        if (nextUrl is null)
        {
            return (null, []);
        }

        var pokemonJson = await httpClient.GetFromJsonAsync<JsonElement>(nextUrl);

        var pokemons = pokemonJson.GetProperty("results").EnumerateArray()
            .Select(el => (Name: el.GetProperty("name").GetString()!, Url: el.GetProperty("url").GetString()!));

        var nextResult = pokemonJson.GetProperty("next").GetString();

        return (next: nextResult, pokemons);
    }
}