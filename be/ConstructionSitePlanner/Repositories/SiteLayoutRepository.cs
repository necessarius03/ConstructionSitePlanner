using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public class SiteLayoutRepository : ISiteLayoutRepository
{
    private readonly ApplicationDbContext _context;

    public SiteLayoutRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SiteLayout>> GetAllAsync()
    {
        return await _context.SiteLayouts
            .OrderByDescending(x => x.UpdatedAt)
            .ToListAsync();
    }

    public async Task<SiteLayout?> GetByIdAsync(Guid id)
    {
        return await _context.SiteLayouts
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<SiteLayout> CreateAsync(SiteLayout siteLayout)
    {
        var now = DateTime.UtcNow;
        siteLayout.Id = Guid.NewGuid();
        siteLayout.CreatedAt = now;
        siteLayout.UpdatedAt = now;

        _context.SiteLayouts.Add(siteLayout);
        await _context.SaveChangesAsync();

        return siteLayout;
    }

    public async Task<SiteLayout?> UpdateAsync(SiteLayout siteLayout)
    {
        var existing = await _context.SiteLayouts.FindAsync(siteLayout.Id);
        if (existing == null)
            return null;

        // Update properties
        existing.Name = siteLayout.Name;
        existing.Description = siteLayout.Description;
        existing.ShapesJson = siteLayout.ShapesJson;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var siteLayout = await _context.SiteLayouts.FindAsync(id);
        if (siteLayout == null)
            return false;

        _context.SiteLayouts.Remove(siteLayout);
        await _context.SaveChangesAsync();
        return true;
    }
}