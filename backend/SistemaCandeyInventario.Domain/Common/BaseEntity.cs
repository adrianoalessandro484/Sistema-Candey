namespace SistemaCandeyInventario.Domain.Common;

/// <summary>
/// Audit fields shared by all system entities.
/// Database columns keep the [Abbreviation]_[Entity] convention.
/// </summary>
public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public bool IsRegistered { get; set; } = true;
}

