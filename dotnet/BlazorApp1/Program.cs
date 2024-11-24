using BlazorApp1;
using BlazorApp1.Components;
using BlazorApp1.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddHttpClient();
builder.Services.AddQuickGridEntityFrameworkAdapter();

builder.Services.AddDbContextFactory<PokemonDbContext>(options =>
{
    if(builder.Configuration.GetValue<string>("DatabaseTech") == "Postgres")
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"))
            .UseSnakeCaseNamingConvention();
    }
    else
    {
        options.UseSqlite("Data Source=pokemon.db");
    }
});


builder.Services.AddTransient<PokemonSeeder>();
builder.Services.AddHostedService<DbInitService>();


var app = builder.Build();

app.UseRouting();
app.MapStaticAssets();

app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.MapPost("/seed",
    async (PokemonDbContext dbContext, PokemonSeeder pokemonSeeder, CancellationToken token) =>
    {
        await pokemonSeeder.Seed(dbContext, token);
    });

app.Run();