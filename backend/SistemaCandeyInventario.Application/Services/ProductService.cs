using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Products;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Services;

public class ProductService : IProductService
{
    private readonly IAppDbContext _context;

    public ProductService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProductResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default)
    {
        var query = _context.Products.Where(product => product.IsRegistered);

        if (active.HasValue)
        {
            query = query.Where(product => product.IsActive == active.Value);
        }

        return await query
            .OrderBy(product => product.Name)
            .Select(product => new ProductResponse
            {
                Id = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                CategoryId = product.CategoryId,
                CategoryName = product.Category != null ? product.Category.Name : string.Empty,
                UnitId = product.UnitId,
                UnitName = product.Unit != null ? product.Unit.Name : string.Empty,
                MinStock = product.MinStock,
                Stock = product.Stock,
                Price = product.Price,
                IsActive = product.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<PagedResponse<ProductResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default)
    {
        var source = _context.Products.Where(product => product.IsRegistered);

        if (active.HasValue)
        {
            source = source.Where(product => product.IsActive == active.Value);
        }

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(product =>
                product.Name.ToLower().Contains(term) ||
                (product.Description != null && product.Description.ToLower().Contains(term)) ||
                (product.Category != null && product.Category.Name.ToLower().Contains(term)) ||
                (product.Unit != null && product.Unit.Name.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderBy(product => product.Name)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(product => new ProductResponse
            {
                Id = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                CategoryId = product.CategoryId,
                CategoryName = product.Category != null ? product.Category.Name : string.Empty,
                UnitId = product.UnitId,
                UnitName = product.Unit != null ? product.Unit.Name : string.Empty,
                MinStock = product.MinStock,
                Stock = product.Stock,
                Price = product.Price,
                IsActive = product.IsActive
            })
            .ToListAsync(ct);

        return new PagedResponse<ProductResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<ProductResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await _context.Products
            .Where(item => item.ProductId == id && item.IsRegistered)
            .Select(item => new ProductResponse
            {
                Id = item.ProductId,
                Name = item.Name,
                Description = item.Description,
                CategoryId = item.CategoryId,
                CategoryName = item.Category != null ? item.Category.Name : string.Empty,
                UnitId = item.UnitId,
                UnitName = item.Unit != null ? item.Unit.Name : string.Empty,
                MinStock = item.MinStock,
                Stock = item.Stock,
                Price = item.Price,
                IsActive = item.IsActive
            })
            .FirstOrDefaultAsync(ct);

        return product ?? throw new NotFoundException("El producto no existe.");
    }

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        if (!await _context.Categories.AnyAsync(category => category.CategoryId == request.CategoryId, ct))
        {
            throw new ValidationException("La categoría no existe.");
        }

        if (!await _context.Units.AnyAsync(unit => unit.UnitId == request.UnitId, ct))
        {
            throw new ValidationException("La unidad no existe.");
        }

        if (await _context.Products.AnyAsync(product => product.Name == name, ct))
        {
            throw new ValidationException("Ya existe un producto con ese nombre.");
        }

        var product = new Product
        {
            Name = name,
            Description = request.Description?.Trim(),
            CategoryId = request.CategoryId,
            UnitId = request.UnitId,
            MinStock = request.MinStock,
            Stock = 0,
            Price = request.Price,
            IsActive = request.IsActive,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(ct);

        return await GetByIdAsync(product.ProductId, ct);
    }

    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        var product = await _context.Products.FirstOrDefaultAsync(item => item.ProductId == id, ct)
            ?? throw new NotFoundException("El producto no existe.");

        if (!await _context.Categories.AnyAsync(category => category.CategoryId == request.CategoryId, ct))
        {
            throw new ValidationException("La categoría no existe.");
        }

        if (!await _context.Units.AnyAsync(unit => unit.UnitId == request.UnitId, ct))
        {
            throw new ValidationException("La unidad no existe.");
        }

        if (await _context.Products.AnyAsync(item => item.ProductId != id && item.Name == name, ct))
        {
            throw new ValidationException("Ya existe un producto con ese nombre.");
        }

        product.Name = name;
        product.Description = request.Description?.Trim();
        product.CategoryId = request.CategoryId;
        product.UnitId = request.UnitId;
        product.MinStock = request.MinStock;
        product.Price = request.Price;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return await GetByIdAsync(id, ct);
    }

    public async Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default)
    {
        var product = await _context.Products.FirstOrDefaultAsync(item => item.ProductId == id, ct)
            ?? throw new NotFoundException("El producto no existe.");

        product.IsActive = isActive;
        product.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var product = await _context.Products.FirstOrDefaultAsync(item => item.ProductId == id, ct)
            ?? throw new NotFoundException("El producto no existe.");

        if (product.Stock > 0)
        {
            throw new ValidationException("No se puede eliminar un producto con existencias. Registre una salida primero.");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(ct);
    }
}
