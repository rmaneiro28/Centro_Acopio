import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const xlsx = require('xlsx');
import { createClient } from '@supabase/supabase-js';

const envPath = '.env';
let SUPABASE_URL = '';
let SUPABASE_KEY = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
  });
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const fixData = async () => {
  try {
    console.log('--- Iniciando corrección de acentos y caracteres (UTF-8) ---');

    // 1. Borrar todos los pacientes insertados anteriormente con mala codificación
    console.log('1. Eliminando registros corruptos de pacientes...');
    const { error: deleteError } = await supabase
      .from('pacientes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.error('Error borrando pacientes:', deleteError);
      return;
    }

    // 2. Corregir nombres de hospitales mal codificados
    console.log('2. Corrigiendo nombres de hospitales en centros_acopio...');
    const { data: centros, error: centrosError } = await supabase.from('centros_acopio').select('*');
    
    for (const c of centros) {
      if (c.nombre.includes('')) {
        let fixedName = c.nombre;
        if (c.nombre === 'Perifrico de Catia') fixedName = 'Periférico de Catia';
        if (c.nombre === 'Hospital Prez Carreo') fixedName = 'Hospital Pérez Carreño';
        
        if (fixedName !== c.nombre) {
          await supabase.from('centros_acopio').update({ nombre: fixedName }).eq('id', c.id);
          console.log(`Corregido hospital: ${c.nombre} -> ${fixedName}`);
          c.nombre = fixedName; // Update local ref
        }
      }
    }

    // 3. Leer el Excel directamente (conserva todos los acentos y codificación perfecta)
    console.log('3. Leyendo Excel original (PacientesConsolidados_Hospitales_Venezuela.xlsx)...');
    const workbook = xlsx.readFile('PacientesConsolidados_Hospitales_Venezuela.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse as array of arrays to safely find headers
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    let headerRowIdx = -1;
    let headers = [];
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && row.length > 2 && typeof row[1] === 'string' && row[1].toUpperCase().includes('HOSPITAL')) {
        headerRowIdx = i;
        headers = row;
        break;
      }
    }

    if (headerRowIdx === -1) {
      console.error('No se encontró la fila de cabeceras');
      return;
    }

    // Convert to objects
    const dataObjects = [];
    for (let i = headerRowIdx + 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      
      const obj = {};
      headers.forEach((h, idx) => {
        if (h) obj[h.toString().trim()] = row[idx];
      });
      dataObjects.push(obj);
    }

    console.log(`Se encontraron ${dataObjects.length} filas en el Excel.`);

    // Recargar mapa de centros con los nombres corregidos
    const centrosMap = {};
    const { data: centrosUpdated } = await supabase.from('centros_acopio').select('id, nombre');
    centrosUpdated.forEach(c => {
      centrosMap[c.nombre.toLowerCase()] = c.id;
    });

    let countSuccess = 0;
    let countErrors = 0;

    console.log('4. Insertando datos limpios...');
    for (const row of dataObjects) {
      const hospitalName = row['HOSPITAL'] ? row['HOSPITAL'].toString().trim() : '';
      const nombreCompleto = row['APELLIDOS Y NOMBRES'] ? row['APELLIDOS Y NOMBRES'].toString().trim() : '';
      const edadStr = row['EDAD'] ? row['EDAD'].toString().trim() : '';
      const cedula = row['CÉDULA / ID'] ? row['CÉDULA / ID'].toString().trim() : '';
      const telefono = row['TELÉFONO'] ? row['TELÉFONO'].toString().trim() : '';
      const direccion = row['DIRECCIÓN'] ? row['DIRECCIÓN'].toString().trim() : '';
      const observaciones = row['OBSERVACIONES'] ? row['OBSERVACIONES'].toString().trim() : '';

      if (!hospitalName || !nombreCompleto) continue;

      let centroId = centrosMap[hospitalName.toLowerCase()];
      
      // Si el hospital no existe (por si acaso), lo creamos dinámicamente
      if (!centroId) {
        console.log(`Creando nuevo hospital: ${hospitalName}`);
        const { data: newCentro } = await supabase
          .from('centros_acopio')
          .insert([{ nombre: hospitalName, tipo: 'hospital', municipio: 'Desconocido', direccion: 'Por actualizar', latitud: 10.4806, longitud: -66.9036, insumos_urgentes: [], insumos_recibidos: [] }])
          .select()
          .single();
          
        centroId = newCentro.id;
        centrosMap[hospitalName.toLowerCase()] = centroId;
      }

      // Insertar Paciente limpio
      const { error: insertError } = await supabase
        .from('pacientes')
        .insert([{
          centro_id: centroId,
          nombre_completo: nombreCompleto,
          edad: isNaN(parseInt(edadStr)) ? null : parseInt(edadStr),
          cedula: cedula || null,
          telefono_contacto: telefono || null,
          direccion: direccion || null,
          observaciones: observaciones || null,
          estado_salud: 'estable'
        }]);

      if (insertError) {
        countErrors++;
      } else {
        countSuccess++;
      }
    }

    console.log(`\n¡Corrección finalizada!`);
    console.log(`Pacientes insertados correctamente: ${countSuccess}`);
    console.log(`Errores: ${countErrors}`);

  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
};

fixData();
