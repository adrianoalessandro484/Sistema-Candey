using System.ComponentModel.DataAnnotations;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.DTOs.Users;

public class CreateUserRequest
{
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    [StringLength(50, ErrorMessage = "El usuario no puede superar los 50 caracteres.")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [MinLength(6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres.")]
    [StringLength(100, ErrorMessage = "La contraseña no puede superar los 100 caracteres.")]
    public string Password { get; set; } = string.Empty;

    [EnumDataType(typeof(UserRole), ErrorMessage = "Seleccione un rol válido.")]
    public UserRole Role { get; set; }
}
