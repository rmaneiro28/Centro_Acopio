# 🌍 RedAyuda - API Pública (Open API)

RedAyuda ofrece una API REST pública (proporcionada nativamente por Supabase) para que desarrolladores, organizaciones de rescate, periodistas y proyectos de terceros puedan consumir y aportar información sobre Centros de Acopio, Refugios y Hospitales de manera libre.

## 🔗 URL Base

Todas las peticiones deben realizarse a la siguiente URL base. *(Reemplaza `[TU_PROYECTO_SUPABASE]` con el subdominio real de tu proyecto)*:

```text
https://[TU_PROYECTO_SUPABASE].supabase.co/rest/v1
```

## 🔐 Autenticación

Para interactuar con la API de RedAyuda, debes incluir tu clave pública anónima (`anon key`) en los encabezados HTTP de todas tus peticiones:

```http
apikey: TU_ANON_KEY
Authorization: Bearer TU_ANON_KEY
```

> **Nota de Seguridad:** La API pública está protegida por las Políticas de Seguridad de Filas (RLS - Row Level Security) de Supabase. La lectura de datos suele ser pública, pero las reglas exactas para escritura dependen de cómo hayas configurado el RLS en tu panel de Supabase.

---

## 📦 Endpoints

### 1. Obtener todos los lugares (GET)

Devuelve una lista completa de todos los centros de acopio, refugios y hospitales registrados.

**Endpoint:**
```http
GET /centros_acopio?select=*
```

**Ejemplo de Petición (cURL):**
```bash
curl -X GET 'https://[TU_PROYECTO_SUPABASE].supabase.co/rest/v1/centros_acopio?select=*' \
-H 'apikey: TU_ANON_KEY' \
-H 'Authorization: Bearer TU_ANON_KEY'
```

### 2. Filtrar lugares por categoría (GET)

Puedes utilizar la sintaxis de filtros de PostgREST (Supabase) para hacer búsquedas específicas. Por ejemplo, obtener solo los "refugios":

**Endpoint:**
```http
GET /centros_acopio?tipo=eq.refugio&select=*
```

### 3. Reportar un nuevo Centro/Refugio (POST)

Permite registrar un nuevo lugar de ayuda en la base de datos de la comunidad.

**Endpoint:**
```http
POST /centros_acopio
```

**Encabezados adicionales requeridos:**
```http
Content-Type: application/json
Prefer: return=representation
```

**Cuerpo de la Petición (JSON):**
```json
{
  "nombre": "Iglesia San Judas",
  "tipo": "centro_acopio",
  "municipio": "Chacao",
  "direccion": "Av. Principal, Edificio B",
  "contacto_telefono": "+58 414 1234567",
  "estado_capacidad": "estable",
  "insumos_urgentes": ["Agua potable", "Cobijas"],
  "insumos_recibidos": [],
  "verificado": false,
  "latitud": 10.4806,
  "longitud": -66.9036,
  "ultima_actualizacion": "2023-10-25T12:00:00Z"
}
```

### 4. Actualizar el estado de un lugar (PATCH)

Ideal para bots o aplicaciones de terceros que deseen actualizar la capacidad o las necesidades urgentes de un centro en específico.

**Endpoint:**
```http
PATCH /centros_acopio?id=eq.TU_ID_AQUI
```

**Cuerpo de la Petición (JSON):**
```json
{
  "estado_capacidad": "critico",
  "insumos_urgentes": ["Suelo fisiológico", "Gasas"],
  "ultima_actualizacion": "2023-10-25T15:30:00Z"
}
```

---

## 🛠️ Modelo de Datos (Esquema)

Al consumir o enviar datos a la API, asegúrate de seguir estrictamente el siguiente modelo:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | UUID / String | Identificador único del registro (auto-generado al crear). |
| `nombre` | String | Nombre de la organización, junta vecinal o lugar físico. |
| `tipo` | String | Categoría del lugar: `centro_acopio`, `refugio` o `hospital`. |
| `municipio` | String | Ciudad, municipio o zona donde se ubica. |
| `direccion` | String | Dirección exacta o referencial. |
| `contacto_telefono` | String | Número de teléfono de contacto (Opcional). |
| `estado_capacidad` | String | Puede ser: `estable`, `critico` o `lleno`. |
| `insumos_urgentes` | Array[String] | Lista de artículos/insumos que necesitan urgentemente. |
| `insumos_recibidos` | Array[String] | Lista de artículos que ya han recibido. |
| `verificado` | Boolean | Indica si el lugar ha sido verificado por un moderador o admin. |
| `latitud` | Number | Coordenada Y para el mapa (Opcional). |
| `longitud` | Number | Coordenada X para el mapa (Opcional). |
| `ultima_actualizacion`| String (ISO) | Fecha y hora de la última vez que alguien actualizó el estado. |

---
*Hecho para empoderar a la comunidad mediante Open Data.*
