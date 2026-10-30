namespace SistemaCandeyInventario.Application.DTOs.Reports;

public class AlertReportItem
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinStock { get; set; }
    public int Missing { get; set; }
}
