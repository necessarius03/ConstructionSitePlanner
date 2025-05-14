namespace ConstructionSitePlanner.Entities;

public class Progress
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid SiteLayoutId { get; set; }
    public string? ZoneShapeId { get; set; } // Liên kết với một zone/shape trên mặt bằng (không bắt buộc)
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ActualStartDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public int CompletionPercentage { get; set; } // 0-100
    public string Status { get; set; } = string.Empty; // "not_started", "in_progress", "completed", "delayed"
    public string Color { get; set; } = string.Empty; // Màu hiển thị trên timeline/gantt
    public string? ResponsiblePerson { get; set; }
    public string? Notes { get; set; }
    public string? DependsOn { get; set; } // JSON array of Progress IDs that this task depends on
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}