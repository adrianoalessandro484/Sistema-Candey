using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.EntryOrders;

public class CreateEntryOrderDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un proveedor.")]
    public int SupplierId { get; set; }

    public DateTime OrderDate { get; set; }

    public DateTime? ExpectedDate { get; set; }

    [StringLength(250, ErrorMessage = "La observación no puede superar los 250 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Agregue al menos un producto.")]
    [MinLength(1, ErrorMessage = "Agregue al menos un producto.")]
    public List<CreateEntryOrderLineDto> Lines { get; set; } = new();
}
