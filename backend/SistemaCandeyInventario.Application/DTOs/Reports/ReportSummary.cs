namespace SistemaCandeyInventario.Application.DTOs.Reports;

public class ReportSummary
{
    public int TotalProducts { get; set; }
    public int Units { get; set; }
    public decimal InventoryValue { get; set; }
    public int LowStock { get; set; }
    public int OutOfStock { get; set; }
}
