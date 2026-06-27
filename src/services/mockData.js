export const mockCentros = [
  {
    id: '1',
    nombre: 'Cruz Roja - Sede Central',
    tipo: 'centro_acopio',
    estado_capacidad: 'critico',
    municipio: 'Chacao',
    direccion: 'Av. Andrés Bello, al lado del Hospital',
    contacto_telefono: '+58 414-1234567',
    insumos_urgentes: ['Medicinas', 'Agua', 'Gasa'],
    insumos_recibidos: ['Ropa', 'Zapatos'],
    verificado: true,
    latitud: 10.5042,
    longitud: -66.9020,
    ultima_actualizacion: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Centro Vecinal Los Palos Grandes',
    tipo: 'centro_acopio',
    estado_capacidad: 'estable',
    municipio: 'Chacao',
    direccion: 'Plaza Los Palos Grandes, Carpa Blanca',
    contacto_telefono: '+58 412-9876543',
    insumos_urgentes: ['Alimentos no perecederos', 'Pañales'],
    insumos_recibidos: ['Agua'],
    verificado: true,
    latitud: 10.4995,
    longitud: -66.8432,
    ultima_actualizacion: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '3',
    nombre: 'Iglesia San Juan Bosco',
    tipo: 'refugio',
    estado_capacidad: 'lleno',
    municipio: 'Altamira',
    direccion: 'Plaza Altamira, entrada sur',
    contacto_telefono: 'No disponible',
    insumos_urgentes: [],
    insumos_recibidos: ['Todos los insumos', 'Capacidad Máxima'],
    verificado: false,
    latitud: 10.4960,
    longitud: -66.8485,
    ultima_actualizacion: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '4',
    nombre: 'Colegio San Ignacio',
    tipo: 'centro_acopio',
    estado_capacidad: 'critico',
    municipio: 'Chacao',
    direccion: 'Av. Santa Teresa de Jesús',
    contacto_telefono: '+58 212-2631245',
    insumos_urgentes: ['Fórmula infantil', 'Cobijas', 'Linternas'],
    insumos_recibidos: ['Agua'],
    verificado: true,
    latitud: 10.4925,
    longitud: -66.8550,
    ultima_actualizacion: new Date(Date.now() - 1800000).toISOString() // 30 mins ago
  },
  {
    id: '5',
    nombre: 'Hospital Universitario de Caracas',
    tipo: 'hospital',
    estado_capacidad: 'critico',
    municipio: 'Libertador',
    direccion: 'Ciudad Universitaria de Caracas',
    contacto_telefono: '+58 212-6067111',
    insumos_urgentes: ['Analgésicos', 'Inyectadoras', 'Suero'],
    insumos_recibidos: ['Comida'],
    verificado: true,
    latitud: 10.4850,
    longitud: -66.8900,
    ultima_actualizacion: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  }
];

export const getMockCentros = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCentros);
    }, 800); // Simulate network delay
  });
};
