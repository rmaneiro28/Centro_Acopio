import { supabase } from './supabaseClient';

export const getCentros = async () => {
  const { data, error } = await supabase
    .from('centros_acopio')
    .select('*')
    .order('ultima_actualizacion', { ascending: false });

  if (error) {
    console.error('Error fetching centros:', error);
    throw error;
  }

  return data || [];
};

export const addCentro = async (centroData) => {
  // Remove ID to let Supabase generate a UUID if using the SQL schema provided
  const { id, ...dataToInsert } = centroData;
  
  const { data, error } = await supabase
    .from('centros_acopio')
    .insert([dataToInsert])
    .select();

  if (error) {
    console.error('Error adding centro:', error);
    throw error;
  }

  return data[0];
};

export const updateCentro = async (id, updateData) => {
  const { data, error } = await supabase
    .from('centros_acopio')
    .update(updateData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating centro:', error);
    throw error;
  }

  return data[0];
};
