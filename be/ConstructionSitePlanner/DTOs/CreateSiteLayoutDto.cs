namespace ConstructionSitePlanner.DTOs;

public class CreateSiteLayoutDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<ShapeDto> Shapes { get; set; } = new List<ShapeDto>();
}