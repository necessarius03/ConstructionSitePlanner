using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public class EquipmentRepository : IEquipmentRepository
{
    private readonly ApplicationDbContext _context;

    public EquipmentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Equipment>> GetAllAsync()
    {
        return await _context.Equipment
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync();
    }

    public async Task<Equipment?> GetByIdAsync(Guid id)
    {
        return await _context.Equipment
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Equipment> CreateAsync(Equipment equipment)
    {
        var now = DateTime.UtcNow;
        equipment.Id = Guid.NewGuid();
        equipment.CreatedAt = now;
        equipment.UpdatedAt = now;

        _context.Equipment.Add(equipment);
        await _context.SaveChangesAsync();

        return equipment;
    }

    public async Task<Equipment?> UpdateAsync(Equipment equipment)
    {
        var existing = await _context.Equipment.FindAsync(equipment.Id);
        if (existing == null)
            return null;

        // Update properties
        existing.Name = equipment.Name;
        existing.IconName = equipment.IconName;
        existing.Width = equipment.Width;
        existing.Height = equipment.Height;
        existing.Description = equipment.Description;
        existing.Category = equipment.Category;
        existing.Color = equipment.Color;
        existing.Notes = equipment.Notes;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var equipment = await _context.Equipment.FindAsync(id);
        if (equipment == null)
            return false;

        _context.Equipment.Remove(equipment);
        await _context.SaveChangesAsync();
        return true;
    }
}