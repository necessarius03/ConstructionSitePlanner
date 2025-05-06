using ConstructionSitePlanner.DTOs;

namespace ConstructionSitePlanner.Services;

public interface IEquipmentService
{
    Task<IEnumerable<EquipmentDto>> GetAllAsync();
    Task<EquipmentDto?> GetByIdAsync(Guid id);
    Task<EquipmentDto> CreateAsync(CreateEquipmentDto createDto);
    Task<EquipmentDto?> UpdateAsync(Guid id, UpdateEquipmentDto updateDto);
    Task<bool> DeleteAsync(Guid id);
}