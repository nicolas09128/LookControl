-- LookControl remote schema dump
-- Generated: 2026-05-05 10:34:20 +02:00
-- Source: Supabase project tkvlbqhvfunaefqbpetu
-- Note: generated via PostgreSQL catalogs because Supabase CLI requires Docker/pg_dump 17 on this machine.

CREATE SCHEMA IF NOT EXISTS public;


CREATE SEQUENCE IF NOT EXISTS public.peluquerias_id_peluqueria_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.perfiles_id_perfil_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.categorias_id_categoria_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.proveedores_id_proveedor_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.productos_id_producto_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.movimientos_stock_id_movimiento_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.compras_id_compra_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.servicios_id_servicio_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
CREATE SEQUENCE IF NOT EXISTS public.detalle_compras_id_detalle_seq AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
-- Table: public.peluquerias
CREATE TABLE IF NOT EXISTS public.peluquerias (
  id_peluqueria integer NOT NULL,
  nombre text NOT NULL,
  codigo_invitacion text NOT NULL,
  activo boolean NOT NULL,
  fecha_alta timestamp with time zone NOT NULL,
  CONSTRAINT peluquerias_codigo_invitacion_key UNIQUE (codigo_invitacion),
  CONSTRAINT peluquerias_pkey PRIMARY KEY (id_peluqueria));
-- Table: public.perfiles
CREATE TABLE IF NOT EXISTS public.perfiles (
  id_perfil integer NOT NULL,
  user_id uuid NOT NULL,
  id_peluqueria integer,
  nombre_completo text,
  email text,
  rol text NOT NULL,
  permisos text[] NOT NULL,
  fecha_registro timestamp with time zone NOT NULL,
  CONSTRAINT perfiles_email_key UNIQUE (email),
  CONSTRAINT perfiles_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE SET NULL,
  CONSTRAINT perfiles_pkey PRIMARY KEY (id_perfil),
  CONSTRAINT perfiles_rol_check CHECK (rol = ANY (ARRAY['admin'::text, 'empleado'::text, 'pendiente'::text])),
  CONSTRAINT perfiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT perfiles_user_id_key UNIQUE (user_id));
-- Table: public.categorias
CREATE TABLE IF NOT EXISTS public.categorias (
  id_categoria integer NOT NULL,
  nombre text NOT NULL,
  CONSTRAINT categorias_nombre_key UNIQUE (nombre),
  CONSTRAINT categorias_pkey PRIMARY KEY (id_categoria));
-- Table: public.proveedores
CREATE TABLE IF NOT EXISTS public.proveedores (
  id_proveedor integer NOT NULL,
  id_peluqueria integer NOT NULL,
  nombre text NOT NULL,
  telefono text,
  email text,
  activo boolean NOT NULL,
  fecha_alta timestamp with time zone NOT NULL,
  direccion text NOT NULL,
  notas text,
  CONSTRAINT proveedores_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE CASCADE,
  CONSTRAINT proveedores_pkey PRIMARY KEY (id_proveedor));
-- Table: public.productos
CREATE TABLE IF NOT EXISTS public.productos (
  id_producto integer NOT NULL,
  id_peluqueria integer NOT NULL,
  id_categoria integer NOT NULL,
  id_proveedor integer,
  nombre text NOT NULL,
  precio_coste numeric(10,2),
  precio_venta numeric(10,2),
  stock_actual numeric(10,3) NOT NULL,
  unidad text NOT NULL,
  activo boolean NOT NULL,
  descripcion text,
  stock_minimo numeric(10,3) NOT NULL,
  CONSTRAINT productos_id_categoria_fkey FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
  CONSTRAINT productos_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE CASCADE,
  CONSTRAINT productos_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
  CONSTRAINT productos_pkey PRIMARY KEY (id_producto));
-- Table: public.movimientos_stock
CREATE TABLE IF NOT EXISTS public.movimientos_stock (
  id_movimiento integer NOT NULL,
  id_peluqueria integer NOT NULL,
  id_producto integer NOT NULL,
  id_perfil integer NOT NULL,
  tipo text NOT NULL,
  cantidad numeric(10,3) NOT NULL,
  motivo text,
  fecha timestamp with time zone NOT NULL,
  CONSTRAINT movimientos_stock_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE CASCADE,
  CONSTRAINT movimientos_stock_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES perfiles(id_perfil),
  CONSTRAINT movimientos_stock_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE RESTRICT,
  CONSTRAINT movimientos_stock_pkey PRIMARY KEY (id_movimiento),
  CONSTRAINT movimientos_stock_tipo_check CHECK (tipo = ANY (ARRAY['entrada'::text, 'salida'::text, 'ajuste'::text])));
-- Table: public.compras
CREATE TABLE IF NOT EXISTS public.compras (
  id_compra integer NOT NULL,
  id_peluqueria integer NOT NULL,
  id_perfil integer NOT NULL,
  total numeric(10,2),
  fecha_compra date NOT NULL,
  id_proveedor integer,
  numero_factura text,
  notas text,
  estado text NOT NULL,
  fecha_creacion timestamp with time zone NOT NULL,
  CONSTRAINT compras_estado_check CHECK (estado = ANY (ARRAY['pendiente'::text, 'recibido'::text, 'cancelado'::text])),
  CONSTRAINT compras_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE CASCADE,
  CONSTRAINT compras_id_perfil_fkey FOREIGN KEY (id_perfil) REFERENCES perfiles(id_perfil),
  CONSTRAINT compras_id_proveedor_fkey FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT compras_pkey PRIMARY KEY (id_compra));
-- Table: public.servicios
CREATE TABLE IF NOT EXISTS public.servicios (
  id_servicio integer NOT NULL,
  id_peluqueria integer NOT NULL,
  nombre text NOT NULL,
  precio numeric(10,2),
  activo boolean NOT NULL,
  CONSTRAINT servicios_id_peluqueria_fkey FOREIGN KEY (id_peluqueria) REFERENCES peluquerias(id_peluqueria) ON DELETE CASCADE,
  CONSTRAINT servicios_pkey PRIMARY KEY (id_servicio));
-- Table: public.detalle_compras
CREATE TABLE IF NOT EXISTS public.detalle_compras (
  id_detalle integer NOT NULL,
  id_compra integer NOT NULL,
  id_producto integer NOT NULL,
  cantidad numeric NOT NULL,
  precio_unitario numeric NOT NULL,
  fecha_caducidad date,
  lote text,
  CONSTRAINT detalle_compras_cantidad_check CHECK (cantidad > 0::numeric),
  CONSTRAINT detalle_compras_id_compra_fkey FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
  CONSTRAINT detalle_compras_id_producto_fkey FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
  CONSTRAINT detalle_compras_pkey PRIMARY KEY (id_detalle));
ALTER TABLE public.peluquerias ALTER COLUMN activo SET DEFAULT true;
ALTER TABLE public.peluquerias ALTER COLUMN codigo_invitacion SET DEFAULT upper(substr(md5((random())::text), 1, 8));
ALTER TABLE public.peluquerias ALTER COLUMN fecha_alta SET DEFAULT now();
ALTER TABLE public.peluquerias ALTER COLUMN id_peluqueria SET DEFAULT nextval('peluquerias_id_peluqueria_seq'::regclass);
ALTER TABLE public.perfiles ALTER COLUMN fecha_registro SET DEFAULT now();
ALTER TABLE public.perfiles ALTER COLUMN id_perfil SET DEFAULT nextval('perfiles_id_perfil_seq'::regclass);
ALTER TABLE public.perfiles ALTER COLUMN permisos SET DEFAULT '{}'::text[];
ALTER TABLE public.perfiles ALTER COLUMN rol SET DEFAULT 'pendiente'::text;
ALTER TABLE public.categorias ALTER COLUMN id_categoria SET DEFAULT nextval('categorias_id_categoria_seq'::regclass);
ALTER TABLE public.proveedores ALTER COLUMN activo SET DEFAULT true;
ALTER TABLE public.proveedores ALTER COLUMN fecha_alta SET DEFAULT now();
ALTER TABLE public.proveedores ALTER COLUMN id_proveedor SET DEFAULT nextval('proveedores_id_proveedor_seq'::regclass);
ALTER TABLE public.productos ALTER COLUMN activo SET DEFAULT true;
ALTER TABLE public.productos ALTER COLUMN id_producto SET DEFAULT nextval('productos_id_producto_seq'::regclass);
ALTER TABLE public.productos ALTER COLUMN stock_actual SET DEFAULT 0;
ALTER TABLE public.productos ALTER COLUMN stock_minimo SET DEFAULT 0;
ALTER TABLE public.productos ALTER COLUMN unidad SET DEFAULT 'ud'::text;
ALTER TABLE public.movimientos_stock ALTER COLUMN fecha SET DEFAULT now();
ALTER TABLE public.movimientos_stock ALTER COLUMN id_movimiento SET DEFAULT nextval('movimientos_stock_id_movimiento_seq'::regclass);
ALTER TABLE public.compras ALTER COLUMN estado SET DEFAULT 'pendiente'::text;
ALTER TABLE public.compras ALTER COLUMN fecha_compra SET DEFAULT CURRENT_DATE;
ALTER TABLE public.compras ALTER COLUMN fecha_creacion SET DEFAULT now();
ALTER TABLE public.compras ALTER COLUMN id_compra SET DEFAULT nextval('compras_id_compra_seq'::regclass);
ALTER TABLE public.servicios ALTER COLUMN activo SET DEFAULT true;
ALTER TABLE public.servicios ALTER COLUMN id_servicio SET DEFAULT nextval('servicios_id_servicio_seq'::regclass);
ALTER TABLE public.detalle_compras ALTER COLUMN id_detalle SET DEFAULT nextval('detalle_compras_id_detalle_seq'::regclass);
ALTER TABLE public.detalle_compras ALTER COLUMN precio_unitario SET DEFAULT 0;
CREATE OR REPLACE FUNCTION public.get_my_rol()
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$

begin

  return (select rol from public.perfiles where user_id = auth.uid());

end; $function$
;
CREATE OR REPLACE FUNCTION public.get_my_id_perfil()
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$

begin

  return (select id_perfil from public.perfiles where user_id = auth.uid());

end; $function$
;
CREATE OR REPLACE FUNCTION public.get_my_id_peluqueria()
 RETURNS integer
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$

begin

  return (select id_peluqueria from public.perfiles where user_id = auth.uid());

end; $function$
;
CREATE OR REPLACE FUNCTION public.get_my_permisos()
 RETURNS text[]
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
AS $function$

begin

  return (select permisos from public.perfiles where user_id = auth.uid());

end; $function$
;
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$

DECLARE

  tipo_usuario text;

  nombre_p text;

  nueva_peluqueria_id integer;

BEGIN

  -- Extraemos los metadatos que envías desde el RegisterOwnerPage.tsx

  tipo_usuario := new.raw_user_meta_data->>'tipo';

  nombre_p := new.raw_user_meta_data->>'nombre_peluqueria';



  IF tipo_usuario = 'admin' AND nombre_p IS NOT NULL THEN

    -- 1. Creamos la peluquería primero

    INSERT INTO public.peluquerias (nombre)

    VALUES (nombre_p)

    RETURNING id_peluqueria INTO nueva_peluqueria_id;



    -- 2. Creamos el perfil como admin vinculado a esa peluquería

    INSERT INTO public.perfiles (user_id, id_peluqueria, email, rol, nombre_completo)

    VALUES (

      new.id, 

      nueva_peluqueria_id, 

      NULLIF(TRIM(new.email), ''), 

      'admin', 

      new.raw_user_meta_data->>'nombre_completo'

    );



  ELSIF tipo_usuario = 'empleado' THEN

    INSERT INTO public.perfiles (user_id, email, rol, nombre_completo)

    VALUES (new.id, NULLIF(TRIM(new.email), ''), 'empleado', new.raw_user_meta_data->>'nombre_completo');



  ELSE

    INSERT INTO public.perfiles (user_id, email, rol, nombre_completo)

    VALUES (new.id, NULLIF(TRIM(new.email), ''), 'pendiente', new.raw_user_meta_data->>'nombre_completo');

  END IF;



  RETURN new;

END;

$function$
;
ALTER TABLE public.peluquerias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY cat_read_all ON public.categorias FOR SELECT USING ((auth.role() = 'authenticated'::text));
CREATE POLICY prov_select_owner ON public.proveedores FOR ALL USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY prod_select_owner ON public.productos FOR ALL USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY mov_select_owner ON public.movimientos_stock FOR ALL USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY compra_select_owner ON public.compras FOR ALL USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY serv_select_owner ON public.servicios FOR ALL USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY peluqueria_update_owner ON public.peluquerias FOR UPDATE USING ((id_peluqueria = get_my_id_peluqueria()));
CREATE POLICY perfil_select_own ON public.perfiles FOR SELECT USING ((user_id = auth.uid()));
CREATE POLICY perfil_insert_own ON public.perfiles FOR INSERT WITH CHECK ((user_id = auth.uid()));
CREATE POLICY perfil_update_own ON public.perfiles FOR UPDATE USING ((user_id = auth.uid()));
CREATE POLICY perfil_admin_all ON public.perfiles FOR ALL USING ((get_my_rol() = 'admin'::text));
CREATE POLICY peluqueria_insert_authenticated ON public.peluquerias FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY peluqueria_select_owner ON public.peluquerias FOR SELECT TO authenticated USING (((id_peluqueria = ( SELECT perfiles.id_peluqueria
   FROM perfiles
  WHERE (perfiles.user_id = auth.uid()))) OR (EXISTS ( SELECT 1
   FROM perfiles
  WHERE ((perfiles.user_id = auth.uid()) AND (perfiles.id_peluqueria IS NULL))))));
CREATE POLICY "empleados ven movimientos de su peluquería" ON public.movimientos_stock FOR SELECT TO authenticated USING ((id_perfil IN ( SELECT p.id_perfil
   FROM perfiles p
  WHERE (p.id_peluqueria = ( SELECT perfiles.id_peluqueria
           FROM perfiles
          WHERE (perfiles.user_id = auth.uid()))))));
CREATE POLICY "empleados pueden registrar movimientos" ON public.movimientos_stock FOR INSERT TO authenticated WITH CHECK ((id_perfil = ( SELECT perfiles.id_perfil
   FROM perfiles
  WHERE (perfiles.user_id = auth.uid()))));
CREATE POLICY detalle_compras_all ON public.detalle_compras FOR ALL USING ((id_compra IN ( SELECT compras.id_compra
   FROM compras
  WHERE (compras.id_peluqueria = ( SELECT perfiles.id_peluqueria
           FROM perfiles
          WHERE (perfiles.user_id = auth.uid()))))));
