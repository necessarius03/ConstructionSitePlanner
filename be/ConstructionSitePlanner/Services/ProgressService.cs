using System.Text.Json;
using ConstructionSitePlanner.DTOs;
using ConstructionSitePlanner.Entities;
using ConstructionSitePlanner.Repositories;

namespace ConstructionSitePlanner.Services;

public class ProgressService : IProgressService
{
    private readonly IProgressRepository _repository;
    private readonly ISiteLayoutRepository _siteLayoutRepository;

    public ProgressService(IProgressRepository repository, ISiteLayoutRepository siteLayoutRepository)
    {
        _repository = repository;
        _siteLayoutRepository = siteLayoutRepository;
    }

    public async Task<IEnumerable<ProgressDto>> GetAllAsync()
    {
        var progress = await _repository.GetAllAsync();
        return progress.Select(ToDto).ToList();
    }

    public async Task<IEnumerable<ProgressDto>> GetBySiteLayoutIdAsync(Guid siteLayoutId)
    {
        var progress = await _repository.GetBySiteLayoutIdAsync(siteLayoutId);
        return progress.Select(ToDto).ToList();
    }

    public async Task<ProgressDto?> GetByIdAsync(Guid id)
    {
        var progress = await _repository.GetByIdAsync(id);
        return progress != null ? ToDto(progress) : null;
    }

    public async Task<ProgressDto> CreateAsync(CreateProgressDto createDto)
    {
        // Check if SiteLayout exists
        var siteLayout = await _siteLayoutRepository.GetByIdAsync(createDto.SiteLayoutId);
        if (siteLayout == null)
        {
            throw new ArgumentException($"SiteLayout with ID {createDto.SiteLayoutId} does not exist.");
        }

        // Validate dates
        if (createDto.EndDate < createDto.StartDate)
        {
            throw new ArgumentException("End date must be after start date.");
        }

        var dependsOnJson = createDto.DependsOn != null && createDto.DependsOn.Any()
            ? JsonSerializer.Serialize(createDto.DependsOn)
            : null;

        var progress = new Progress
        {
            Name = createDto.Name,
            Description = createDto.Description,
            SiteLayoutId = createDto.SiteLayoutId,
            ZoneShapeId = createDto.ZoneShapeId,
            StartDate = createDto.StartDate,
            EndDate = createDto.EndDate,
            ActualStartDate = createDto.ActualStartDate,
            ActualEndDate = createDto.ActualEndDate,
            CompletionPercentage = createDto.CompletionPercentage,
            Status = createDto.Status,
            Color = createDto.Color,
            ResponsiblePerson = createDto.ResponsiblePerson,
            Notes = createDto.Notes,
            DependsOn = dependsOnJson
        };

        var created = await _repository.CreateAsync(progress);
        return ToDto(created);
    }

    public async Task<ProgressDto?> UpdateAsync(Guid id, UpdateProgressDto updateDto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        // Validate dates
        if (updateDto.EndDate < updateDto.StartDate)
        {
            throw new ArgumentException("End date must be after start date.");
        }

        var dependsOnJson = updateDto.DependsOn != null && updateDto.DependsOn.Any()
            ? JsonSerializer.Serialize(updateDto.DependsOn)
            : null;

        existing.Name = updateDto.Name;
        existing.Description = updateDto.Description;
        existing.ZoneShapeId = updateDto.ZoneShapeId;
        existing.StartDate = updateDto.StartDate;
        existing.EndDate = updateDto.EndDate;
        existing.ActualStartDate = updateDto.ActualStartDate;
        existing.ActualEndDate = updateDto.ActualEndDate;
        existing.CompletionPercentage = updateDto.CompletionPercentage;
        existing.Status = updateDto.Status;
        existing.Color = updateDto.Color;
        existing.ResponsiblePerson = updateDto.ResponsiblePerson;
        existing.Notes = updateDto.Notes;
        existing.DependsOn = dependsOnJson;

        var updated = await _repository.UpdateAsync(existing);
        return updated != null ? ToDto(updated) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    public async Task<ProgressDto?> UpdateCompletionPercentageAsync(Guid id, int percentage)
    {
        var success = await _repository.UpdateCompletionPercentageAsync(id, percentage);
        if (!success)
            return null;

        var progress = await _repository.GetByIdAsync(id);
        return progress != null ? ToDto(progress) : null;
    }

    public async Task<ProgressDto?> UpdateStatusAsync(Guid id, string status)
    {
        var success = await _repository.UpdateStatusAsync(id, status);
        if (!success)
            return null;

        var progress = await _repository.GetByIdAsync(id);
        return progress != null ? ToDto(progress) : null;
    }

    private ProgressDto ToDto(Progress progress)
    {
        List<Guid>? dependsOn = null;
        if (!string.IsNullOrEmpty(progress.DependsOn))
        {
            try
            {
                dependsOn = JsonSerializer.Deserialize<List<Guid>>(progress.DependsOn);
            }
            catch
            {
                // Ignore deserialization errors
            }
        }

        return new ProgressDto
        {
            Id = progress.Id,
            Name = progress.Name,
            Description = progress.Description,
            SiteLayoutId = progress.SiteLayoutId,
            ZoneShapeId = progress.ZoneShapeId,
            StartDate = progress.StartDate,
            EndDate = progress.EndDate,
            ActualStartDate = progress.ActualStartDate,
            ActualEndDate = progress.ActualEndDate,
            CompletionPercentage = progress.CompletionPercentage,
            Status = progress.Status,
            Color = progress.Color,
            ResponsiblePerson = progress.ResponsiblePerson,
            Notes = progress.Notes,
            DependsOn = dependsOn,
            CreatedAt = progress.CreatedAt,
            UpdatedAt = progress.UpdatedAt
        };
    }
}