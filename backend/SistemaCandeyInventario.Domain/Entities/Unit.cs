using SistemaCandeyInventario.Domain.Common;

namespace SistemaCandeyInventario.Domain.Entities;

/// <summary>Unidad / presentacion de empaque (Unidad, Tira, Box, Caja, ...).</summary>
public class Unit : BaseEntity
{
    public int UnitId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;

    /// <summary>Cuantas unidades base contiene (ej. Box = 12, Caja = 144).</summary>
    public int Factor { get; set; } = 1;

    public bool IsActive { get; set; } = true;
}
