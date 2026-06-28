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
