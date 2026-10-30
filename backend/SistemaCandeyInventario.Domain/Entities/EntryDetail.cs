namespace SistemaCandeyInventario.Domain.Entities;

public class EntryDetail
{
    public int EntryDetailId { get; set; }
    public int EntryId { get; set; }
    public int ProductId { get; set; }
    public int LotId { get; set; }
    public string LotCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }

    public Entry? Entry { get; set; }
    public Product? Product { get; set; }
    public Lot? Lot { get; set; }
}
