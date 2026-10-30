using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Exits;

public class CreateExitLineRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "Seleccione un producto.")]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Seleccione el lote.")]
    public int LotId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "La cantidad debe ser mayor a cero.")]
    public int Quantity { get; set; }
}
