using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Common.Interfaces;

/// <summary>
/// Data context abstraction defined by Application and implemented by Infrastructure.
/// </summary>
public interface IAppDbContext
{
    DbSet<Category> Categories { get; }
    DbSet<Unit> Units { get; }
    DbSet<Supplier> Suppliers { get; }
    DbSet<Branch> Branches { get; }
    DbSet<Product> Products { get; }
    DbSet<Lot> Lots { get; }
    DbSet<Entry> Entries { get; }
    DbSet<EntryDetail> EntryDetails { get; }
    DbSet<Exit> Exits { get; }
    DbSet<ExitDetail> ExitDetails { get; }
    DbSet<KardexMovement> KardexMovements { get; }

    Task<int> SaveChangesAsync(CancellationToken ct = default);
}

