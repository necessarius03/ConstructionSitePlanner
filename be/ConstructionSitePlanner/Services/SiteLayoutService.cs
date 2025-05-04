using System.Text.Json;
using ConstructionSitePlanner.DTOs;
using ConstructionSitePlanner.Entities;
using ConstructionSitePlanner.Extensions;
using ConstructionSitePlanner.Repositories;

namespace ConstructionSitePlanner.Services;

public class SiteLayoutService : ISiteLayoutService
{
    private readonly ISiteLayoutRepository _repository;
    private readonly JsonSerializerOptions _jsonOptions;

    public SiteLayoutService(ISiteLayoutRepository repository)
    {
        _repository = repository;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };
    }

    public async Task<IEnumerable<SiteLayoutDto>> GetAllAsync()
    {
        var siteLayouts = await _repository.GetAllAsync();
        return siteLayouts.Select(ToDto);
    }

    public async Task<SiteLayoutDto?> GetByIdAsync(Guid id)
    {
        var siteLayout = await _repository.GetByIdAsync(id);
        return siteLayout != null ? ToDto(siteLayout) : null;
    }

    public async Task<SiteLayoutDto> CreateAsync(CreateSiteLayoutDto createDto)
    {
        var siteLayout = new SiteLayout
        {
            Name = createDto.Name,
            Description = createDto.Description,
            ShapesJson = JsonSerializer.Serialize(createDto.Shapes, _jsonOptions)
        };

        var created = await _repository.CreateAsync(siteLayout);
        return ToDto(created);
    }

    public async Task<SiteLayoutDto?> UpdateAsync(Guid id, UpdateSiteLayoutDto updateDto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        existing.Name = updateDto.Name;
        existing.Description = updateDto.Description;
        existing.ShapesJson = JsonSerializer.Serialize(updateDto.Shapes, _jsonOptions);

        var updated = await _repository.UpdateAsync(existing);
        return updated != null ? ToDto(updated) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private SiteLayoutDto ToDto(SiteLayout siteLayout)
    {
        var shapes = string.IsNullOrEmpty(siteLayout.ShapesJson)
            ? new List<ShapeDto>()
            : JsonSerializer.Deserialize<List<ShapeDto>>(siteLayout.ShapesJson, _jsonOptions) ?? new List<ShapeDto>();

        return new SiteLayoutDto
        {
            Id = siteLayout.Id,
            Name = siteLayout.Name,
            Description = siteLayout.Description,
            Shapes = shapes,
            CreatedAt = siteLayout.CreatedAt,
            UpdatedAt = siteLayout.UpdatedAt
        };
    }
}