namespace SistemaCandeyInventario.Application.DTOs.Products;

public class LotResponse
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string LotCode { get; set; } = string.Empty;
    public DateTime? ExpirationDate { get; set; }
    public int InitialQuantity { get; set; }
    public int AvailableQuantity { get; set; }
}
