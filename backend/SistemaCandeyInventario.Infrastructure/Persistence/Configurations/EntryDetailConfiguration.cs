using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class EntryDetailConfiguration : IEntityTypeConfiguration<EntryDetail>
{
    public void Configure(EntityTypeBuilder<EntryDetail> builder)
    {
        builder.ToTable("detalles_entrada");
        builder.HasKey(d => d.EntryDetailId);
        builder.Property(d => d.EntryDetailId).HasColumnName("cod_detentrada").ValueGeneratedOnAdd();
        builder.Property(d => d.EntryId).HasColumnName("cod_entrada").IsRequired();
        builder.Property(d => d.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(d => d.LotId).HasColumnName("cod_lote").IsRequired();
        builder.Property(d => d.LotCode).HasColumnName("num_lote").HasMaxLength(60).IsRequired();
        builder.Property(d => d.Quantity).HasColumnName("can_detentrada").IsRequired();
        builder.Property(d => d.UnitCost).HasColumnName("cos_detentrada").HasPrecision(12, 2).IsRequired();

        builder.HasOne(d => d.Product).WithMany().HasForeignKey(d => d.ProductId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(d => d.Lot).WithMany().HasForeignKey(d => d.LotId).OnDelete(DeleteBehavior.Restrict);
    }
}
