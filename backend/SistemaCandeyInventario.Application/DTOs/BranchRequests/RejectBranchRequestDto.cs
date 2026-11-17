using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class RejectBranchRequestDto
{
    [Required(ErrorMessage = "Indique el motivo del rechazo.")]
    [StringLength(250, ErrorMessage = "El motivo no puede superar los 250 caracteres.")]
    public string Reason { get; set; } = string.Empty;
}
