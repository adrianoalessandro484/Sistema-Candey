using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Exits;

public class CreateExitRequest
{
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "El motivo es obligatorio.")]
    [StringLength(100, ErrorMessage = "El motivo no puede superar los 100 caracteres.")]
    public string Reason { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "Seleccione una sucursal.")]
    public int BranchId { get; set; }

    [StringLength(200, ErrorMessage = "La observación no puede superar los 200 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Agregue al menos un producto.")]
    [MinLength(1, ErrorMessage = "Agregue al menos un producto.")]
    public List<CreateExitLineRequest> Lines { get; set; } = new();
}
