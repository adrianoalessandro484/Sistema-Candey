using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaCandeyInventario.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Inventario : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias",
                columns: table => new
                {
                    cod_categoria = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_categoria = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    des_categoria = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    est_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_categorias", x => x.cod_categoria);
                });

            migrationBuilder.CreateTable(
                name: "movimientos_kardex",
                columns: table => new
                {
                    cod_movimiento = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    cod_lote = table.Column<int>(type: "integer", nullable: true),
                    tip_movimiento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    can_movimiento = table.Column<int>(type: "integer", nullable: false),
                    fec_movimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ref_movimiento = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    cod_usuario = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_movimientos_kardex", x => x.cod_movimiento);
                });

            migrationBuilder.CreateTable(
                name: "proveedores",
                columns: table => new
                {
                    cod_proveedor = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_proveedor = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ruc_proveedor = table.Column<string>(type: "character varying(11)", maxLength: 11, nullable: false),
                    tel_proveedor = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    cor_proveedor = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    dir_proveedor = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    est_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_proveedores", x => x.cod_proveedor);
                });

            migrationBuilder.CreateTable(
                name: "sucursales",
                columns: table => new
                {
                    cod_sucursal = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_sucursal = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    dir_sucursal = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    tel_sucursal = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    est_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sucursales", x => x.cod_sucursal);
                });

            migrationBuilder.CreateTable(
                name: "unidades",
                columns: table => new
                {
                    cod_unidad = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_unidad = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    abr_unidad = table.Column<string>(type: "character varying(6)", maxLength: 6, nullable: false),
                    fac_unidad = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    est_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_unidades", x => x.cod_unidad);
                });

            migrationBuilder.CreateTable(
                name: "entradas",
                columns: table => new
                {
                    cod_entrada = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    num_entrada = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_entrada = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    cod_proveedor = table.Column<int>(type: "integer", nullable: false),
                    obs_entrada = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    cod_usuario = table.Column<int>(type: "integer", nullable: false),
                    est_estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entradas", x => x.cod_entrada);
                    table.ForeignKey(
                        name: "FK_entradas_proveedores_cod_proveedor",
                        column: x => x.cod_proveedor,
                        principalTable: "proveedores",
                        principalColumn: "cod_proveedor",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "salidas",
                columns: table => new
                {
                    cod_salida = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    num_salida = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_salida = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    mot_salida = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    cod_sucursal = table.Column<int>(type: "integer", nullable: false),
                    obs_salida = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    cod_usuario = table.Column<int>(type: "integer", nullable: false),
                    est_estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_salidas", x => x.cod_salida);
                    table.ForeignKey(
                        name: "FK_salidas_sucursales_cod_sucursal",
                        column: x => x.cod_sucursal,
                        principalTable: "sucursales",
                        principalColumn: "cod_sucursal",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    cod_producto = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom_producto = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: false),
                    des_producto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    cod_categoria = table.Column<int>(type: "integer", nullable: false),
                    cod_unidad = table.Column<int>(type: "integer", nullable: false),
                    stk_min_producto = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    stk_producto = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    pre_producto = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false, defaultValue: 0m),
                    est_activo = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productos", x => x.cod_producto);
                    table.ForeignKey(
                        name: "FK_productos_categorias_cod_categoria",
                        column: x => x.cod_categoria,
                        principalTable: "categorias",
                        principalColumn: "cod_categoria",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_productos_unidades_cod_unidad",
                        column: x => x.cod_unidad,
                        principalTable: "unidades",
                        principalColumn: "cod_unidad",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "lotes",
                columns: table => new
                {
                    cod_lote = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    num_lote = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    fec_vencimiento = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    can_inicial = table.Column<int>(type: "integer", nullable: false),
                    can_disponible = table.Column<int>(type: "integer", nullable: false),
                    fec_creacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    fec_modificacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    est_registro = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_lotes", x => x.cod_lote);
                    table.ForeignKey(
                        name: "FK_lotes_productos_cod_producto",
                        column: x => x.cod_producto,
                        principalTable: "productos",
                        principalColumn: "cod_producto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "detalles_entrada",
                columns: table => new
                {
                    cod_detentrada = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_entrada = table.Column<int>(type: "integer", nullable: false),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    cod_lote = table.Column<int>(type: "integer", nullable: false),
                    num_lote = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    can_detentrada = table.Column<int>(type: "integer", nullable: false),
                    cos_detentrada = table.Column<decimal>(type: "numeric(12,2)", precision: 12, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalles_entrada", x => x.cod_detentrada);
                    table.ForeignKey(
                        name: "FK_detalles_entrada_entradas_cod_entrada",
                        column: x => x.cod_entrada,
                        principalTable: "entradas",
                        principalColumn: "cod_entrada",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_detalles_entrada_lotes_cod_lote",
                        column: x => x.cod_lote,
                        principalTable: "lotes",
                        principalColumn: "cod_lote",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_detalles_entrada_productos_cod_producto",
                        column: x => x.cod_producto,
                        principalTable: "productos",
                        principalColumn: "cod_producto",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "detalles_salida",
                columns: table => new
                {
                    cod_detsalida = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cod_salida = table.Column<int>(type: "integer", nullable: false),
                    cod_producto = table.Column<int>(type: "integer", nullable: false),
                    cod_lote = table.Column<int>(type: "integer", nullable: false),
                    num_lote = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    can_detsalida = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_detalles_salida", x => x.cod_detsalida);
                    table.ForeignKey(
                        name: "FK_detalles_salida_lotes_cod_lote",
                        column: x => x.cod_lote,
                        principalTable: "lotes",
                        principalColumn: "cod_lote",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_detalles_salida_productos_cod_producto",
                        column: x => x.cod_producto,
                        principalTable: "productos",
                        principalColumn: "cod_producto",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_detalles_salida_salidas_cod_salida",
                        column: x => x.cod_salida,
                        principalTable: "salidas",
                        principalColumn: "cod_salida",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_detalles_entrada_cod_entrada",
                table: "detalles_entrada",
                column: "cod_entrada");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_entrada_cod_lote",
                table: "detalles_entrada",
                column: "cod_lote");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_entrada_cod_producto",
                table: "detalles_entrada",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_salida_cod_lote",
                table: "detalles_salida",
                column: "cod_lote");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_salida_cod_producto",
                table: "detalles_salida",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_detalles_salida_cod_salida",
                table: "detalles_salida",
                column: "cod_salida");

            migrationBuilder.CreateIndex(
                name: "IX_entradas_cod_proveedor",
                table: "entradas",
                column: "cod_proveedor");

            migrationBuilder.CreateIndex(
                name: "IX_lotes_cod_producto",
                table: "lotes",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_lotes_fec_vencimiento",
                table: "lotes",
                column: "fec_vencimiento");

            migrationBuilder.CreateIndex(
                name: "IX_movimientos_kardex_cod_producto",
                table: "movimientos_kardex",
                column: "cod_producto");

            migrationBuilder.CreateIndex(
                name: "IX_movimientos_kardex_fec_movimiento",
                table: "movimientos_kardex",
                column: "fec_movimiento");

            migrationBuilder.CreateIndex(
                name: "IX_productos_cod_categoria",
                table: "productos",
                column: "cod_categoria");

            migrationBuilder.CreateIndex(
                name: "IX_productos_cod_unidad",
                table: "productos",
                column: "cod_unidad");

            migrationBuilder.CreateIndex(
                name: "IX_proveedores_ruc_proveedor",
                table: "proveedores",
                column: "ruc_proveedor",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_salidas_cod_sucursal",
                table: "salidas",
                column: "cod_sucursal");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "detalles_entrada");

            migrationBuilder.DropTable(
                name: "detalles_salida");

            migrationBuilder.DropTable(
                name: "movimientos_kardex");

            migrationBuilder.DropTable(
                name: "entradas");

            migrationBuilder.DropTable(
                name: "lotes");

            migrationBuilder.DropTable(
                name: "salidas");

            migrationBuilder.DropTable(
                name: "proveedores");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "sucursales");

            migrationBuilder.DropTable(
                name: "categorias");

            migrationBuilder.DropTable(
                name: "unidades");
        }
    }
}
