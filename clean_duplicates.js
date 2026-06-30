import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_PUBLISHABLE_KEY=')) supabaseKey = line.split('=')[1].trim();
  });
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDuplicates() {
  console.log('Obteniendo todos los pacientes...');
  
  const { data: pacientes, error } = await supabase
    .from('pacientes')
    .select('*')
    .order('fecha_ingreso', { ascending: false });

  if (error) {
    console.error('Error obteniendo pacientes:', error);
    return;
  }

  console.log(`Total de pacientes actuales: ${pacientes.length}`);

  const uniqueMap = new Map();
  const idsToDelete = [];

  for (const p of pacientes) {
    // Usamos cédula si existe, de lo contrario usamos nombre completo para identificar duplicados
    const key = (p.cedula && p.cedula.trim() !== '') ? p.cedula.trim() : p.nombre_completo.trim().toLowerCase();

    if (uniqueMap.has(key)) {
      idsToDelete.push(p.id);
      console.log(`Duplicado encontrado para [${key}]: Manteniendo ${uniqueMap.get(key).id}, eliminando ${p.id}`);
    } else {
      uniqueMap.set(key, p);
    }
  }

  console.log(`Total de registros duplicados a eliminar: ${idsToDelete.length}`);

  if (idsToDelete.length > 0) {
    console.log('Eliminando duplicados por lotes...');
    
    // Eliminar en lotes de 50
    const batchSize = 50;
    let totalDeleted = 0;
    
    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize);
      
      const { data, error: deleteError } = await supabase
        .from('pacientes')
        .delete()
        .in('id', batch);
        
      if (deleteError) {
        console.error('Error al eliminar lote:', deleteError);
      } else {
        totalDeleted += batch.length;
      }
    }
    
    console.log(`Se han eliminado ${totalDeleted} registros duplicados exitosamente.`);
  } else {
    console.log('No se encontraron registros con cédula duplicada.');
  }
}

cleanDuplicates();
