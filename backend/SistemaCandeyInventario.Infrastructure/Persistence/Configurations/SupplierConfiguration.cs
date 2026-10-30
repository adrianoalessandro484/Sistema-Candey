using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
{
    public void Configure(EntityTypeBuilder<Supplier> builder)
    {
        builder.ToTable("proveedores");
        builder.HasKey(p => p.SupplierId);
        builder.Property(p => p.SupplierId).HasColumnName("cod_proveedor").ValueGeneratedOnAdd();
        builder.Property(p => p.Name).HasColumnName("nom_proveedor").HasMaxLength(100).IsRequired();
        builder.Property(p => p.TaxId).HasColumnName("ruc_proveedor").HasMaxLength(11).IsRequired();
        builder.HasIndex(p => p.TaxId).IsUnique();
        builder.Property(p => p.Phone).HasColumnName("tel_proveedor").HasMaxLength(20);
        builder.Property(p => p.Email).HasColumnName("cor_proveedor").HasMaxLength(120);
        builder.Property(p => p.Address).HasColumnName("dir_proveedor").HasMaxLength(200);
        builder.Property(p => p.IsActive).HasColumnName("est_activo").HasDefaultValue(true).IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(p => p.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(p => p.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();
    }
}
