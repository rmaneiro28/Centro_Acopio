-- Script para crear la tabla de Pacientes / Personas Refugiadas

CREATE TABLE IF NOT EXISTS public.pacientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  centro_id UUID NOT NULL REFERENCES public.centros_acopio(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  edad INTEGER,
  cedula TEXT,
  telefono_contacto TEXT,
  direccion TEXT,
  observaciones TEXT,
  estado_salud TEXT DEFAULT 'estable',
  fecha_ingreso TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Políticas de Seguridad (RLS - Row Level Security)
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública (Cualquiera puede buscar familiares)
CREATE POLICY "Pacientes son visibles para todos" 
ON public.pacientes FOR SELECT USING (true);

-- Permitir inserción anónima (Cualquier voluntario puede registrar un ingreso)
CREATE POLICY "Cualquiera puede registrar pacientes" 
ON public.pacientes FOR INSERT WITH CHECK (true);

-- Permitir actualización anónima (Opcional: para actualizar estado_salud o datos)
CREATE POLICY "Cualquiera puede actualizar pacientes" 
ON public.pacientes FOR UPDATE USING (true);

-- Índice para búsquedas rápidas por cédula y nombre
CREATE INDEX IF NOT EXISTS idx_pacientes_cedula ON public.pacientes(cedula);
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON public.pacientes(nombre_completo);
CREATE INDEX IF NOT EXISTS idx_pacientes_centro ON public.pacientes(centro_id);
