using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ConstructionSitePlanner.Entities;

namespace ConstructionSitePlanner.Data.Configurations;

public class SiteLayoutConfiguration : IEntityTypeConfiguration<SiteLayout>
{
    public void Configure(EntityTypeBuilder<SiteLayout> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.Property(x => x.ShapesJson)
            .IsRequired();

        builder.Property(x => x.CreatedAt)
            .IsRequired();

        builder.Property(x => x.UpdatedAt)
            .IsRequired();
    }
}