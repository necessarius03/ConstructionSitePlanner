using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<SiteLayout> SiteLayouts { get; set; } = null!;
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<Progress> Progress { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}