using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.EntryOrders;

public class CreateEntryOrderLineDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un producto.")]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero.")]
    public int Quantity { get; set; }
}
