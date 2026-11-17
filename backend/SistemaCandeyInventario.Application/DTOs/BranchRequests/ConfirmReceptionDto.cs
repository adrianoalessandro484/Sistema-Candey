using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class ConfirmReceptionDto
{
    public bool HasIncident { get; set; }

    [StringLength(250, ErrorMessage = "La observación no puede superar los 250 caracteres.")]
    public string? Note { get; set; }
}
