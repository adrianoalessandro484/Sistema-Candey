using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Products;

public class ProductResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int UnitId { get; set; }
    public string UnitName { get; set; } = string.Empty;
    public int MinStock { get; set; }
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}
