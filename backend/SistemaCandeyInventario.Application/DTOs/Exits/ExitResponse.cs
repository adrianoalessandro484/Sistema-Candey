using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Exits;

public class ExitResponse
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Reason { get; set; } = string.Empty;
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalUnits { get; set; }
    public List<ExitLineResponse> Lines { get; set; } = new();
}
