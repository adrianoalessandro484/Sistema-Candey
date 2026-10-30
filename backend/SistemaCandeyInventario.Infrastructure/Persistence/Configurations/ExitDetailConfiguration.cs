using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class ExitDetailConfiguration : IEntityTypeConfiguration<ExitDetail>
{
    public void Configure(EntityTypeBuilder<ExitDetail> builder)
    {
        builder.ToTable("detalles_salida");
        builder.HasKey(d => d.ExitDetailId);
        builder.Property(d => d.ExitDetailId).HasColumnName("cod_detsalida").ValueGeneratedOnAdd();
        builder.Property(d => d.ExitId).HasColumnName("cod_salida").IsRequired();
        builder.Property(d => d.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(d => d.LotId).HasColumnName("cod_lote").IsRequired();
        builder.Property(d => d.LotCode).HasColumnName("num_lote").HasMaxLength(60).IsRequired();
        builder.Property(d => d.Quantity).HasColumnName("can_detsalida").IsRequired();

        builder.HasOne(d => d.Product).WithMany().HasForeignKey(d => d.ProductId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(d => d.Lot).WithMany().HasForeignKey(d => d.LotId).OnDelete(DeleteBehavior.Restrict);
    }
}
