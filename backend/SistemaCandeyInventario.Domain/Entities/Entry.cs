using SistemaCandeyInventario.Domain.Common;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Domain.Entities;

public class Entry : BaseEntity
{
    public int EntryId { get; set; }
    public string EntryCode { get; set; } = string.Empty;
    public DateTime EntryDate { get; set; }
    public int SupplierId { get; set; }
    public string? Note { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = DocumentStatus.Registered;

    public Supplier? Supplier { get; set; }
    public List<EntryDetail> Details { get; set; } = new();
}
