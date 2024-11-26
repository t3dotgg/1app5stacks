using Microsoft.EntityFrameworkCore;

namespace BlazorApp1.Data;

public class PokemonDbContext(DbContextOptions<PokemonDbContext> options)
   : DbContext(options)
{
    public DbSet<Pokemon> Pokemons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PokemonDbContext).Assembly);
    }
}