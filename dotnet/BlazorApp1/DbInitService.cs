using BlazorApp1.Data;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp1;

public class DbInitService(IDbContextFactory<PokemonDbContext> dbContextFactory, PokemonSeeder seeder)
    : IHostedService
{
    private Task? _seedTask;
    private CancellationTokenSource? _seedTokenSource;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await dbContextFactory.CreateDbContextAsync(cancellationToken);
        await dbContext.Database.MigrateAsync(cancellationToken: cancellationToken);

        if (!dbContext.Pokemons.Any())
        {
            _seedTokenSource = new CancellationTokenSource();
            _seedTask = Task.Run( async () =>
            {
                // DbContext above will be disposed when StartAsync is finished, so seeder needs its own
                await using var db = await dbContextFactory.CreateDbContextAsync(cancellationToken);
                await db.Database.MigrateAsync(cancellationToken: cancellationToken);
                
                await seeder.Seed(db, _seedTokenSource.Token);
            }, _seedTokenSource.Token);
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_seedTask is not null && _seedTokenSource is not null)
        {
            await _seedTokenSource.CancelAsync();
            await _seedTask;
        }
    }
}