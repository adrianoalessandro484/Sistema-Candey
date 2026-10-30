using System.Text.Json;
using SistemaCandeyInventario.Application.Common.Exceptions;

namespace SistemaCandeyInventario.API.Middleware;

/// <summary>
/// Translates Application exceptions into HTTP responses with a simple JSON body.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException exception)
        {
            await WriteAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (UnauthorizedException exception)
        {
            await WriteAsync(context, StatusCodes.Status401Unauthorized, exception.Message);
        }
        catch (ForbiddenException exception)
        {
            await WriteAsync(context, StatusCodes.Status403Forbidden, exception.Message);
        }
        catch (NotFoundException exception)
        {
            await WriteAsync(context, StatusCodes.Status404NotFound, exception.Message);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Unhandled API error.");
            await WriteAsync(context, StatusCodes.Status500InternalServerError, "Ocurrió un error interno en el servidor.");
        }
    }

    private static async Task WriteAsync(HttpContext context, int statusCode, string message)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.Clear();
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(new { mensaje = message });
        await context.Response.WriteAsync(body);
    }
}
