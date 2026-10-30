using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Lot> Lots => Set<Lot>();
    public DbSet<Entry> Entries => Set<Entry>();
    public DbSet<EntryDetail> EntryDetails => Set<EntryDetail>();
    public DbSet<Exit> Exits => Set<Exit>();
    public DbSet<ExitDetail> ExitDetails => Set<ExitDetail>();
    public DbSet<KardexMovement> KardexMovements => Set<KardexMovement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
