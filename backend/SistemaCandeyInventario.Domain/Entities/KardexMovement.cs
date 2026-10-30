namespace SistemaCandeyInventario.Domain.Entities;

/// <summary>Registro cronologico de movimientos de inventario (Kardex).</summary>
public class KardexMovement
{
    public int MovementId { get; set; }
    public int ProductId { get; set; }
    public int? LotId { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateTime MovementDate { get; set; }
    public string Reference { get; set; } = string.Empty;
    public int UserId { get; set; }
}
