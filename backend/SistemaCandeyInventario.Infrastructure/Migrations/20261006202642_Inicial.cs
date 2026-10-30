using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaCandeyInventario.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    cod_usuario = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_usuario = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    cla_usuario = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    rol_usuario = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    est_acceso = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.cod_usuario);
                });

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_nom_usuario",
                table: "usuarios",
                column: "nom_usuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
