using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaCandeyInventario.Domain.Entities;

namespace SistemaCandeyInventario.Infrastructure.Persistence.Configurations;

public class BranchRequestDetailConfiguration : IEntityTypeConfiguration<BranchRequestDetail>
{
    public void Configure(EntityTypeBuilder<BranchRequestDetail> builder)
    {
        builder.ToTable("detalles_requerimiento");
        builder.HasKey(d => d.BranchRequestDetailId);
        builder.Property(d => d.BranchRequestDetailId).HasColumnName("cod_detrequerimiento").ValueGeneratedOnAdd();
        builder.Property(d => d.BranchRequestId).HasColumnName("cod_requerimiento").IsRequired();
        builder.Property(d => d.ProductId).HasColumnName("cod_producto").IsRequired();
        builder.Property(d => d.RequestedQuantity).HasColumnName("can_solicitada").IsRequired();

        builder.HasOne(d => d.Product).WithMany().HasForeignKey(d => d.ProductId).OnDelete(DeleteBehavior.Restrict);
    }
}
