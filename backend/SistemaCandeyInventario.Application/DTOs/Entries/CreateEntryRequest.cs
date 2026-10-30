using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Entries;

public class CreateEntryRequest
{
    public DateTime Date { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un proveedor.")]
    public int SupplierId { get; set; }

    [StringLength(200, ErrorMessage = "La observación no puede superar los 200 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Agregue al menos un producto.")]
    [MinLength(1, ErrorMessage = "Agregue al menos un producto.")]
    public List<CreateEntryLineRequest> Lines { get; set; } = new();
}
