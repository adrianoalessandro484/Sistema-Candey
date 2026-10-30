using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Entries;

public class CreateEntryLineRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un producto.")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Indique el lote.")]
    [StringLength(60, ErrorMessage = "El lote no puede superar los 60 caracteres.")]
    public string LotCode { get; set; } = string.Empty;

    public DateTime? ExpirationDate { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero.")]
    public int Quantity { get; set; }

    [Range(0, 999999999.99, ErrorMessage = "El costo no puede ser negativo.")]
    public decimal UnitCost { get; set; }
}
