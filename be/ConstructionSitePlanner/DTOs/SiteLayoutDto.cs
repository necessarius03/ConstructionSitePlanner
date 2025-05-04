namespace ConstructionSitePlanner.DTOs;

public class SiteLayoutDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<ShapeDto> Shapes { get; set; } = new List<ShapeDto>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}