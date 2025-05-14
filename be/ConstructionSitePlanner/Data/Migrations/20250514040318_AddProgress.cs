using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConstructionSitePlanner.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Progress",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SiteLayoutId = table.Column<Guid>(type: "uuid", nullable: false),
                    ZoneShapeId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletionPercentage = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ResponsiblePerson = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    DependsOn = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Progress_SiteLayouts_SiteLayoutId",
                        column: x => x.SiteLayoutId,
                        principalTable: "SiteLayouts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Progress_SiteLayoutId",
                table: "Progress",
                column: "SiteLayoutId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Progress");
        }
    }
}
