# LookControl database schema

Generated on 2026-05-04 from the local application model and Supabase migrations.

Supabase CLI could not export the real remote dump because the local session does not have a Supabase access token. For the exact remote schema, run:

```powershell
npx supabase login
npx supabase db dump --linked -f supabase\LookControl.sql
```

```mermaid
erDiagram
  PELUQUERIAS ||--o{ PERFILES : has
  PELUQUERIAS ||--o{ PROVEEDORES : has
  PELUQUERIAS ||--o{ PRODUCTOS : has
  PELUQUERIAS ||--o{ COMPRAS : has
  PELUQUERIAS ||--o{ SERVICIOS : has
  CATEGORIAS ||--o{ PRODUCTOS : classifies
  PROVEEDORES ||--o{ PRODUCTOS : supplies
  PROVEEDORES ||--o{ COMPRAS : receives
  PERFILES ||--o{ COMPRAS : creates
  PERFILES ||--o{ MOVIMIENTOS_STOCK : registers
  PRODUCTOS ||--o{ MOVIMIENTOS_STOCK : moves
  COMPRAS ||--o{ DETALLE_COMPRAS : contains
  PRODUCTOS ||--o{ DETALLE_COMPRAS : purchased
  SERVICIOS ||--o{ CONSUMOS_SERVICIO : consumes
  PRODUCTOS ||--o{ CONSUMOS_SERVICIO : used
  PERFILES ||--o{ CONSUMOS_SERVICIO : registers

  PELUQUERIAS {
    bigint id_peluqueria PK
    text nombre
    text codigo_invitacion UK
    boolean activo
    timestamptz fecha_creacion
  }

  PERFILES {
    bigint id_perfil PK
    uuid user_id UK
    bigint id_peluqueria FK
    text nombre_completo
    text email
    text avatar_url
    text rol
    text_array permisos
    timestamptz fecha_registro
  }

  CATEGORIAS {
    bigint id_categoria PK
    text nombre UK
  }

  PROVEEDORES {
    bigint id_proveedor PK
    bigint id_peluqueria FK
    text nombre
    text telefono
    text email
    text direccion
    text notas
    boolean activo
    timestamptz fecha_alta
  }

  PRODUCTOS {
    bigint id_producto PK
    bigint id_categoria FK
    bigint id_proveedor FK
    bigint id_peluqueria FK
    text nombre
    text descripcion
    numeric precio_coste
    numeric precio_venta
    numeric stock_actual
    numeric stock_minimo
    text unidad
    boolean activo
    timestamptz fecha_alta
  }

  MOVIMIENTOS_STOCK {
    bigint id_movimiento PK
    bigint id_peluqueria FK
    bigint id_producto FK
    bigint id_perfil FK
    text tipo
    numeric cantidad
    text motivo
    bigint referencia_id
    timestamptz fecha
  }

  COMPRAS {
    bigint id_compra PK
    bigint id_peluqueria FK
    bigint id_proveedor FK
    bigint id_perfil FK
    text numero_factura
    date fecha_compra
    numeric total
    text notas
    text estado
    timestamptz fecha_creacion
  }

  DETALLE_COMPRAS {
    bigint id_detalle PK
    bigint id_compra FK
    bigint id_producto FK
    numeric cantidad
    numeric precio_unitario
    date fecha_caducidad
    text lote
  }

  SERVICIOS {
    bigint id_servicio PK
    bigint id_peluqueria FK
    text nombre
    numeric precio
    boolean activo
  }

  CONSUMOS_SERVICIO {
    bigint id_consumo PK
    bigint id_servicio FK
    bigint id_producto FK
    bigint id_perfil FK
    numeric cantidad_usada
    timestamptz fecha
    text notas
  }
```
