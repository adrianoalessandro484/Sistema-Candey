using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class ExitConfiguration : IEntityTypeConfiguration<Exit>
{
    public void Configure(EntityTypeBuilder<Exit> builder)
    {
        builder.ToTable("salidas");
        builder.HasKey(s => s.ExitId);
        builder.Property(s => s.ExitId).HasColumnName("cod_salida").ValueGeneratedOnAdd();
        builder.Property(s => s.ExitCode).HasColumnName("num_salida").HasMaxLength(20).IsRequired();
        builder.Property(s => s.ExitDate).HasColumnName("fec_salida").IsRequired();
        builder.Property(s => s.Reason).HasColumnName("mot_salida").HasMaxLength(60).IsRequired();
        builder.Property(s => s.BranchId).HasColumnName("cod_sucursal").IsRequired();
        builder.Property(s => s.Note).HasColumnName("obs_salida").HasMaxLength(200);
        builder.Property(s => s.UserId).HasColumnName("cod_usuario").IsRequired();
        builder.Property(s => s.Status).HasColumnName("est_estado").HasMaxLength(20).IsRequired();
        builder.Property(s => s.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(s => s.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(s => s.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(s => s.Branch).WithMany().HasForeignKey(s => s.BranchId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(s => s.Details).WithOne(d => d.Exit!).HasForeignKey(d => d.ExitId).OnDelete(DeleteBehavior.Cascade);
    }
}
