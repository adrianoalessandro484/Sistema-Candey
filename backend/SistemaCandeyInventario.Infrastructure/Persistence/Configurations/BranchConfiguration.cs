using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable("sucursales");
        builder.HasKey(s => s.BranchId);
        builder.Property(s => s.BranchId).HasColumnName("cod_sucursal").ValueGeneratedOnAdd();
        builder.Property(s => s.Name).HasColumnName("nom_sucursal").HasMaxLength(100).IsRequired();
        builder.Property(s => s.Address).HasColumnName("dir_sucursal").HasMaxLength(200);
        builder.Property(s => s.Phone).HasColumnName("tel_sucursal").HasMaxLength(20);
        builder.Property(s => s.IsActive).HasColumnName("est_activo").HasDefaultValue(true).IsRequired();
        builder.Property(s => s.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(s => s.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(s => s.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();
    }
}
