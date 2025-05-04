using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public interface ISiteLayoutRepository
{
    Task<IEnumerable<SiteLayout>> GetAllAsync();
    Task<SiteLayout?> GetByIdAsync(Guid id);
    Task<SiteLayout> CreateAsync(SiteLayout siteLayout);
    Task<SiteLayout?> UpdateAsync(SiteLayout siteLayout);
    Task<bool> DeleteAsync(Guid id);
}