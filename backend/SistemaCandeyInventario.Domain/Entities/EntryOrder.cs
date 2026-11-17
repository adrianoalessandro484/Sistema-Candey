using SistemaCandeyInventario.Domain.Common;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Domain.Entities;

public class EntryOrder : BaseEntity
{
    public int EntryOrderId { get; set; }
    public string OrderCode { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDate { get; set; }
    public int SupplierId { get; set; }
    public int CreatedByUserId { get; set; }
    public string? Note { get; set; }
    public string Status { get; set; } = EntryOrderStatus.Pending;

    public int? EntryId { get; set; }
    public int? ReceivedByUserId { get; set; }
    public DateTime? ReceivedAt { get; set; }

    public Supplier? Supplier { get; set; }
    public User? CreatedByUser { get; set; }
    public User? ReceivedByUser { get; set; }
    public Entry? Entry { get; set; }
    public List<EntryOrderDetail> Details { get; set; } = new();
}
