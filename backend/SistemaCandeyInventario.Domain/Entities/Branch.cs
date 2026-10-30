using SistemaCandeyInventario.Domain.Common;

namespace SistemaCandeyInventario.Domain.Entities;

public class Branch : BaseEntity
{
    public int BranchId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
}
