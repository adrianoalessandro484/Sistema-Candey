using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class KardexMovementConfiguration : IEntityTypeConfiguration<KardexMovement>
{
    public void Configure(EntityTypeBuilder<KardexMovement> builder)
    {
        builder.ToTable("movimientos_kardex");
        builder.HasKey(m => m.MovementId);
        builder.Property(m => m.MovementId).HasColumnName("cod_movimiento").ValueGeneratedOnAdd();
        builder.Property(m => m.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(m => m.LotId).HasColumnName("cod_lote");
        builder.Property(m => m.Type).HasColumnName("tip_movimiento").HasMaxLength(20).IsRequired();
        builder.Property(m => m.Quantity).HasColumnName("can_movimiento").IsRequired();
        builder.Property(m => m.MovementDate).HasColumnName("fec_movimiento").IsRequired();
        builder.Property(m => m.Reference).HasColumnName("ref_movimiento").HasMaxLength(20).IsRequired();
        builder.Property(m => m.UserId).HasColumnName("cod_usuario").IsRequired();

        builder.HasIndex(m => m.ProductId);
        builder.HasIndex(m => m.MovementDate);
    }
}
