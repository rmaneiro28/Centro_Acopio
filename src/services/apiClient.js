import { supabase } from './supabaseClient';

/**
 * Cliente API Genérico
 * 
 * Capa base de servicios API para estandarizar las peticiones y el manejo de errores.
 * Esto asegura que todas las interacciones con la base de datos (o backend futuro)
 * mantengan un mismo modelo de respuesta y manejo de excepciones en toda la app.
 */
class ApiClient {
  /**
   * Crea una instancia del ApiClient
   * @param {Object} client - El cliente de base de datos (ej. instancia de Supabase)
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Estandariza la respuesta y el manejo de errores del cliente.
   * Lanza una excepción controlada si la petición falla.
   * 
   * @private
   * @param {Object} response - Objeto de respuesta que contiene { data, error }
   * @returns {*} Los datos obtenidos exitosamente
   * @throws {Error} Si existe un error en la respuesta
   */
  _handleResponse({ data, error }) {
    if (error) {
      console.error('API Error:', error.message || error);
      throw new Error(error.message || 'Error en la petición API');
    }
    return data;
  }

  /**
   * Obtiene todos los registros de una tabla, con opciones de filtrado y ordenamiento.
   * 
   * @async
   * @param {string} table - Nombre de la tabla a consultar
   * @param {Object} [options={}] - Opciones de la consulta
   * @param {string} [options.select='*'] - Columnas a seleccionar (por defecto todas '*')
   * @param {Object} [options.orderBy] - Opciones de ordenamiento
   * @param {string} options.orderBy.column - Columna por la cual ordenar
   * @param {boolean} [options.orderBy.ascending=true] - Si el orden es ascendente
   * @param {Object} [options.eq] - Filtro de igualdad básico
   * @param {string} options.eq.column - Columna a filtrar
   * @param {string|number|boolean} options.eq.value - Valor esperado
   * @returns {Promise<Array>} Un arreglo con los registros encontrados (o vacío)
   */
  async getAll(table, options = {}) {
    let query = this.client.from(table).select(options.select || '*');
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
    }
    
    if (options.eq) {
      query = query.eq(options.eq.column, options.eq.value);
    }

    const response = await query;
    return this._handleResponse(response) || [];
  }

  /**
   * Obtiene un registro específico por su ID.
   * 
   * @async
   * @param {string} table - Nombre de la tabla
   * @param {string|number} id - Identificador del registro
   * @param {string} [idColumn='id'] - Nombre de la columna que actúa como ID (por defecto 'id')
   * @returns {Promise<Object>} El objeto del registro encontrado
   */
  async getById(table, id, idColumn = 'id') {
    const response = await this.client
      .from(table)
      .select('*')
      .eq(idColumn, id)
      .single();
      
    return this._handleResponse(response);
  }

  /**
   * Crea e inserta un nuevo registro en la tabla.
   * 
   * @async
   * @param {string} table - Nombre de la tabla
   * @param {Object} data - Objeto con los datos a insertar
   * @returns {Promise<Object|null>} El registro recién creado con sus datos actualizados (incluyendo ID generado)
   */
  async create(table, data) {
    const response = await this.client
      .from(table)
      .insert([data])
      .select();
      
    const result = this._handleResponse(response);
    return result ? result[0] : null;
  }

  /**
   * Actualiza un registro existente mediante su ID.
   * 
   * @async
   * @param {string} table - Nombre de la tabla
   * @param {string|number} id - Identificador del registro a actualizar
   * @param {Object} data - Objeto con las propiedades a modificar
   * @param {string} [idColumn='id'] - Nombre de la columna que actúa como ID (por defecto 'id')
   * @returns {Promise<Object|null>} El registro actualizado
   */
  async update(table, id, data, idColumn = 'id') {
    const response = await this.client
      .from(table)
      .update(data)
      .eq(idColumn, id)
      .select();
      
    const result = this._handleResponse(response);
    return result ? result[0] : null;
  }

  /**
   * Elimina un registro existente mediante su ID.
   * 
   * @async
   * @param {string} table - Nombre de la tabla
   * @param {string|number} id - Identificador del registro a eliminar
   * @param {string} [idColumn='id'] - Nombre de la columna que actúa como ID (por defecto 'id')
   * @returns {Promise<*>} La respuesta del servidor tras la eliminación
   */
  async remove(table, id, idColumn = 'id') {
    const response = await this.client
      .from(table)
      .delete()
      .eq(idColumn, id);
      
    return this._handleResponse(response);
  }
}

export const api = new ApiClient(supabase);
