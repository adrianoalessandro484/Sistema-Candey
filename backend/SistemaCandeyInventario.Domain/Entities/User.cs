using SistemaCandeyInventario.Domain.Common;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Domain.Entities;

/// <summary>
/// System user. Only the Administrator manages this entity.
/// </summary>
public class User : BaseEntity
{
    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.ExitClerk;

    public bool HasAccess { get; set; } = true;

    public int? BranchId { get; set; }

    public Branch? Branch { get; set; }
}
