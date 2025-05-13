namespace ConstructionSitePlanner.Entities;

public class Shape
{
    public string Id { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }
    public string Fill { get; set; } = string.Empty;
    public double Opacity { get; set; }
    public string Type { get; set; } = string.Empty;
    public bool IsSelected { get; set; }
    public string? Name { get; set; }
    public double? Rotation { get; set; }
    public string? EquipmentId { get; set; }
    public string? Notes { get; set; }
    public string? IconName { get; set; }
}