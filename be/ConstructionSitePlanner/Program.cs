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

// Progress endpoints
var progressGroup = apiGroup.MapGroup("/progress");

// GET: api/progress
progressGroup.MapGet("/", async (IProgressService progressService) =>
{
    var progresses = await progressService.GetAllAsync();
    return Results.Ok(progresses);
});

// GET: api/progress/{id}
progressGroup.MapGet("/{id}", async (Guid id, IProgressService progressService) =>
{
    var progress = await progressService.GetByIdAsync(id);
    return progress != null ? Results.Ok(progress) : Results.NotFound();
});

// GET: api/progress/site-layout/{siteLayoutId}
progressGroup.MapGet("/site-layout/{siteLayoutId}", async (Guid siteLayoutId, IProgressService progressService) =>
{
    var progresses = await progressService.GetBySiteLayoutIdAsync(siteLayoutId);
    return Results.Ok(progresses);
});

// POST: api/progress
progressGroup.MapPost("/", async (CreateProgressDto createDto, IProgressService progressService) =>
{
    try
    {
        var progress = await progressService.CreateAsync(createDto);
        return Results.Created($"/api/progress/{progress.Id}", progress);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

// PUT: api/progress/{id}
progressGroup.MapPut("/{id}", async (Guid id, UpdateProgressDto updateDto, IProgressService progressService) =>
{
    try
    {
        var progress = await progressService.UpdateAsync(id, updateDto);
        return progress != null ? Results.Ok(progress) : Results.NotFound();
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(ex.Message);
    }
});

// DELETE: api/progress/{id}
progressGroup.MapDelete("/{id}", async (Guid id, IProgressService progressService) =>
{
    var result = await progressService.DeleteAsync(id);
    return result ? Results.NoContent() : Results.NotFound();
});

// PATCH: api/progress/{id}/completion/{percentage}
progressGroup.MapPatch("/{id}/completion/{percentage}", async (Guid id, int percentage, IProgressService progressService) =>
{
    var progress = await progressService.UpdateCompletionPercentageAsync(id, percentage);
    return progress != null ? Results.Ok(progress) : Results.NotFound();
});

// PATCH: api/progress/{id}/status/{status}
progressGroup.MapPatch("/{id}/status/{status}", async (Guid id, string status, IProgressService progressService) =>
{
    var progress = await progressService.UpdateStatusAsync(id, status);
    return progress != null ? Results.Ok(progress) : Results.NotFound();
});

app.Run();