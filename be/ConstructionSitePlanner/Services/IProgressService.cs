using ConstructionSitePlanner.DTOs;

namespace ConstructionSitePlanner.Services;

public interface IProgressService
{
    Task<IEnumerable<ProgressDto>> GetAllAsync();
    Task<IEnumerable<ProgressDto>> GetBySiteLayoutIdAsync(Guid siteLayoutId);
    Task<ProgressDto?> GetByIdAsync(Guid id);
    Task<ProgressDto> CreateAsync(CreateProgressDto createDto);
    Task<ProgressDto?> UpdateAsync(Guid id, UpdateProgressDto updateDto);
    Task<bool> DeleteAsync(Guid id);
    Task<ProgressDto?> UpdateCompletionPercentageAsync(Guid id, int percentage);
    Task<ProgressDto?> UpdateStatusAsync(Guid id, string status);
}