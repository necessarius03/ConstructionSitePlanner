namespace ConstructionSitePlanner.DTOs;

public class UpdateEquipmentDto
{
    public string Name { get; set; } = string.Empty;
    public string IconName { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? Notes { get; set; }
}