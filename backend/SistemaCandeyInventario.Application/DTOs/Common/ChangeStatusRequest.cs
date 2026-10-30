using System.ComponentModel.DataAnnotations;

namespace SistemaCandeyInventario.Application.DTOs.Common;

public class ChangeStatusRequest
{
    public bool IsActive { get; set; }
}
