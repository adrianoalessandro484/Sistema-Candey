using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("usuarios");

        builder.HasKey(u => u.UserId);
        builder.Property(u => u.UserId)
            .HasColumnName("cod_usuario")
            .ValueGeneratedOnAdd();

        builder.Property(u => u.Name)
            .HasColumnName("nom_usuario")
            .HasMaxLength(50)
            .IsRequired();

        builder.HasIndex(u => u.Name)
            .IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("cla_usuario")
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(u => u.Role)
            .HasColumnName("rol_usuario")
            .HasConversion<string>()
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(u => u.HasAccess)
            .HasColumnName("est_acceso")
            .HasDefaultValue(true)
            .IsRequired();

        builder.Property(u => u.CreatedAt)
            .HasColumnName("fec_creacion")
            .IsRequired();

        builder.Property(u => u.UpdatedAt)
            .HasColumnName("fec_modificacion");

        builder.Property(u => u.IsRegistered)
            .HasColumnName("est_registro")
            .HasDefaultValue(true)
            .IsRequired();
    }
}
