namespace ConstructionSitePlanner.DTOs;

public class UpdateProgressDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ZoneShapeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public DateTime? ActualStartDate { get; set; }
    public DateTime? ActualEndDate { get; set; }
    public int CompletionPercentage { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? ResponsiblePerson { get; set; }
    public string? Notes { get; set; }
    public List<Guid>? DependsOn { get; set; }
}