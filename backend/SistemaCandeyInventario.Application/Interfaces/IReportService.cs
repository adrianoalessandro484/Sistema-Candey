using SistemaCandeyInventario.Application.DTOs.Reports;

namespace SistemaCandeyInventario.Application.Interfaces;

public interface IReportService
{
    Task<ReportResponse> GetReportAsync(DateTime? from, DateTime? to, CancellationToken ct = default);
    Task<List<AlertReportItem>> GetAlertsAsync(CancellationToken ct = default);
}
