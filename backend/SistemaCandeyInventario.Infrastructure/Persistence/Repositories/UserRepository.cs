using Microsoft.EntityFrameworkCore;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .Where(user => user.IsRegistered)
            .OrderBy(user => user.Name)
            .ToListAsync(ct);
    }

    public async Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(user => user.UserId == id && user.IsRegistered, ct);
    }

    public async Task<User?> GetByUserNameAsync(string userName, CancellationToken ct = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(user => user.Name == userName && user.IsRegistered, ct);
    }

    public async Task<bool> ExistsUserNameAsync(string userName, int? excludeId = null, CancellationToken ct = default)
    {
        return await _context.Users
            .AnyAsync(user =>
                user.Name == userName &&
                user.IsRegistered &&
                (!excludeId.HasValue || user.UserId != excludeId.Value), ct);
    }

    public async Task<int> CountActiveAdministratorsAsync(CancellationToken ct = default)
    {
        return await _context.Users
            .CountAsync(user =>
                user.IsRegistered &&
                user.HasAccess &&
                user.Role == UserRole.Administrator, ct);
    }

    public async Task<int> CreateAsync(User user, CancellationToken ct = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(ct);
        return user.UserId;
    }

    public async Task UpdateAsync(User user, CancellationToken ct = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(User user, CancellationToken ct = default)
    {
        user.IsRegistered = false;
        user.UpdatedAt = DateTime.UtcNow;
        _context.Users.Update(user);
        await _context.SaveChangesAsync(ct);
    }
}
