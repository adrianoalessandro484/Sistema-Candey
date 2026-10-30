namespace SistemaCandeyInventario.Application.DTOs.Reports;

public class RotationReportItem
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Received { get; set; }
    public int Issued { get; set; }
    public int Balance { get; set; }
    public string Level { get; set; } = string.Empty;
}
