namespace SistemaCandeyInventario.Application.Common.Exceptions;

/// <summary>
/// Recurso inexistente. El middleware lo traduce a HTTP 404.
/// </summary>
public class NotFoundException : Exception
{
    public NotFoundException(string mensaje) : base(mensaje)
    {
    }
}
