using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class BranchRequestConfiguration : IEntityTypeConfiguration<BranchRequest>
{
    public void Configure(EntityTypeBuilder<BranchRequest> builder)
    {
        builder.ToTable("requerimientos_sucursal");
        builder.HasKey(r => r.BranchRequestId);
        builder.Property(r => r.BranchRequestId).HasColumnName("cod_requerimiento").ValueGeneratedOnAdd();
        builder.Property(r => r.RequestCode).HasColumnName("num_requerimiento").HasMaxLength(20).IsRequired();
        builder.Property(r => r.RequestDate).HasColumnName("fec_requerimiento").IsRequired();
        builder.Property(r => r.BranchId).HasColumnName("cod_sucursal").IsRequired();
        builder.Property(r => r.RequestedByUserId).HasColumnName("cod_usuario_solicita").IsRequired();
        builder.Property(r => r.Note).HasColumnName("obs_requerimiento").HasMaxLength(250);
        builder.Property(r => r.Status).HasColumnName("est_estado").HasMaxLength(25).IsRequired();

        builder.Property(r => r.ReviewedByUserId).HasColumnName("cod_usuario_revisa");
        builder.Property(r => r.ReviewedAt).HasColumnName("fec_revision");
        builder.Property(r => r.RejectionReason).HasColumnName("mot_rechazo").HasMaxLength(250);

        builder.Property(r => r.ExitId).HasColumnName("cod_salida");
        builder.Property(r => r.DispatchedAt).HasColumnName("fec_despacho");

        builder.Property(r => r.ReceivedByUserId).HasColumnName("cod_usuario_recibe");
        builder.Property(r => r.ReceivedAt).HasColumnName("fec_recepcion");
        builder.Property(r => r.ReceptionNote).HasColumnName("obs_recepcion").HasMaxLength(250);

        builder.Property(r => r.CreatedAt).HasColumnName("fec_creacion").IsRequired();
        builder.Property(r => r.UpdatedAt).HasColumnName("fec_modificacion");
        builder.Property(r => r.IsRegistered).HasColumnName("est_registro").HasDefaultValue(true).IsRequired();

        builder.HasOne(r => r.Branch).WithMany().HasForeignKey(r => r.BranchId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(r => r.RequestedByUser).WithMany().HasForeignKey(r => r.RequestedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(r => r.ReviewedByUser).WithMany().HasForeignKey(r => r.ReviewedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(r => r.ReceivedByUser).WithMany().HasForeignKey(r => r.ReceivedByUserId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(r => r.Exit).WithMany().HasForeignKey(r => r.ExitId).OnDelete(DeleteBehavior.Restrict);
        builder.HasMany(r => r.Details).WithOne(d => d.BranchRequest!).HasForeignKey(d => d.BranchRequestId).OnDelete(DeleteBehavior.Cascade);
    }
}
