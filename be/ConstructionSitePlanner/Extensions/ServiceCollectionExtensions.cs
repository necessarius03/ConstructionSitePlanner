using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.Repositories;
using ConstructionSitePlanner.Services;

namespace ConstructionSitePlanner.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Configure Npgsql for PostgreSQL
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        // Register repositories
        services.AddScoped<ISiteLayoutRepository, SiteLayoutRepository>();
        services.AddScoped<IEquipmentRepository, EquipmentRepository>();
        services.AddScoped<IProgressRepository, ProgressRepository>();

        // Register services
        services.AddScoped<IEquipmentService, EquipmentService>();
        services.AddScoped<ISiteLayoutService, SiteLayoutService>();
        services.AddScoped<IProgressService, ProgressService>();

        return services;
    }
}