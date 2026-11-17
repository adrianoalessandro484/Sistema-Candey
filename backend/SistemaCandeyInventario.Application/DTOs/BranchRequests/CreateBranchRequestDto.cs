using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class CreateBranchRequestDto
{
    public DateTime Date { get; set; }

    public int? BranchId { get; set; }

    [StringLength(250, ErrorMessage = "La observación no puede superar los 250 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Agregue al menos un producto.")]
    [MinLength(1, ErrorMessage = "Agregue al menos un producto.")]
    public List<CreateBranchRequestLineDto> Lines { get; set; } = new();
}
