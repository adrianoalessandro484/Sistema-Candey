namespace SistemaCandeyInventario.Application.DTOs.BranchRequests;

public class BranchRequestLineResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string UnitName { get; set; } = string.Empty;
    public int RequestedQuantity { get; set; }
    public int CurrentStock { get; set; }
}
