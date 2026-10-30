namespace SistemaCandeyInventario.Application.DTOs.Reports;

public class ReportResponse
{
    public ReportSummary Summary { get; set; } = new();
    public List<StockReportItem> Stock { get; set; } = new();
    public List<RotationReportItem> Rotation { get; set; } = new();
    public List<AlertReportItem> Alerts { get; set; } = new();
}
