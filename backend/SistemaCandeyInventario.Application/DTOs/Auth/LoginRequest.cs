using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Auth;

public class LoginRequest
{
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    [StringLength(50, MinimumLength = 1, ErrorMessage = "El usuario debe tener entre 1 y 50 caracteres.")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
    public string Password { get; set; } = string.Empty;
}
