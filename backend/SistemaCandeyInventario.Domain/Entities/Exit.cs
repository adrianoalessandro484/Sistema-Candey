using SistemaCandeyInventario.Domain.Common;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Domain.Entities;

public class Exit : BaseEntity
{
    public int ExitId { get; set; }
    public string ExitCode { get; set; } = string.Empty;
    public DateTime ExitDate { get; set; }
    public string Reason { get; set; } = string.Empty;
    public int BranchId { get; set; }
    public string? Note { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = DocumentStatus.Registered;

    public Branch? Branch { get; set; }
    public List<ExitDetail> Details { get; set; } = new();
}
