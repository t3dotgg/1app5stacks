using Microsoft.EntityFrameworkCore;

namespace BlazorApp1.Data;

public static class DatabaseExtensions
{
    public static async Task UpvotePokemon(this PokemonDbContext dbContext, Guid pokemonId)
    {
        await dbContext.Pokemons.Where(x => x.Id == pokemonId).ExecuteUpdateAsync(calls => calls.SetProperty(x => x.Upvotes, x => x.Upvotes + 1));
    }
    
    public static async Task DownvotePokemon(this PokemonDbContext dbContext, Guid pokemonId)
    {
        await dbContext.Pokemons.Where(x => x.Id == pokemonId).ExecuteUpdateAsync(calls => calls.SetProperty(x => x.Downvotes, x => x.Downvotes + 1));
    }
    
    public static async Task<Pokemon?> GetRandomPokemon(this PokemonDbContext dbContext)
    {
        return await dbContext.Pokemons
            .AsNoTracking()
            .OrderBy(x => EF.Functions.Random())
            .FirstOrDefaultAsync();
    }

    public static async Task<Pokemon?> GetRandomPokemonRaw(this PokemonDbContext dbContext)
    {
        return await dbContext.Pokemons
            .FromSqlRaw("SELECT * FROM pokemons ORDER BY random() LIMIT 1") // you can use raw sql too
            .FirstOrDefaultAsync();
    }
}