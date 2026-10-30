# REQUERIMIENTOS — Sistema Candey Inventario

Documento maestro de requerimientos. Sirve como fuente de verdad del alcance del sistema;
cualquier cambio funcional debe reflejarse aquí.

---

## 1. Descripción general

Sistema de **control de inventario** para el negocio **Candey**, dedicado a la venta de
**maquillaje y productos relacionados con el cuidado de la mujer** (accesorios como peines,
productos para uñas, etc.). El sistema gestiona el ingreso y salida de mercadería mediante
**lotes** y **Kardex**, el control de existencias, categorías, sucursales y proveedores, y la
emisión de documentos en PDF (etiquetas, despachos y solicitudes).

- **Idioma**: todo en **español** (código, textos, rutas, mensajes). No mezclar con inglés.
- **Color de marca (Candey)**: `#d63662` (combinado con vino `#3a1122` y dorado `#c9a24b`).

## 2. Actores / Roles

| Actor | Alcance |
|---|---|
| **Administrador** | Acceso total: usuarios, catálogos, productos, proveedores, sucursales, reportes y alertas. |
| **Encargado de Entrada** | Registra **ingresos** de productos y lotes (Kardex de entrada). |
| **Encargado de Salida** | Registra **salidas** de productos/lotes y su documentación. |

Acceso al sistema: **usuario + contraseña**.

## 3. Módulos

1. Sesión (autenticación)
2. Gestión de usuarios
3. Categorías
4. Presentaciones / Unidades de empaque
5. Productos
6. Lotes
7. Entradas (ingresos)
8. Salidas (egresos)
9. Proveedores
10. Sucursales
11. Alertas / reposición de stock
12. Reportes
13. Códigos de barra y escaneo

---

## 4. Requerimientos por módulo

### 4.1 Sesión (autenticación)
- Inicio de sesión con **usuario y contraseña**.
- Un único punto de acceso; el rol determina qué puede hacer cada quien (la autorización es por rol,
  **no** por logins separados).
- Sesión con token (JWT) en el backend.

### 4.2 Gestión de usuarios (solo Administrador)
- **Crear** usuarios (usuario + contraseña + rol).
- **Modificar** usuarios (incluida la contraseña).
- **Listar** usuarios.
- **Dar de baja en su totalidad** (eliminar el usuario).
- **Quitar el acceso al sistema** (deshabilitar, sin eliminar).
- **Asignar / cambiar rol**.
- Reglas: no eliminar ni deshabilitar al último administrador activo.

### 4.3 Categorías (módulo CRUD)
- Son un **módulo**: se pueden **agregar, modificar y eliminar**.
- Están relacionadas con **productos y lotes** (por eso no son valores fijos en el código).
- Las categorías agrupan el tipo de producto/presentación (ej. **box de cierta cantidad de unidades**,
  **tiras**, etc.).
- No permitir eliminar una categoría con productos asociados.

### 4.4 Presentaciones / Unidades de empaque
- Maneja una **jerarquía de empaque**: `Caja → Box → Unidad` (y variantes como **tiras**).
- **Factor de conversión**: por ejemplo una **caja contiene 12 box** y un **box contiene 12 unidades**.
- Ejemplo del negocio: a los clientes se les vende el **box de 12**; a nosotros nos llega la **caja**
  que contiene esos box de 12.
- Las entradas y salidas pueden registrarse **por caja, por box o por unidad**, y el sistema convierte
  a la unidad base para el stock.
- Los factores son **configurables**.

### 4.5 Productos
- Catálogo de productos (maquillaje y accesorios de cuidado femenino).
- Datos: nombre, descripción, **categoría**, **presentación/unidad**, **stock mínimo**, precio, estado.
- El **stock no se edita directo**: se deriva de los movimientos (Kardex + lotes).
- Alerta cuando el stock baja del mínimo.

### 4.6 Lotes
- El stock se controla **por lote**; nada es directo.
- Cada lote tiene: **código de lote**, **fecha de vencimiento**, cantidad y producto.
- **FEFO**: deben salir primero los **lotes con vencimiento más próximo**. El sistema debe guiar/forzar
  esta regla en las salidas.
- Disponibilidad por lote calculada desde los movimientos.

### 4.7 Entradas (ingresos)
- Al ingresar, el usuario ve la **lista de productos**; si el producto **no existe, puede crearlo en
  línea**.
- Se registran datos del **lote**: fecha de vencimiento, cantidad, código (y presentación de empaque).
- Se registra el **usuario que realiza el ingreso** y el **proveedor**.
- Genera un **detalle de entrada**.
- Genera un **PDF tipo sticker** para pegar en las cajas, con el **número de lote** y un **código de
  barras** (base para lectores de barra / escaneo con celular).

### 4.8 Salidas (egresos)
- Los productos pueden salir **por la caja del lote o por box** que contiene.
- Se registra un **detalle de salida**: usuario que la realiza, productos, **lote**, cantidad, etc.
- Respetar **FEFO** (salida de lo más pronto a vencer).
- Se indica la **sucursal destino**.
- Genera un **PDF** que se entrega junto con el despacho de los productos.

### 4.9 Proveedores
- CRUD de proveedores (razón social, RUC, contacto, dirección, estado).
- Asociados a las entradas.
- Destino de las **solicitudes de productos** (ver Alertas).

### 4.10 Sucursales (módulo)
- CRUD de sucursales.
- Cada salida se asocia a una **sucursal destino**.

### 4.11 Alertas / reposición de stock
- Cuando el **stock está bajo**, el **administrador recibe una alerta**.
- Desde la alerta, el administrador **solicita productos a los proveedores**.
- La solicitud se envía por **WhatsApp** al proveedor.
- El sistema genera un **PDF: documento de solicitud de productos al proveedor**.

### 4.12 Reportes
- **Control de existencias** (stock actual, valor del inventario).
- **Rotación** de productos (ingresos/egresos por periodo).
- **Alertas preventivas** (productos bajo stock mínimo).

### 4.13 Códigos de barra y escaneo
- Generar códigos de barra por lote (para el sticker de entrada).
- Preparado para **lectura con lectora de barras o escaneo con celular** (futuro).

---

## 5. Reglas de negocio (Kardex)

- El **Kardex** es el registro cronológico de movimientos; el stock **resulta** de los movimientos.
- **No se edita el stock directamente**.
- Todo ingreso/salida es un **documento** con encabezado y detalle.
- **Lotes**: el stock real se lleva por lote; el vencimiento habilita **FEFO**.
- Conversión de empaque (caja/box/unidad) a **unidad base** para consolidar el stock.
- Integridad: no eliminar categorías/proveedores con movimientos asociados; no dejar al sistema sin
  administrador activo.

---

## 6. Estado de avance

Leyenda: ✅ implementado (base) · ⚠️ parcial · ❌ pendiente

| Módulo | Estado | Notas |
|---|---|---|
| Sesión | ✅ | Backend con JWT + PBKDF2; front conectado a la API |
| Gestión de usuarios | ✅ | Crear/editar/listar/eliminar/quit acceso/rol (API real) |
| Categorías | ✅ | CRUD en BD; productos usan el catálogo |
| Presentaciones (Caja/Box/Tira) | ✅ | Catálogo de unidades con factor en BD |
| Productos | ✅ | CRUD con categoría y unidad (FK) |
| Lotes | ✅ | Entidad `Lote` con stock por lote; se crean en la entrada |
| FEFO en salidas | ✅ | Forzado en el backend (debe salir el lote que vence antes) |
| Entradas | ✅ | Documento + detalle; **crear producto en línea**; **PDF de etiquetas con código de barras** |
| Salidas | ✅ | Documento + detalle por lote; **sucursal destino**; **PDF de despacho** |
| Proveedores | ✅ | CRUD en BD |
| Sucursales | ✅ | CRUD en BD; destino de salidas |
| Alertas / reposición | ✅ | Reporte de alertas + **PDF de solicitud** + **WhatsApp** |
| Reportes | ✅ | Existencias, rotación y alertas (desde la API) |
| Código de barras / escaneo | ⚠️ | Se genera Code128 en el sticker; falta el escaneo con cámara |

> El **frontend consume la API real** (C# + PostgreSQL) para todos los módulos; ya no usa datos simulados.

## 7. Decisiones tomadas

1. **Stock**: cada producto **inicia en 0**; el stock se gestiona **solo por Kardex** (movimientos de
   entrada/salida por lote). Nunca se edita directo.
2. **PDFs**: se generan en el **lado del cliente (frontend)**.
3. **Lectura de código de barras**: se hace en el **lado del cliente**, con la **cámara** del
   dispositivo (escaneo con celular).
4. **Unidades / presentaciones**: son un **catálogo guardado en BD** y **extensible** (se pueden
   agregar más: Unidad, Tira, Box, Caja, Pack, etc.). Factores **configurables**.
5. **Baja de usuario**: **lógica** (`Est_Registro = false`), sin borrado físico.
6. **Código de barras del sticker**: **Code128** (lineal). *(se puede evaluar QR para la cámara más
   adelante)*

## 8. Roadmap propuesto

1. **Categorías** (CRUD) — base para productos.
2. **Presentaciones/Unidades** (Caja/Box/Tira con factor).
3. **Lotes como entidad + FEFO forzado**.
4. **Crear producto en línea** dentro de Entradas.
5. **Sucursales** + salida por sucursal.
6. **PDFs**: sticker con código de barras (entrada), despacho (salida), solicitud a proveedor.
7. **Alertas activas + WhatsApp**.
8. Llevar todo al **backend real** (API en C#, Clean Architecture).

---

## 9. Notas técnicas

- **Frontend**: Vite + React 19 (JSX) + Tailwind CSS v4 + react-router-dom + react-hook-form + zod.
  Consume la **API real** mediante `src/services/apiClient.js` (JWT en `candey.sesion`). PDFs y
  código de barras del **lado del cliente** (`jspdf` + `jsbarcode`).
- **Backend**: .NET 10, Clean Architecture (API / Application / Domain / Infrastructure),
  EF Core + PostgreSQL, Swagger, JWT. Convención de entidades `[Abrev]_[Entidad]`
  (ej. `Cod_Cliente`, `Tit_Caja`). URLs de API en **español** (ver `backend/AGENTS.md`).
