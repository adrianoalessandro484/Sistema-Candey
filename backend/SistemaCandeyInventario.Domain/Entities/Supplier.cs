using SistemaCandeyInventario.Domain.Common;

namespace SistemaCandeyInventario.Domain.Entities;

public class Supplier : BaseEntity
{
    public int SupplierId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;
}
