using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Infrastructure.Persistence;

/// <summary>
/// Initial data: administrator (admin / Candey123), catalogs, suppliers and branches.
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, IPasswordHasher passwordHasher, CancellationToken ct = default)
    {
        if (!await context.Users.AnyAsync(ct))
        {
            context.Users.AddRange(
                new User
                {
                    Name = "admin",
                    PasswordHash = passwordHasher.Hash("Candey123"),
                    Role = UserRole.Administrator,
                    HasAccess = true,
                    CreatedAt = DateTime.UtcNow,
                    IsRegistered = true
                },
                new User
                {
                    Name = "entrada",
                    PasswordHash = passwordHasher.Hash("Candey123"),
                    Role = UserRole.EntryClerk,
                    HasAccess = true,
                    CreatedAt = DateTime.UtcNow,
                    IsRegistered = true
                },
                new User
                {
                    Name = "salida",
                    PasswordHash = passwordHasher.Hash("Candey123"),
                    Role = UserRole.ExitClerk,
                    HasAccess = true,
                    CreatedAt = DateTime.UtcNow,
                    IsRegistered = true
                });
        }

        if (!await context.Categories.AnyAsync(ct))
        {
            context.Categories.AddRange(
                new Category { Name = "Maquillaje", Description = "Maquillaje en general", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Labiales", Description = "Labiales y gloss", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Unas", Description = "Esmaltes y cuidado de unas", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Accesorios", Description = "Peines, cepillos y accesorios", CreatedAt = DateTime.UtcNow },
                new Category { Name = "Cuidado facial", Description = "Cremas y tratamientos", CreatedAt = DateTime.UtcNow });
        }

        if (!await context.Units.AnyAsync(ct))
        {
            context.Units.AddRange(
                new Unit { Name = "Unidad", Abbreviation = "UND", Factor = 1, CreatedAt = DateTime.UtcNow },
                new Unit { Name = "Tira", Abbreviation = "TIR", Factor = 5, CreatedAt = DateTime.UtcNow },
                new Unit { Name = "Box", Abbreviation = "BOX", Factor = 12, CreatedAt = DateTime.UtcNow },
                new Unit { Name = "Caja", Abbreviation = "CJA", Factor = 144, CreatedAt = DateTime.UtcNow },
                new Unit { Name = "Pack", Abbreviation = "PK", Factor = 1, CreatedAt = DateTime.UtcNow });
        }

        if (!await context.Suppliers.AnyAsync(ct))
        {
            context.Suppliers.AddRange(
                new Supplier { Name = "Distribuidora Belleza SAC", TaxId = "20512345678", Phone = "987654321", Email = "ventas@belleza.pe", Address = "Av. Los Aromas 123, Lima", CreatedAt = DateTime.UtcNow },
                new Supplier { Name = "Import Cosmetic EIRL", TaxId = "20487654321", Phone = "912345678", Email = "contacto@importcosmetic.pe", Address = "Jr. Comercio 456, Arequipa", CreatedAt = DateTime.UtcNow });
        }

        if (!await context.Branches.AnyAsync(ct))
        {
            context.Branches.AddRange(
                new Branch { Name = "Sede Central", Address = "Av. Principal 100, Lima", Phone = "014567890", CreatedAt = DateTime.UtcNow },
                new Branch { Name = "Sucursal Norte", Address = "Av. Los Jazmines 250, Lima", Phone = "014567891", CreatedAt = DateTime.UtcNow });
        }

        await context.SaveChangesAsync(ct);
    }
}


