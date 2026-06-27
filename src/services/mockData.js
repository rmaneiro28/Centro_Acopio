export const mockCentros = [
  {
    id: '1',
    nombre: 'Cruz Roja - Sede Central',
    estado_capacidad: 'critico',
    municipio: 'Chacao',
    direccion: 'Av. Andrés Bello, al lado del Hospital',
    contacto_telefono: '+58 414-1234567',
    insumos_urgentes: ['Medicinas', 'Agua', 'Gasa'],
    insumos_recibidos: ['Ropa', 'Zapatos'],
    verificado: true,
    ultima_actualizacion: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Centro Vecinal Los Palos Grandes',
    estado_capacidad: 'estable',
    municipio: 'Chacao',
    direccion: 'Plaza Los Palos Grandes, Carpa Blanca',
    contacto_telefono: '+58 412-9876543',
    insumos_urgentes: ['Alimentos no perecederos', 'Pañales'],
    insumos_recibidos: ['Agua'],
    verificado: true,
    ultima_actualizacion: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '3',
    nombre: 'Iglesia San Juan Bosco',
    estado_capacidad: 'lleno',
    municipio: 'Altamira',
    direccion: 'Plaza Altamira, entrada sur',
    contacto_telefono: 'No disponible',
    insumos_urgentes: [],
    insumos_recibidos: ['Todos los insumos', 'Capacidad Máxima'],
    verificado: false,
    ultima_actualizacion: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: '4',
    nombre: 'Colegio San Ignacio',
    estado_capacidad: 'critico',
    municipio: 'Chacao',
    direccion: 'Av. Santa Teresa de Jesús',
    contacto_telefono: '+58 212-2631245',
    insumos_urgentes: ['Fórmula infantil', 'Cobijas', 'Linternas'],
    insumos_recibidos: ['Agua'],
    verificado: true,
    ultima_actualizacion: new Date(Date.now() - 1800000).toISOString() // 30 mins ago
  }
];

export const getMockCentros = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCentros);
    }, 800); // Simulate network delay
  });
};
