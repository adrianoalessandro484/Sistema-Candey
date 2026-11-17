using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaCandeyInventario.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class WorkflowOrdersAndBranchRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "cod_sucursal",
                table: "usuarios",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ordenes_ingreso",
                columns: table => new
                {
                    cod_orden = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    num_orden = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_orden = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_esperada = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cod_proveedor = table.Column<int>(type: "integer", nullable: false),
                    cod_usuario_crea = table.Column<int>(type: "integer", nullable: false),
                    obs_orden = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    est_estado = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: false),
                    cod_entrada = table.Column<int>(type: "integer", nullable: true),
                    cod_usuario_recibe = table.Column<int>(type: "integer", nullable: true),
                    fec_recepcion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ordenes_ingreso", x => x.cod_orden);
                    table.ForeignKey(
                        name: "FK_ordenes_ingreso_entradas_cod_entrada",
                        column: x => x.cod_entrada,
                        principalTable: "entradas",
                        principalColumn: "cod_entrada",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ordenes_ingreso_proveedores_cod_proveedor",
                        column: x => x.cod_proveedor,
                        principalTable: "proveedores",
                        principalColumn: "cod_proveedor",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ordenes_ingreso_usuarios_cod_usuario_crea",
                        column: x => x.cod_usuario_crea,
                        principalTable: "usuarios",
                        principalColumn: "cod_usuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ordenes_ingreso_usuarios_cod_usuario_recibe",
                        column: x => x.cod_usuario_recibe,
                        principalTable: "usuarios",
                        principalColumn: "cod_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "requerimientos_sucursal",
                columns: table => new
                {
                    cod_requerimiento = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    num_requerimiento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_requerimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    cod_sucursal = table.Column<int>(type: "integer", nullable: false),
                    cod_usuario_solicita = table.Column<int>(type: "integer", nullable: false),
                    obs_requerimiento = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    est_estado = table.Column<string>(type: "character varying(25)", maxLength: 25, nullable: false),
                    cod_usuario_revisa = table.Column<int>(type: "integer", nullable: true),
                    fec_revision = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    mot_rechazo = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    cod_salida = table.Column<int>(type: "integer", nullable: true),
                    fec_despacho = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    cod_usuario_recibe = table.Column<int>(type: "integer", nullable: true),
                    fec_recepcion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    obs_recepcion = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_requerimientos_sucursal", x => x.cod_requerimiento);
                    table.ForeignKey(
                        name: "FK_requerimientos_sucursal_salidas_cod_salida",
                        column: x => x.cod_salida,
                        principalTable: "salidas",
                        principalColumn: "cod_salida",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_requerimientos_sucursal_sucursales_cod_sucursal",
                        column: x => x.cod_sucursal,
                        principalTable: "sucursales",
                        principalColumn: "cod_sucursal",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_requerimientos_sucursal_usuarios_cod_usuario_recibe",
                        column: x => x.cod_usuario_recibe,
                        principalTable: "usuarios",
                        principalColumn: "cod_usuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_requerimientos_sucursal_usuarios_cod_usuario_revisa",
                        column: x => x.cod_usuario_revisa,
                        principalTable: "usuarios",
                        principalColumn: "cod_usuario",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_requerimientos_sucursal_usuarios_cod_usuario_solicita",
                        column: x => x.cod_usuario_solicita,
                        principalTable: "usuarios",
                        principalColumn: "cod_usuario",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "detalles_orden_ingreso",
                columns: table => new
                {
                    cod_detorden = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_orden = table.Column<int>(type: "integer", nullable: false),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    can_solicitada = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalles_orden_ingreso", x => x.cod_detorden);
                    table.ForeignKey(
                        name: "FK_detalles_orden_ingreso_ordenes_ingreso_cod_orden",
                        column: x => x.cod_orden,
                        principalTable: "ordenes_ingreso",
                        principalColumn: "cod_orden",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_detalles_orden_ingreso_productos_cod_producto",
                        column: x => x.cod_producto,
                        principalTable: "productos",
                        principalColumn: "cod_producto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "detalles_requerimiento",
                columns: table => new
                {
                    cod_detrequerimiento = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_requerimiento = table.Column<int>(type: "integer", nullable: false),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    can_solicitada = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalles_requerimiento", x => x.cod_detrequerimiento);
                    table.ForeignKey(
                        name: "FK_detalles_requerimiento_productos_cod_producto",
                        column: x => x.cod_producto,
                        principalTable: "productos",
                        principalColumn: "cod_producto",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_detalles_requerimiento_requerimientos_sucursal_cod_requerim~",
                        column: x => x.cod_requerimiento,
                        principalTable: "requerimientos_sucursal",
                        principalColumn: "cod_requerimiento",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_usuarios_cod_sucursal",
                table: "usuarios",
                column: "cod_sucursal");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_orden_ingreso_cod_orden",
                table: "detalles_orden_ingreso",
                column: "cod_orden");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_orden_ingreso_cod_producto",
                table: "detalles_orden_ingreso",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_requerimiento_cod_producto",
                table: "detalles_requerimiento",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_requerimiento_cod_requerimiento",
                table: "detalles_requerimiento",
                column: "cod_requerimiento");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_ingreso_cod_entrada",
                table: "ordenes_ingreso",
                column: "cod_entrada");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_ingreso_cod_proveedor",
                table: "ordenes_ingreso",
                column: "cod_proveedor");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_ingreso_cod_usuario_crea",
                table: "ordenes_ingreso",
                column: "cod_usuario_crea");

            migrationBuilder.CreateIndex(
                name: "IX_ordenes_ingreso_cod_usuario_recibe",
                table: "ordenes_ingreso",
                column: "cod_usuario_recibe");

            migrationBuilder.CreateIndex(
                name: "IX_requerimientos_sucursal_cod_salida",
                table: "requerimientos_sucursal",
                column: "cod_salida");

            migrationBuilder.CreateIndex(
                name: "IX_requerimientos_sucursal_cod_sucursal",
                table: "requerimientos_sucursal",
                column: "cod_sucursal");

            migrationBuilder.CreateIndex(
                name: "IX_requerimientos_sucursal_cod_usuario_recibe",
                table: "requerimientos_sucursal",
                column: "cod_usuario_recibe");

            migrationBuilder.CreateIndex(
                name: "IX_requerimientos_sucursal_cod_usuario_revisa",
                table: "requerimientos_sucursal",
                column: "cod_usuario_revisa");

            migrationBuilder.CreateIndex(
                name: "IX_requerimientos_sucursal_cod_usuario_solicita",
                table: "requerimientos_sucursal",
                column: "cod_usuario_solicita");

            migrationBuilder.AddForeignKey(
                name: "FK_usuarios_sucursales_cod_sucursal",
                table: "usuarios",
                column: "cod_sucursal",
                principalTable: "sucursales",
                principalColumn: "cod_sucursal",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_usuarios_sucursales_cod_sucursal",
                table: "usuarios");

            migrationBuilder.DropTable(
                name: "detalles_orden_ingreso");

            migrationBuilder.DropTable(
                name: "detalles_requerimiento");

            migrationBuilder.DropTable(
                name: "ordenes_ingreso");

            migrationBuilder.DropTable(
                name: "requerimientos_sucursal");

            migrationBuilder.DropIndex(
                name: "IX_usuarios_cod_sucursal",
                table: "usuarios");

            migrationBuilder.DropColumn(
                name: "cod_sucursal",
                table: "usuarios");
        }
    }
}
