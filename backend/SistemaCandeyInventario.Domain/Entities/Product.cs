using SistemaCandeyInventario.Domain.Common;

namespace SistemaCandeyInventario.Domain.Entities;

public class Product : BaseEntity
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public int UnitId { get; set; }
    public int MinStock { get; set; }

    /// <summary>Current stock in base units. It is updated only by Kardex movements.</summary>
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;

    public Category? Category { get; set; }
    public Unit? Unit { get; set; }
}

