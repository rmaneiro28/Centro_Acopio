import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function countRows() {
  const { count: pacientesCount, error: error1 } = await supabase
    .from('pacientes')
    .select('*', { count: 'exact', head: true });
    
  const { count: centrosCount, error: error2 } = await supabase
    .from('centros_acopio')
    .select('*', { count: 'exact', head: true });

  console.log(`=== ESTADO ACTUAL DE LA BASE DE DATOS ===`);
  console.log(`Pacientes (Personas): ${pacientesCount}`);
  console.log(`Centros de Acopio / Hospitales: ${centrosCount}`);
}

countRows();
