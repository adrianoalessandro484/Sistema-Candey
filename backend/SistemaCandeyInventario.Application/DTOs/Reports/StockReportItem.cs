namespace SistemaCandeyInventario.Application.DTOs.Reports;

public class StockReportItem
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public int Stock { get; set; }
    public int MinStock { get; set; }
    public decimal Price { get; set; }
    public decimal Value { get; set; }
}
