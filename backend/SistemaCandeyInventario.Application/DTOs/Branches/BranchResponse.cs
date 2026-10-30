using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Branches;

public class BranchResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
}
