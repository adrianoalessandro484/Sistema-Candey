using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Branches;

public class UpdateBranchRequest
{
    [Required(ErrorMessage = "El nombre de la sucursal es obligatorio.")]
    [StringLength(80, ErrorMessage = "El nombre no puede superar los 80 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "La dirección no puede superar los 200 caracteres.")]
    public string? Address { get; set; }

    [StringLength(20, ErrorMessage = "El teléfono no puede superar los 20 caracteres.")]
    public string? Phone { get; set; }

    public bool IsActive { get; set; }
}
