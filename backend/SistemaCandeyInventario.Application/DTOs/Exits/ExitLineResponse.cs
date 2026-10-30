using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Exits;

public class ExitLineResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int LotId { get; set; }
    public string LotCode { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
