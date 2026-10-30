namespace SistemaCandeyInventario.Domain.Entities;

public class ExitDetail
{
    public int ExitDetailId { get; set; }
    public int ExitId { get; set; }
    public int ProductId { get; set; }
    public int LotId { get; set; }
    public string LotCode { get; set; } = string.Empty;
    public int Quantity { get; set; }

    public Exit? Exit { get; set; }
    public Product? Product { get; set; }
    public Lot? Lot { get; set; }
}
