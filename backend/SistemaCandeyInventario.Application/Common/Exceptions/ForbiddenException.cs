namespace SistemaCandeyInventario.Application.Common.Exceptions;

/// <summary>
/// El usuario autenticado no tiene permisos. El middleware lo traduce a HTTP 403.
/// </summary>
public class ForbiddenException : Exception
{
    public ForbiddenException(string mensaje) : base(mensaje)
    {
    }
}
