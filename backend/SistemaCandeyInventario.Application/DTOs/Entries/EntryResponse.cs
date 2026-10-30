using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Entries;

public class EntryResponse
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalUnits { get; set; }
    public decimal TotalCost { get; set; }
    public List<EntryLineResponse> Lines { get; set; } = new();
}
