namespace SistemaCandeyInventario.Domain.Enums;

public static class BranchRequestStatus
{
    public const string Pending = "Pendiente";
    public const string InTransit = "En camino";
    public const string Received = "Recibido";
    public const string Observed = "Observado";
    public const string Rejected = "Rechazado";
    public const string Cancelled = "Cancelado";
}
