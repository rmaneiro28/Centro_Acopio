import fs from 'fs';
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

const dict = {
  'MU\uFFFDOZ': 'MUÑOZ',
  'MU\uFFFDON': 'MUÑON',
  'L\uFFFDPEZ': 'LÓPEZ',
  'RAM\uFFFDREZ': 'RAMÍREZ',
  'RODR\uFFFDGUEZ': 'RODRÍGUEZ',
  'P\uFFFDREZ': 'PÉREZ',
  'S\uFFFDNCHEZ': 'SÁNCHEZ',
  'GARC\uFFFDA': 'GARCÍA',
  'HERN\uFFFDNDEZ': 'HERNÁNDEZ',
  'GONZ\uFFFDLEZ': 'GONZÁLEZ',
  'MART\uFFFDNEZ': 'MARTÍNEZ',
  'C\uFFFDCERES': 'CÁCERES',
  'OMA\uFFFDA': 'OMAÑA',
  'JOS\uFFFD': 'JOSÉ',
  'JES\uFFFDS': 'JESÚS',
  'PAB\uFFFDN': 'PABÓN',
  'DUR\uFFFDN': 'DURÁN',
  'FERM\uFFFDNE': 'FERMÍNE',
  'ROND\uFFFDN': 'RONDÓN',
  'SEBASTI\uFFFDN': 'SEBASTIÁN',
  'CHAC\uFFFDN': 'CHACÓN',
  'CASTA\uFFFDO': 'CASTAÑO',
  'C\uFFFDRDOVA': 'CÓRDOVA',
  'ESTEFAN\uFFFDA': 'ESTEFANÍA',
  'VENDEZIL\uFFFDN': 'VENDEZILÍN',
  'SEDE\uFFFDO': 'SEDEÑO',
  'ORTU\uFFFDO': 'ORTUÑO',
  'OMAR\uFFFDO': 'OMARÍO',
  'GORDOF\uFFFDN': 'GORDOFÍN'
};

const fixData = async () => {
  try {
    console.log('--- Buscando pacientes con caracteres corruptos () ---');
    const { data: pacientes, error } = await supabase.from('pacientes').select('id, nombre_completo');
    
    if (error) throw error;

    const weird = pacientes.filter(p => p.nombre_completo.includes('\uFFFD'));
    console.log(`Encontrados ${weird.length} pacientes con problemas.`);

    let fixedCount = 0;

    for (const p of weird) {
      let newName = p.nombre_completo;
      
      // Aplicar diccionario
      for (const [corrupt, correct] of Object.entries(dict)) {
        if (newName.includes(corrupt)) {
          newName = newName.split(corrupt).join(correct);
        }
      }

      // Si aún queda el caracter, tratamos de adivinar o simplemente advertimos
      if (newName.includes('\uFFFD')) {
        console.log(`⚠️ No se pudo corregir completamente: ${p.nombre_completo} -> ${newName}`);
      } else {
        console.log(`✅ Corregido: ${p.nombre_completo} -> ${newName}`);
        await supabase.from('pacientes').update({ nombre_completo: newName }).eq('id', p.id);
        fixedCount++;
      }
    }

    console.log(`\n¡Se arreglaron ${fixedCount} pacientes exitosamente!`);

  } catch (err) {
    console.error(err);
  }
};

fixData();
