namespace ConstructionSitePlanner.DTOs;

public class CreateProgressDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid SiteLayoutId { get; set; }
    public string? ZoneShapeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ActualStartDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public int CompletionPercentage { get; set; } = 0;
    public string Status { get; set; } = "not_started";
    public string Color { get; set; } = "#1677ff";
    public string? ResponsiblePerson { get; set; }
    public string? Notes { get; set; }
    public List<Guid>? DependsOn { get; set; }
}