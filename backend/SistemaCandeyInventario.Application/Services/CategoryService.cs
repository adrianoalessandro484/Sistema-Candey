using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Categories;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IAppDbContext _context;

    public CategoryService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryResponse>> GetAllAsync(bool? active = null, CancellationToken ct = default)
    {
        var query = _context.Categories.AsQueryable();

        if (active.HasValue)
        {
            query = query.Where(category => category.IsActive == active.Value);
        }

        return await query
            .OrderBy(category => category.Name)
            .Select(category => new CategoryResponse
            {
                Id = category.CategoryId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<PagedResponse<CategoryResponse>> GetPagedAsync(PageQuery query, bool? active = null, CancellationToken ct = default)
    {
        var source = _context.Categories.AsQueryable();

        if (active.HasValue)
        {
            source = source.Where(category => category.IsActive == active.Value);
        }

        var term = query.SearchTerm.ToLowerInvariant();
        if (term.Length > 0)
        {
            source = source.Where(category =>
                category.Name.ToLower().Contains(term) ||
                (category.Description != null && category.Description.ToLower().Contains(term)));
        }

        var total = await source.CountAsync(ct);

        var items = await source
            .OrderBy(category => category.Name)
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(category => new CategoryResponse
            {
                Id = category.CategoryId,
                Name = category.Name,
                Description = category.Description,
                IsActive = category.IsActive
            })
            .ToListAsync(ct);

        return new PagedResponse<CategoryResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<CategoryResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(item => item.CategoryId == id, ct)
            ?? throw new NotFoundException("La categoría no existe.");

        return Map(category);
    }

    public async Task<CategoryResponse> CreateAsync(CreateCategoryRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        if (await _context.Categories.AnyAsync(item => item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una categoría con ese nombre.");
        }

        var category = new Category
        {
            Name = name,
            Description = request.Description?.Trim(),
            IsActive = request.IsActive,
            IsRegistered = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync(ct);

        return Map(category);
    }

    public async Task<CategoryResponse> UpdateAsync(int id, UpdateCategoryRequest request, CancellationToken ct = default)
    {
        var name = request.Name.Trim();

        var category = await _context.Categories.FirstOrDefaultAsync(item => item.CategoryId == id, ct)
            ?? throw new NotFoundException("La categoría no existe.");

        if (await _context.Categories.AnyAsync(item => item.CategoryId != id && item.Name == name, ct))
        {
            throw new ValidationException("Ya existe una categoría con ese nombre.");
        }

        category.Name = name;
        category.Description = request.Description?.Trim();
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(ct);
        return Map(category);
    }

    public async Task ChangeStatusAsync(int id, bool isActive, CancellationToken ct = default)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(item => item.CategoryId == id, ct)
            ?? throw new NotFoundException("La categoría no existe.");

        category.IsActive = isActive;
        category.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(item => item.CategoryId == id, ct)
            ?? throw new NotFoundException("La categoría no existe.");

        if (await _context.Products.AnyAsync(product => product.CategoryId == id && product.IsRegistered, ct))
        {
            throw new ValidationException("No se puede eliminar: la categoría tiene productos asociados.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync(ct);
    }

    private static CategoryResponse Map(Category category)
    {
        return new CategoryResponse
        {
            Id = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive
        };
    }
}
