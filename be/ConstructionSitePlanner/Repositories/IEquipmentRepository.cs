using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public interface IEquipmentRepository
{
    Task<IEnumerable<Equipment>> GetAllAsync();
    Task<Equipment?> GetByIdAsync(Guid id);
    Task<Equipment> CreateAsync(Equipment equipment);
    Task<Equipment?> UpdateAsync(Equipment equipment);
    Task<bool> DeleteAsync(Guid id);
}