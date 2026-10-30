using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class EntryConfiguration : IEntityTypeConfiguration<Entry>
{
    public void Configure(EntityTypeBuilder<Entry> builder)
    {
        builder.ToTable("entradas");
        builder.HasKey(e => e.EntryId);
        builder.Property(e => e.EntryId).HasColumnName("cod_entrada").ValueGeneratedOnAdd();
        builder.Property(e => e.EntryCode).HasColumnName("num_entrada").HasMaxLength(20).IsRequired();
        builder.Property(e => e.EntryDate).HasColumnName("fec_entrada").IsRequired();
        builder.Property(e => e.SupplierId).HasColumnName("cod_proveedor").IsRequired();
        builder.Property(e => e.Note).HasColumnName("obs_entrada").HasMaxLength(200);
        builder.Property(e => e.UserId).HasColumnName("cod_usuario").IsRequired();
        builder.Property(e => e.Status).HasColumnName("est_estado").HasMaxLength(20).IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(e => e.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(e => e.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(e => e.Supplier).WithMany().HasForeignKey(e => e.SupplierId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(e => e.Details).WithOne(d => d.Entry!).HasForeignKey(d => d.EntryId).OnDelete(DeleteBehavior.Cascade);
    }
}
