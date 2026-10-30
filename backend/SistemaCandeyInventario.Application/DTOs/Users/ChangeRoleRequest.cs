using System.ComponentModel.DataAnnotations;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.DTOs.Users;

public class ChangeRoleRequest
{
    [EnumDataType(typeof(UserRole), ErrorMessage = "Seleccione un rol válido.")]
    public UserRole Role { get; set; }
}
