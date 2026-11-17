namespace SistemaCandeyInventario.Domain.Entities;

public class BranchRequestDetail
{
    public int BranchRequestDetailId { get; set; }
    public int BranchRequestId { get; set; }
    public int ProductId { get; set; }
    public int RequestedQuantity { get; set; }

    public BranchRequest? BranchRequest { get; set; }
    public Product? Product { get; set; }
}
