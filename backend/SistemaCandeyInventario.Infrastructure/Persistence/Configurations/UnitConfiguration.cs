using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class UnitConfiguration : IEntityTypeConfiguration<Unit>
{
    public void Configure(EntityTypeBuilder<Unit> builder)
    {
        builder.ToTable("unidades");
        builder.HasKey(u => u.UnitId);
        builder.Property(u => u.UnitId).HasColumnName("cod_unidad").ValueGeneratedOnAdd();
        builder.Property(u => u.Name).HasColumnName("nom_unidad").HasMaxLength(40).IsRequired();
        builder.Property(u => u.Abbreviation).HasColumnName("abr_unidad").HasMaxLength(6).IsRequired();
        builder.Property(u => u.Factor).HasColumnName("fac_unidad").HasDefaultValue(1).IsRequired();
        builder.Property(u => u.IsActive).HasColumnName("est_activo").HasDefaultValue(true).IsRequired();
        builder.Property(u => u.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(u => u.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(u => u.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();
    }
}
