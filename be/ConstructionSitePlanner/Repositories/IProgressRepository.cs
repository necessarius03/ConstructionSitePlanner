using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public interface IProgressRepository
{
    Task<IEnumerable<Progress>> GetAllAsync();
    Task<IEnumerable<Progress>> GetBySiteLayoutIdAsync(Guid siteLayoutId);
    Task<Progress?> GetByIdAsync(Guid id);
    Task<Progress> CreateAsync(Progress progress);
    Task<Progress?> UpdateAsync(Progress progress);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> UpdateCompletionPercentageAsync(Guid id, int percentage);
    Task<bool> UpdateStatusAsync(Guid id, string status);
}