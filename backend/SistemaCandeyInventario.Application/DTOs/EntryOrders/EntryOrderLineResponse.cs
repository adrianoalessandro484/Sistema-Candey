namespace SistemaCandeyInventario.Application.DTOs.EntryOrders;

public class EntryOrderLineResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public int RequestedQuantity { get; set; }
}
