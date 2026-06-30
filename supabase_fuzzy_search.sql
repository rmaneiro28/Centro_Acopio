-- 1. Habilitar la extensión pg_trgm para soporte de búsqueda difusa (Fuzzy Search)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Crear índices trigrama para acelerar las búsquedas por similitud
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre_trgm ON public.pacientes USING GIN (nombre_completo gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pacientes_cedula_trgm ON public.pacientes USING GIN (cedula gin_trgm_ops);

-- 3. Crear la función RPC (Remote Procedure Call) para que el frontend la consuma
CREATE OR REPLACE FUNCTION fuzzy_search_pacientes(search_term TEXT)
RETURNS TABLE (
    id UUID,
    centro_id UUID,
    nombre_completo TEXT,
    edad INTEGER,
    cedula TEXT,
    telefono_contacto TEXT,
    direccion TEXT,
    observaciones TEXT,
    estado_salud TEXT,
    fecha_ingreso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE,
    centro_nombre TEXT,
    centro_tipo TEXT,
    similitud REAL
) AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        p.id, 
        p.centro_id, 
        p.nombre_completo, 
        p.edad, 
        p.cedula, 
        p.telefono_contacto, 
        p.direccion, 
        p.observaciones, 
        p.estado_salud, 
        p.fecha_ingreso,
        p.created_at,
        c.nombre AS centro_nombre, 
        c.tipo AS centro_tipo,
        GREATEST(similarity(p.nombre_completo, search_term), similarity(p.cedula, search_term)) AS similitud
    FROM public.pacientes p
    LEFT JOIN public.centros_acopio c ON p.centro_id = c.id
    WHERE 
        -- Coincidencia difusa (fuzzy) o coincidencia exacta/parcial (ilike)
        p.nombre_completo % search_term 
        OR p.cedula % search_term
        OR p.nombre_completo ILIKE '%' || search_term || '%'
        OR p.cedula ILIKE '%' || search_term || '%'
    ORDER BY 
        similitud DESC,
        p.fecha_ingreso DESC
    LIMIT 30;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Asegurarnos que la función sea accesible por usuarios anónimos (si es una API pública)
GRANT EXECUTE ON FUNCTION fuzzy_search_pacientes(TEXT) TO anon, authenticated;
