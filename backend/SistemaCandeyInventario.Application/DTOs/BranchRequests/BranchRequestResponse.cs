namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class BranchRequestResponse
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int BranchId { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int RequestedByUserId { get; set; }
    public string RequestedByUserName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string Status { get; set; } = string.Empty;

    public int? ReviewedByUserId { get; set; }
    public string? ReviewedByUserName { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }

    public int? ExitId { get; set; }
    public string? ExitCode { get; set; }
    public DateTime? DispatchedAt { get; set; }

    public int? ReceivedByUserId { get; set; }
    public string? ReceivedByUserName { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string? ReceptionNote { get; set; }

    public int TotalUnits { get; set; }
    public List<BranchRequestLineResponse> Lines { get; set; } = new();
}
