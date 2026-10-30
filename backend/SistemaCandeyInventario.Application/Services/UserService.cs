using SistemaCandeyInventario.Application.Common.Exceptions;
using SistemaCandeyInventario.Application.Common.Interfaces;
using SistemaCandeyInventario.Application.DTOs.Common;
using SistemaCandeyInventario.Application.DTOs.Users;
using SistemaCandeyInventario.Application.Interfaces;
using SistemaCandeyInventario.Domain.Entities;
using SistemaCandeyInventario.Domain.Enums;

namespace SistemaCandeyInventario.Application.Services;

public class UserService : IUserService
{
    private const int MinimumPasswordLength = 6;
    private const int MaximumUserNameLength = 50;

    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<List<UserResponse>> GetAllAsync(CancellationToken ct = default)
    {
        var users = await _userRepository.GetAllAsync(ct);
        return users.Select(Map).ToList();
    }

    public async Task<PagedResponse<UserResponse>> GetPagedAsync(PageQuery query, CancellationToken ct = default)
    {
        var users = await _userRepository.GetAllAsync(ct);
        var term = query.SearchTerm.ToLowerInvariant();

        if (term.Length > 0)
        {
            users = users
                .Where(user =>
                    user.Name.ToLowerInvariant().Contains(term) ||
                    user.Role.ToString().ToLowerInvariant().Contains(term))
                .ToList();
        }

        var total = users.Count;
        var items = users
            .Skip(query.Skip)
            .Take(query.NormalizedPageSize)
            .Select(Map)
            .ToList();

        return new PagedResponse<UserResponse>
        {
            Items = items,
            Page = query.NormalizedPage,
            PageSize = query.NormalizedPageSize,
            TotalItems = total
        };
    }

    public async Task<UserResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        ValidateId(id);

        var user = await _userRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("El usuario no existe.");

        return Map(user);
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        ValidateUserName(request.UserName);
        ValidatePassword(request.Password, required: true);
        ValidateRole(request.Role);

        var userName = request.UserName.Trim();

        if (await _userRepository.ExistsUserNameAsync(userName, null, ct))
        {
            throw new ValidationException("Ya existe un usuario con ese nombre.");
        }

        var user = new User
        {
            Name = userName,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = request.Role,
            HasAccess = true,
            CreatedAt = DateTime.UtcNow,
            IsRegistered = true
        };

        user.UserId = await _userRepository.CreateAsync(user, ct);

        return Map(user);
    }

    public async Task<UserResponse> UpdateAsync(int id, UpdateUserRequest request, CancellationToken ct = default)
    {
        ValidateId(id);
        ValidateUserName(request.UserName);
        ValidateRole(request.Role);

        var user = await _userRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("El usuario no existe.");

        var userName = request.UserName.Trim();

        if (await _userRepository.ExistsUserNameAsync(userName, id, ct))
        {
            throw new ValidationException("Ya existe un usuario con ese nombre.");
        }

        await EnsureAdministratorRemainsAsync(user, request.Role, ct);

        user.Name = userName;
        user.Role = request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            ValidatePassword(request.Password, required: true);
            user.PasswordHash = _passwordHasher.Hash(request.Password);
        }

        await _userRepository.UpdateAsync(user, ct);

        return Map(user);
    }

    public async Task ChangeRoleAsync(int id, ChangeRoleRequest request, CancellationToken ct = default)
    {
        ValidateId(id);
        ValidateRole(request.Role);

        var user = await _userRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("El usuario no existe.");

        await EnsureAdministratorRemainsAsync(user, request.Role, ct);

        user.Role = request.Role;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user, ct);
    }

    public async Task ChangeAccessAsync(int id, ChangeAccessRequest request, CancellationToken ct = default)
    {
        ValidateId(id);

        var user = await _userRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("El usuario no existe.");

        if (!request.HasAccess &&
            user.Role == UserRole.Administrator &&
            await _userRepository.CountActiveAdministratorsAsync(ct) <= 1)
        {
            throw new ValidationException("No se puede deshabilitar al último administrador activo.");
        }

        user.HasAccess = request.HasAccess;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        ValidateId(id);

        var user = await _userRepository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException("El usuario no existe.");

        if (user.Role == UserRole.Administrator &&
            user.HasAccess &&
            await _userRepository.CountActiveAdministratorsAsync(ct) <= 1)
        {
            throw new ValidationException("No se puede eliminar al último administrador activo.");
        }

        await _userRepository.DeleteAsync(user, ct);
    }

    private async Task EnsureAdministratorRemainsAsync(User user, UserRole newRole, CancellationToken ct)
    {
        if (user.Role == UserRole.Administrator &&
            newRole != UserRole.Administrator &&
            await _userRepository.CountActiveAdministratorsAsync(ct) <= 1)
        {
            throw new ValidationException("No se puede cambiar el rol del último administrador activo.");
        }
    }

    private static void ValidateId(int id)
    {
        if (id <= 0)
        {
            throw new ValidationException("El código de usuario no es válido.");
        }
    }

    private static void ValidateUserName(string userName)
    {
        if (string.IsNullOrWhiteSpace(userName))
        {
            throw new ValidationException("El nombre de usuario es obligatorio.");
        }

        if (userName.Trim().Length > MaximumUserNameLength)
        {
            throw new ValidationException($"El nombre de usuario no puede superar los {MaximumUserNameLength} caracteres.");
        }
    }

    private static void ValidatePassword(string? password, bool required)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            if (required)
            {
                throw new ValidationException("La contraseña es obligatoria.");
            }

            return;
        }

        if (password.Length < MinimumPasswordLength)
        {
            throw new ValidationException($"La contraseña debe tener al menos {MinimumPasswordLength} caracteres.");
        }
    }

    private static void ValidateRole(UserRole role)
    {
        if (!Enum.IsDefined(role))
        {
            throw new ValidationException("El rol enviado no es válido.");
        }
    }

    private static UserResponse Map(User user)
    {
        return new UserResponse
        {
            Id = user.UserId,
            UserName = user.Name,
            Role = user.Role.ToString(),
            HasAccess = user.HasAccess,
            CreatedAt = user.CreatedAt
        };
    }
}

