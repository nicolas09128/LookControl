-- Corrige compras para que coincida con el frontend.
ALTER TABLE public.compras
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS fecha_creacion timestamp with time zone NOT NULL DEFAULT now();

ALTER TABLE public.compras
  DROP CONSTRAINT IF EXISTS compras_estado_check;

ALTER TABLE public.compras
  ADD CONSTRAINT compras_estado_check
  CHECK (estado = ANY (ARRAY['pendiente'::text, 'recibido'::text, 'cancelado'::text]));

-- Funciones que no se usan en la app o son confusas.
-- get_my_peluqueria devolvia id_perfil, pero ya existe get_my_id_peluqueria().
DROP FUNCTION IF EXISTS public.get_my_peluqueria();

-- Esta funcion es demasiado automatica para este proyecto: mejor activar RLS manualmente.
DROP EVENT TRIGGER IF EXISTS rls_auto_enable;
DROP EVENT TRIGGER IF EXISTS ensure_rls;
DROP FUNCTION IF EXISTS public.rls_auto_enable();
