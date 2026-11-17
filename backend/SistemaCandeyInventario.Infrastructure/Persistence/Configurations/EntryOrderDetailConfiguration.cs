using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class EntryOrderDetailConfiguration : IEntityTypeConfiguration<EntryOrderDetail>
{
    public void Configure(EntityTypeBuilder<EntryOrderDetail> builder)
    {
        builder.ToTable("detalles_orden_ingreso");
        builder.HasKey(d => d.EntryOrderDetailId);
        builder.Property(d => d.EntryOrderDetailId).HasColumnName("cod_detorden").ValueGeneratedOnAdd();
        builder.Property(d => d.EntryOrderId).HasColumnName("cod_orden").IsRequired();
        builder.Property(d => d.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(d => d.RequestedQuantity).HasColumnName("can_solicitada").IsRequired();

        builder.HasOne(d => d.Product).WithMany().HasForeignKey(d => d.ProductId).OnDelete(DeleteBehavior.Restrict);
    }
}
