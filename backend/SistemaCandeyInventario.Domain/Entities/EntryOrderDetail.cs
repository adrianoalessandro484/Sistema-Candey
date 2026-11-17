namespace SistemaCandeyInventario.Domain.Entities;

public class EntryOrderDetail
{
    public int EntryOrderDetailId { get; set; }
    public int EntryOrderId { get; set; }
    public int ProductId { get; set; }
    public int RequestedQuantity { get; set; }

    public EntryOrder? EntryOrder { get; set; }
    public Product? Product { get; set; }
}
