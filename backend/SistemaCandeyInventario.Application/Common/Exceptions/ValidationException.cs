namespace SistemaCandeyInventario.Application.Common.Exceptions;

/// <summary>
/// Error de datos de entrada. El middleware lo traduce a HTTP 400.
/// </summary>
public class ValidationException : Exception
{
    public ValidationException(string mensaje) : base(mensaje)
    {
    }
}
