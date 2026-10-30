using Microsoft.Extensions.DependencyInjection;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Application.Services;

namespace SistemaCandeyInventario.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IUnitService, UnitService>();
        services.AddScoped<ISupplierService, SupplierService>();
        services.AddScoped<IBranchService, BranchService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ILotService, LotService>();
        services.AddScoped<IEntryService, EntryService>();
        services.AddScoped<IExitService, ExitService>();
        services.AddScoped<IReportService, ReportService>();
        return services;
    }
}
