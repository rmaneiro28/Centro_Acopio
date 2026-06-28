export default async function handler(req, res) {
  // Configurar encabezados CORS para permitir peticiones desde cualquier origen (API Pública)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Responder rápido a las peticiones pre-flight (CORS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Obtener variables de entorno (Vercel automáticamente carga las de .env si están configuradas)
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'Configuración del servidor incompleta (Faltan variables de Supabase)' });
  }

  // Reconstruir la URL de consulta para pasar los Query Params (ej. ?select=*&tipo=eq.refugio)
  // req.url contendrá algo como "/api/v1/centros_acopio?select=*" dependiendo del enrutamiento
  const urlParts = req.url.split('?');
  const queryString = urlParts.length > 1 ? `?${urlParts[1]}` : '';
  const targetUrl = `${supabaseUrl}/rest/v1/centros_acopio${queryString}`;

  const options = {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Prefer': req.headers['prefer'] || 'return=representation'
    }
  };

  // Pasar el body de la petición original si es un POST/PATCH/PUT
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    options.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const supabaseRes = await fetch(targetUrl, options);
    
    // Si la respuesta no es 204 No Content, parsear JSON
    let data = null;
    if (supabaseRes.status !== 204) {
      data = await supabaseRes.json();
    }
    
    res.status(supabaseRes.status).json(data || {});
  } catch (error) {
    console.error('API Proxy Error:', error);
    res.status(500).json({ error: 'Error interno del servidor al contactar la base de datos' });
  }
}
