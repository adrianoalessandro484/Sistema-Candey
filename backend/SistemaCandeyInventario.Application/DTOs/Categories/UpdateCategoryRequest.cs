using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Categories;

public class UpdateCategoryRequest
{
    [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
    [StringLength(60, ErrorMessage = "El nombre no puede superar los 60 caracteres.")]
    public string Name { get; set; } = string.Empty;

    [StringLength(150, ErrorMessage = "La descripción no puede superar los 150 caracteres.")]
    public string? Description { get; set; }

    public bool IsActive { get; set; }
}
