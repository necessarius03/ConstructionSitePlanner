using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Data.Configurations;

public class ProgressConfiguration : IEntityTypeConfiguration<Progress>
{
    public void Configure(EntityTypeBuilder<Progress> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.SiteLayoutId)
            .IsRequired();

        builder.Property(x => x.ZoneShapeId)
            .HasMaxLength(50);

        builder.Property(x => x.StartDate)
            .IsRequired();

        builder.Property(x => x.EndDate)
            .IsRequired();

        builder.Property(x => x.CompletionPercentage)
            .IsRequired();

        builder.Property(x => x.Status)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.Color)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(x => x.ResponsiblePerson)
            .HasMaxLength(100);

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();

        // Định nghĩa relationship với SiteLayout
        builder.HasOne<SiteLayout>()
            .WithMany()
            .HasForeignKey(x => x.SiteLayoutId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}