using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class EntryOrderConfiguration : IEntityTypeConfiguration<EntryOrder>
{
    public void Configure(EntityTypeBuilder<EntryOrder> builder)
    {
        builder.ToTable("ordenes_ingreso");
        builder.HasKey(o => o.EntryOrderId);
        builder.Property(o => o.EntryOrderId).HasColumnName("cod_orden").ValueGeneratedOnAdd();
        builder.Property(o => o.OrderCode).HasColumnName("num_orden").HasMaxLength(20).IsRequired();
        builder.Property(o => o.OrderDate).HasColumnName("fec_orden").IsRequired();
        builder.Property(o => o.ExpectedDate).HasColumnName("fec_esperada");
        builder.Property(o => o.SupplierId).HasColumnName("cod_proveedor").IsRequired();
        builder.Property(o => o.CreatedByUserId).HasColumnName("cod_usuario_crea").IsRequired();
        builder.Property(o => o.Note).HasColumnName("obs_orden").HasMaxLength(250);
        builder.Property(o => o.Status).HasColumnName("est_estado").HasMaxLength(25).IsRequired();

        builder.Property(o => o.EntryId).HasColumnName("cod_entrada");
        builder.Property(o => o.ReceivedByUserId).HasColumnName("cod_usuario_recibe");
        builder.Property(o => o.ReceivedAt).HasColumnName("fec_recepcion");

        builder.Property(o => o.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(o => o.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(o => o.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(o => o.Supplier).WithMany().HasForeignKey(o => o.SupplierId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(o => o.CreatedByUser).WithMany().HasForeignKey(o => o.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(o => o.ReceivedByUser).WithMany().HasForeignKey(o => o.ReceivedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(o => o.Entry).WithMany().HasForeignKey(o => o.EntryId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(o => o.Details).WithOne(d => d.EntryOrder!).HasForeignKey(d => d.EntryOrderId).OnDelete(DeleteBehavior.Cascade);
    }
}
