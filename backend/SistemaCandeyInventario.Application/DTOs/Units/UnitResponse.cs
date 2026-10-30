using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Units;

public class UnitResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Abbreviation { get; set; } = string.Empty;
    public int Factor { get; set; }
    public bool IsActive { get; set; }
}
