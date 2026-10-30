using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class LotConfiguration : IEntityTypeConfiguration<Lot>
{
    public void Configure(EntityTypeBuilder<Lot> builder)
    {
        builder.ToTable("lotes");
        builder.HasKey(l => l.LotId);
        builder.Property(l => l.LotId).HasColumnName("cod_lote").ValueGeneratedOnAdd();
        builder.Property(l => l.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(l => l.LotCode).HasColumnName("num_lote").HasMaxLength(60).IsRequired();
        builder.Property(l => l.ExpirationDate).HasColumnName("fec_vencimiento");
        builder.Property(l => l.InitialQuantity).HasColumnName("can_inicial").IsRequired();
        builder.Property(l => l.AvailableQuantity).HasColumnName("can_disponible").IsRequired();
        builder.Property(l => l.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(l => l.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(l => l.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(l => l.Product).WithMany().HasForeignKey(l => l.ProductId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(l => l.ExpirationDate);
    }
}
