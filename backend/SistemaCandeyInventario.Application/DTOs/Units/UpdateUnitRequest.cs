using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Units;

public class UpdateUnitRequest
{
    [Required(ErrorMessage = "El nombre de la unidad es obligatorio.")]
    [StringLength(50, ErrorMessage = "El nombre no puede superar los 50 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "La abreviatura es obligatoria.")]
    [StringLength(10, ErrorMessage = "La abreviatura no puede superar los 10 caracteres.")]
    public string Abbreviation { get; set; } = string.Empty;

    [Range(1, int.MaxValue, ErrorMessage = "El factor debe ser mayor a cero.")]
    public int Factor { get; set; } = 1;

    public bool IsActive { get; set; }
}
