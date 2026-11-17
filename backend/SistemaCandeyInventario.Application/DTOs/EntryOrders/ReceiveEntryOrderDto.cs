using System.ComponentModel.DataAnnotations;
using SistemaCandeyInventario.Application.DTOs.Entries;

namespace SistemaCandeyInventario.Application.DTOs.EntryOrders;

public class ReceiveEntryOrderDto
{
    public DateTime Date { get; set; }

    [StringLength(200, ErrorMessage = "La observación no puede superar los 200 caracteres.")]
    public string? Note { get; set; }

    [Required(ErrorMessage = "Agregue al menos un lote ingresado.")]
    [MinLength(1, ErrorMessage = "Agregue al menos un lote ingresado.")]
    public List<CreateEntryLineRequest> Lines { get; set; } = new();
}
