namespace SistemaCandeyInventario.Application.DTOs.EntryOrders;

public class EntryOrderResponse
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDate { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public int CreatedByUserId { get; set; }
    public string CreatedByUserName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string Status { get; set; } = string.Empty;

    public int? EntryId { get; set; }
    public string? EntryCode { get; set; }
    public int? ReceivedByUserId { get; set; }
    public string? ReceivedByUserName { get; set; }
    public DateTime? ReceivedAt { get; set; }

    public int TotalUnits { get; set; }
    public List<EntryOrderLineResponse> Lines { get; set; } = new();
}
