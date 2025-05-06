// SiteLayoutAPI/Program.cs
using System.Text.Json.Serialization;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.DTOs;
using ConstructionSitePlanner.Extensions;
using ConstructionSitePlanner.Services;
using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.DTOs;
using ConstructionSitePlanner.Extensions;
using ConstructionSitePlanner.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddApplicationServices(builder.Configuration);

// Configure JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("http://localhost:3000") // Add your frontend URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // Apply migrations in development
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");

// Define API routes
var apiGroup = app.MapGroup("/api");
var equipmentGroup = apiGroup.MapGroup("/equipment");

// Site Layout endpoints
var siteLayoutGroup = apiGroup.MapGroup("/site-layouts");

// GET: api/site-layouts
siteLayoutGroup.MapGet("/", async (ISiteLayoutService siteLayoutService) =>
{
    var layouts = await siteLayoutService.GetAllAsync();
    return Results.Ok(layouts);
});

// GET: api/site-layouts/{id}
siteLayoutGroup.MapGet("/{id}", async (Guid id, ISiteLayoutService siteLayoutService) =>
{
    var layout = await siteLayoutService.GetByIdAsync(id);
    return layout != null ? Results.Ok(layout) : Results.NotFound();
});

// POST: api/site-layouts
siteLayoutGroup.MapPost("/", async (CreateSiteLayoutDto createDto, ISiteLayoutService siteLayoutService) =>
{
    var layout = await siteLayoutService.CreateAsync(createDto);
    return Results.Created($"/api/site-layouts/{layout.Id}", layout);
});

// PUT: api/site-layouts/{id}
siteLayoutGroup.MapPut("/{id}", async (Guid id, UpdateSiteLayoutDto updateDto, ISiteLayoutService siteLayoutService) =>
{
    var layout = await siteLayoutService.UpdateAsync(id, updateDto);
    return layout != null ? Results.Ok(layout) : Results.NotFound();
});

// DELETE: api/site-layouts/{id}
siteLayoutGroup.MapDelete("/{id}", async (Guid id, ISiteLayoutService siteLayoutService) =>
{
    var result = await siteLayoutService.DeleteAsync(id);
    return result ? Results.NoContent() : Results.NotFound();
});

// Equipment endpoints
// GET: api/equipment
equipmentGroup.MapGet("/", async (IEquipmentService equipmentService) =>
{
    var equipment = await equipmentService.GetAllAsync();
    return Results.Ok(equipment);
});

// GET: api/equipment/{id}
equipmentGroup.MapGet("/{id}", async (Guid id, IEquipmentService equipmentService) =>
{
    var equipment = await equipmentService.GetByIdAsync(id);
    return equipment != null ? Results.Ok(equipment) : Results.NotFound();
});

// POST: api/equipment
equipmentGroup.MapPost("/", async (CreateEquipmentDto createDto, IEquipmentService equipmentService) =>
{
    var equipment = await equipmentService.CreateAsync(createDto);
    return Results.Created($"/api/equipment/{equipment.Id}", equipment);
});

// PUT: api/equipment/{id}
equipmentGroup.MapPut("/{id}", async (Guid id, UpdateEquipmentDto updateDto, IEquipmentService equipmentService) =>
{
    var equipment = await equipmentService.UpdateAsync(id, updateDto);
    return equipment != null ? Results.Ok(equipment) : Results.NotFound();
});

// DELETE: api/equipment/{id}
equipmentGroup.MapDelete("/{id}", async (Guid id, IEquipmentService equipmentService) =>
{
    var result = await equipmentService.DeleteAsync(id);
    return result ? Results.NoContent() : Results.NotFound();
});

app.Run();