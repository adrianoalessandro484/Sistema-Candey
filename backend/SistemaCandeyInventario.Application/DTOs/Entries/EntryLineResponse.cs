using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Entries;

public class EntryLineResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string LotCode { get; set; } = string.Empty;
    public DateTime? ExpirationDate { get; set; }
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
}
