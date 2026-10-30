using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categorias");
        builder.HasKey(c => c.CategoryId);
        builder.Property(c => c.CategoryId).HasColumnName("cod_categoria").ValueGeneratedOnAdd();
        builder.Property(c => c.Name).HasColumnName("nom_categoria").HasMaxLength(60).IsRequired();
        builder.Property(c => c.Description).HasColumnName("des_categoria").HasMaxLength(150);
        builder.Property(c => c.IsActive).HasColumnName("est_activo").HasDefaultValue(true).IsRequired();
        builder.Property(c => c.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(c => c.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(c => c.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();
    }
}
