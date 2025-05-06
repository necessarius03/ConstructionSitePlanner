using ConstructionSitePlanner.DTOs;
using ConstructionSitePlanner.Entities;
using ConstructionSitePlanner.Repositories;

namespace ConstructionSitePlanner.Services;

public class EquipmentService : IEquipmentService
{
    private readonly IEquipmentRepository _repository;

    public EquipmentService(IEquipmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EquipmentDto>> GetAllAsync()
    {
        var equipment = await _repository.GetAllAsync();
        return equipment.Select(ToDto);
    }

    public async Task<EquipmentDto?> GetByIdAsync(Guid id)
    {
        var equipment = await _repository.GetByIdAsync(id);
        return equipment != null ? ToDto(equipment) : null;
    }

    public async Task<EquipmentDto> CreateAsync(CreateEquipmentDto createDto)
    {
        var equipment = new Equipment
        {
            Name = createDto.Name,
            IconName = createDto.IconName,
            Width = createDto.Width,
            Height = createDto.Height,
            Description = createDto.Description,
            Category = createDto.Category,
            Color = createDto.Color,
            Notes = createDto.Notes
        };

        var created = await _repository.CreateAsync(equipment);
        return ToDto(created);
    }

    public async Task<EquipmentDto?> UpdateAsync(Guid id, UpdateEquipmentDto updateDto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing == null)
            return null;

        existing.Name = updateDto.Name;
        existing.IconName = updateDto.IconName;
        existing.Width = updateDto.Width;
        existing.Height = updateDto.Height;
        existing.Description = updateDto.Description;
        existing.Category = updateDto.Category;
        existing.Color = updateDto.Color;
        existing.Notes = updateDto.Notes;

        var updated = await _repository.UpdateAsync(existing);
        return updated != null ? ToDto(updated) : null;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }

    private EquipmentDto ToDto(Equipment equipment)
    {
        return new EquipmentDto
        {
            Id = equipment.Id,
            Name = equipment.Name,
            IconName = equipment.IconName,
            Width = equipment.Width,
            Height = equipment.Height,
            Description = equipment.Description,
            Category = equipment.Category,
            Color = equipment.Color,
            Notes = equipment.Notes,
            CreatedAt = equipment.CreatedAt,
            UpdatedAt = equipment.UpdatedAt
        };
    }
}