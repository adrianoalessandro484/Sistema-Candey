namespace SistemaCandeyInventario.Application.Common.Exceptions;

/// <summary>
/// Credenciales incorrectas o acceso deshabilitado. El middleware lo traduce a HTTP 401.
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string mensaje) : base(mensaje)
    {
    }
}
