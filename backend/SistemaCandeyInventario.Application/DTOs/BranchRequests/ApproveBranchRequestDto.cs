using System.ComponentModel.DataAnnotations;
using SistemaCandeyInventario.Application.DTOs.Exits;

namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class ApproveBranchRequestDto
{
    public DateTime Date { get; set; }

    [StringLength(200, ErrorMessage = "La observación no puede superar los 200 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Asigne al menos un lote para el despacho.")]
    [MinLength(1, ErrorMessage = "Asigne al menos un lote para el despacho.")]
    public List<CreateExitLineRequest> Lines { get; set; } = new();
}
