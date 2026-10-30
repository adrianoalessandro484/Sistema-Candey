using SistemaCandeyInventario.Domain.Common;

namespace SistemaCandeyInventario.Domain.Entities;

public class Lot : BaseEntity
{
    public int LotId { get; set; }
    public int ProductId { get; set; }
    public string LotCode { get; set; } = string.Empty;
    public DateTime? ExpirationDate { get; set; }
    public int InitialQuantity { get; set; }
    public int AvailableQuantity { get; set; }

    public Product? Product { get; set; }
}
