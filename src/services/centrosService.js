import { api } from './apiClient';

const TABLE_NAME = 'centros_acopio';

export const getCentros = async () => {
  return await api.getAll(TABLE_NAME, {
    orderBy: { column: 'ultima_actualizacion', ascending: false }
  });
};

export const addCentro = async (centroData) => {
  // Remove ID to let Supabase generate a UUID if using the SQL schema provided
  const { id, ...dataToInsert } = centroData;
  return await api.create(TABLE_NAME, dataToInsert);
};

export const updateCentro = async (id, updateData) => {
  return await api.update(TABLE_NAME, id, updateData);
};

// --- SERVICIOS DE PACIENTES ---

export const getPacientesByCentro = async (centroId) => {
  const { data, error } = await api.client
    .from('pacientes')
    .select('*, centros_acopio(nombre, tipo)')
    .eq('centro_id', centroId)
    .order('fecha_ingreso', { ascending: false });
    
  if (error) {
    console.error('Error fetching pacientes by centro:', error);
    return [];
  }
  
  return data || [];
};

export const addPaciente = async (pacienteData) => {
  return await api.create('pacientes', pacienteData);
};

export const getPacientesCount = async () => {
  const { count, error } = await api.client
    .from('pacientes')
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error('Error fetching pacientes count:', error);
    return 0;
  }
  return count || 0;
};

export const getPacientesFiltrados = async (options = {}) => {
  const { limit = 50, hospitalId, estado, edadRango, sortBy } = options;
  
  let query = api.client.from('pacientes').select('*, centros_acopio(nombre, tipo)');
  
  if (hospitalId) query = query.eq('centro_id', hospitalId);
  if (estado) query = query.ilike('estado_salud', estado);
  
  if (edadRango) {
    if (edadRango === 'infantil') query = query.gte('edad', 0).lte('edad', 12);
    else if (edadRango === 'adolescente') query = query.gte('edad', 13).lte('edad', 17);
    else if (edadRango === 'adulto') query = query.gte('edad', 18).lte('edad', 59);
    else if (edadRango === 'mayor') query = query.gte('edad', 60);
  }

  // Sorting
  if (sortBy === 'nombre_asc') query = query.order('nombre_completo', { ascending: true });
  else if (sortBy === 'nombre_desc') query = query.order('nombre_completo', { ascending: false });
  else if (sortBy === 'edad_asc') query = query.order('edad', { ascending: true });
  else if (sortBy === 'edad_desc') query = query.order('edad', { ascending: false });
  else query = query.order('fecha_ingreso', { ascending: false }); // Default
  
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
    
  if (error) {
    console.error('Error fetching filtered pacientes:', error);
    return [];
  }
  
  return data || [];
};

export const searchPacientes = async (searchTerm) => {
  if (!searchTerm) return [];
  
  // Utiliza la función RPC de Supabase (Fuzzy Search con pg_trgm)
  const { data, error } = await api.client.rpc('fuzzy_search_pacientes', {
    search_term: searchTerm
  });
    
  if (error) {
    console.error('Error en fuzzy search:', error);
    
    // Fallback silencioso en caso de que el usuario no haya ejecutado el SQL de pg_trgm aún
    const fallbackResponse = await api.client
      .from('pacientes')
      .select('*, centros_acopio(nombre, tipo)')
      .or(`nombre_completo.ilike.%${searchTerm}%,cedula.ilike.%${searchTerm}%`)
      .order('fecha_ingreso', { ascending: false });
      
    return fallbackResponse.data || [];
  }
  
  return data || [];
};
