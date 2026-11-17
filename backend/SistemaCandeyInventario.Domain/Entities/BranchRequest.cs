using SistemaCandeyInventario.Domain.Common;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Domain.Entities;

public class BranchRequest : BaseEntity
{
    public int BranchRequestId { get; set; }
    public string RequestCode { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public int BranchId { get; set; }
    public int RequestedByUserId { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = BranchRequestStatus.Pending;

    public int? ReviewedByUserId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? RejectionReason { get; set; }

    public int? ExitId { get; set; }
    public DateTime? DispatchedAt { get; set; }

    public int? ReceivedByUserId { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string? ReceptionNote { get; set; }

    public Branch? Branch { get; set; }
    public User? RequestedByUser { get; set; }
    public User? ReviewedByUser { get; set; }
    public User? ReceivedByUser { get; set; }
    public Exit? Exit { get; set; }
    public List<BranchRequestDetail> Details { get; set; } = new();
}
