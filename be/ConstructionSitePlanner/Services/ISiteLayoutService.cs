using ConstructionSitePlanner.DTOs;

namespace ConstructionSitePlanner.Services;

public interface ISiteLayoutService
{
    Task<IEnumerable<SiteLayoutDto>> GetAllAsync();
    Task<SiteLayoutDto?> GetByIdAsync(Guid id);
    Task<SiteLayoutDto> CreateAsync(CreateSiteLayoutDto createDto);
    Task<SiteLayoutDto?> UpdateAsync(Guid id, UpdateSiteLayoutDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}