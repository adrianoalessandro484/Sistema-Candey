using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Suppliers;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Services;

public class SupplierService : ISupplierService
{
    private readonly IAppDbContext _context;

    public SupplierService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SupplierResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default)
    {
        var query = _context.Suppliers.AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(supplier => supplier.IsActive == active.Value);
        }

        return await query
            .OrderBy(supplier => supplier.Name)
            .Select(supplier => new SupplierResponse
            {
                Id = supplier.SupplierId,
                Name = supplier.Name,
                TaxId = supplier.TaxId,
                Phone = supplier.Phone,
                Email = supplier.Email,
                Address = supplier.Address,
                IsActive = supplier.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<PagedResponse<SupplierResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default)
    {
        var source = _context.Suppliers.AsQueryable();

        if (active.HasValue)
        {
            source = source.Where(supplier => supplier.IsActive == active.Value);
        }

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(supplier =>
                supplier.Name.ToLower().Contains(term) ||
                supplier.TaxId.ToLower().Contains(term) ||
                (supplier.Phone != null && supplier.Phone.ToLower().Contains(term)) ||
                (supplier.Email != null && supplier.Email.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderBy(supplier => supplier.Name)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(supplier => new SupplierResponse
            {
                Id = supplier.SupplierId,
                Name = supplier.Name,
                TaxId = supplier.TaxId,
                Phone = supplier.Phone,
                Email = supplier.Email,
                Address = supplier.Address,
                IsActive = supplier.IsActive
            })
            .ToListAsync(ct);

        return new PagedResponse<SupplierResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<SupplierResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var supplier = await _context.Suppliers.FirstOrDefaultAsync(item => item.SupplierId == id, ct)
            ?? throw new NotFoundException("El proveedor no existe.");

        return Map(supplier);
    }

    public async Task<SupplierResponse> CreateAsync(CreateSupplierRequest request, CancellationToken ct = default)
    {
        var taxId = request.TaxId.Trim();

        if (await _context.Suppliers.AnyAsync(item => item.TaxId == taxId, ct))
        {
            throw new ValidationException("Ya existe un proveedor con ese RUC.");
        }

        var supplier = new Supplier
        {
            Name = request.Name.Trim(),
            TaxId = taxId,
            Phone = request.Phone?.Trim(),
            Email = request.Email?.Trim(),
            Address = request.Address?.Trim(),
            IsActive = request.IsActive,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Suppliers.Add(supplier);
        await _context.SaveChangesAsync(ct);

        return Map(supplier);
    }

    public async Task<SupplierResponse> UpdateAsync(int id, UpdateSupplierRequest request, CancellationToken ct = default)
    {
        var taxId = request.TaxId.Trim();

        var supplier = await _context.Suppliers.FirstOrDefaultAsync(item => item.SupplierId == id, ct)
            ?? throw new NotFoundException("El proveedor no existe.");

        if (await _context.Suppliers.AnyAsync(item => item.SupplierId != id && item.TaxId == taxId, ct))
        {
            throw new ValidationException("Ya existe un proveedor con ese RUC.");
        }

        supplier.Name = request.Name.Trim();
        supplier.TaxId = taxId;
        supplier.Phone = request.Phone?.Trim();
        supplier.Email = request.Email?.Trim();
        supplier.Address = request.Address?.Trim();
        supplier.IsActive = request.IsActive;
        supplier.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Map(supplier);
    }

    public async Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default)
    {
        var supplier = await _context.Suppliers.FirstOrDefaultAsync(item => item.SupplierId == id, ct)
            ?? throw new NotFoundException("El proveedor no existe.");

        supplier.IsActive = isActive;
        supplier.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var supplier = await _context.Suppliers.FirstOrDefaultAsync(item => item.SupplierId == id, ct)
            ?? throw new NotFoundException("El proveedor no existe.");

        if (await _context.Entries.AnyAsync(entry => entry.SupplierId == id, ct))
        {
            throw new ValidationException("No se puede eliminar: el proveedor tiene entradas registradas.");
        }

        _context.Suppliers.Remove(supplier);
        await _context.SaveChangesAsync(ct);
    }

    private static SupplierResponse Map(Supplier supplier)
    {
        return new SupplierResponse
        {
            Id = supplier.SupplierId,
            Name = supplier.Name,
            TaxId = supplier.TaxId,
            Phone = supplier.Phone,
            Email = supplier.Email,
            Address = supplier.Address,
            IsActive = supplier.IsActive
        };
    }
}
