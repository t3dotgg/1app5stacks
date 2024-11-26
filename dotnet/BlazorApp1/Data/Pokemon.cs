namespace BlazorApp1.Data;

public class Pokemon
{
    public Guid Id { get; set; }
    public string Name { get; set; } = "";
    public int DexId { get; set; }
    public int Upvotes { get; set; }
    public int Downvotes { get; set; }
}