using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Products;

public class UpdateProductRequest
{
    [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
    [StringLength(80, ErrorMessage = "El nombre no puede superar los 80 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(200, ErrorMessage = "La descripción no puede superar los 200 caracteres.")]
    public string? Description { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Seleccione una categoría.")]
    public int CategoryId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Seleccione una unidad.")]
    public int UnitId { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "El stock mínimo no puede ser negativo.")]
    public int MinStock { get; set; }

    [Range(0, 999999999.99, ErrorMessage = "El precio no puede ser negativo.")]
    public decimal Price { get; set; }

    public bool IsActive { get; set; }
}
