using Microsoft.EntityFrameworkCore;
using ConstructionSitePlanner.Data;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Repositories;

public class ProgressRepository : IProgressRepository
{
    private readonly ApplicationDbContext _context;

    public ProgressRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Progress>> GetAllAsync()
    {
        return await _context.Progress
            .OrderBy(x => x.StartDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Progress>> GetBySiteLayoutIdAsync(Guid siteLayoutId)
    {
        return await _context.Progress
            .Where(x => x.SiteLayoutId == siteLayoutId)
            .OrderBy(x => x.StartDate)
            .ToListAsync();
    }

    public async Task<Progress?> GetByIdAsync(Guid id)
    {
        return await _context.Progress
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Progress> CreateAsync(Progress progress)
    {
        var now = DateTime.UtcNow;
        progress.Id = Guid.NewGuid();
        progress.CreatedAt = now;
        progress.UpdatedAt = now;

        _context.Progress.Add(progress);
        await _context.SaveChangesAsync();

        return progress;
    }

    public async Task<Progress?> UpdateAsync(Progress progress)
    {
        var existing = await _context.Progress.FindAsync(progress.Id);
        if (existing == null)
            return null;

        // Update properties
        existing.Name = progress.Name;
        existing.Description = progress.Description;
        existing.ZoneShapeId = progress.ZoneShapeId;
        existing.StartDate = progress.StartDate;
        existing.EndDate = progress.EndDate;
        existing.ActualStartDate = progress.ActualStartDate;
        existing.ActualEndDate = progress.ActualEndDate;
        existing.CompletionPercentage = progress.CompletionPercentage;
        existing.Status = progress.Status;
        existing.Color = progress.Color;
        existing.ResponsiblePerson = progress.ResponsiblePerson;
        existing.Notes = progress.Notes;
        existing.DependsOn = progress.DependsOn;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var progress = await _context.Progress.FindAsync(id);
        if (progress == null)
            return false;

        _context.Progress.Remove(progress);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateCompletionPercentageAsync(Guid id, int percentage)
    {
        var progress = await _context.Progress.FindAsync(id);
        if (progress == null)
            return false;

        progress.CompletionPercentage = Math.Clamp(percentage, 0, 100);
        progress.UpdatedAt = DateTime.UtcNow;

        // Cập nhật trạng thái dựa trên phần trăm hoàn thành
        if (percentage == 0)
        {
            progress.Status = "not_started";
        }
        else if (percentage == 100)
        {
            progress.Status = "completed";
            progress.ActualEndDate = DateTime.UtcNow;
        }
        else
        {
            progress.Status = "in_progress";
            if (progress.ActualStartDate == null)
            {
                progress.ActualStartDate = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateStatusAsync(Guid id, string status)
    {
        var progress = await _context.Progress.FindAsync(id);
        if (progress == null)
            return false;

        var now = DateTime.UtcNow;
        progress.Status = status;
        progress.UpdatedAt = now;

        // Cập nhật thông tin bổ sung dựa trên trạng thái
        switch (status)
        {
            case "not_started":
                progress.CompletionPercentage = 0;
                progress.ActualStartDate = null;
                progress.ActualEndDate = null;
                break;
            case "in_progress":
                if (progress.ActualStartDate == null)
                {
                    progress.ActualStartDate = now;
                }
                if (progress.CompletionPercentage == 0)
                {
                    progress.CompletionPercentage = 10;
                }
                break;
            case "completed":
                progress.CompletionPercentage = 100;
                if (progress.ActualStartDate == null)
                {
                    progress.ActualStartDate = now;
                }
                progress.ActualEndDate = now;
                break;
            case "delayed":
                if (progress.ActualStartDate == null)
                {
                    progress.ActualStartDate = now;
                }
                break;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}