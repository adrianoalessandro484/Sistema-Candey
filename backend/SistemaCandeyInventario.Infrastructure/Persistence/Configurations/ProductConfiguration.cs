using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("productos");
        builder.HasKey(p => p.ProductId);
        builder.Property(p => p.ProductId).HasColumnName("cod_producto").ValueGeneratedOnAdd();
        builder.Property(p => p.Name).HasColumnName("nom_producto").HasMaxLength(80).IsRequired();
        builder.Property(p => p.Description).HasColumnName("des_producto").HasMaxLength(200);
        builder.Property(p => p.CategoryId).HasColumnName("cod_categoria").IsRequired();
        builder.Property(p => p.UnitId).HasColumnName("cod_unidad").IsRequired();
        builder.Property(p => p.MinStock).HasColumnName("stk_min_producto").HasDefaultValue(0).IsRequired();
        builder.Property(p => p.Stock).HasColumnName("stk_producto").HasDefaultValue(0).IsRequired();
        builder.Property(p => p.Price).HasColumnName("pre_producto").HasPrecision(12, 2).HasDefaultValue(0m).IsRequired();
        builder.Property(p => p.IsActive).HasColumnName("est_activo").HasDefaultValue(true).IsRequired();
        builder.Property(p => p.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(p => p.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(p => p.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(p => p.Category).WithMany().HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(p => p.Unit).WithMany().HasForeignKey(p => p.UnitId).OnDelete(DeleteBehavior.Restrict);
    }
}
