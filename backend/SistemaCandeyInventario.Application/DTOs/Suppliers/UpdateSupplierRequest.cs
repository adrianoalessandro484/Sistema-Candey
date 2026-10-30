using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Suppliers;

public class UpdateSupplierRequest
{
    [Required(ErrorMessage = "La razón social es obligatoria.")]
    [StringLength(100, ErrorMessage = "La razón social no puede superar los 100 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "El RUC es obligatorio.")]
    [StringLength(11, MinimumLength = 11, ErrorMessage = "El RUC debe tener 11 dígitos.")]
    public string TaxId { get; set; } = string.Empty;

    [StringLength(20, ErrorMessage = "El teléfono no puede superar los 20 caracteres.")]
    public string? Phone { get; set; }

    [EmailAddress(ErrorMessage = "Ingrese un correo válido.")]
    [StringLength(100, ErrorMessage = "El correo no puede superar los 100 caracteres.")]
    public string? Email { get; set; }

    [StringLength(200, ErrorMessage = "La dirección no puede superar los 200 caracteres.")]
    public string? Address { get; set; }

    public bool IsActive { get; set; }
}
