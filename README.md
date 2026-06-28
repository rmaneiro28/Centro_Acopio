# RedAyuda - Centro de Acopio y Refugios 🤝

RedAyuda es una aplicación web comunitaria diseñada para facilitar la búsqueda, el reporte y la actualización de lugares de ayuda, como Centros de Acopio, Refugios y Hospitales/Clínicas. Permite a los usuarios encontrar dónde donar o ayudar de manera eficiente, con información verificada por la propia comunidad.

## 🚀 Características Principales

*   **Categorización de Ayuda:** Filtra fácilmente entre Centros de Acopio 📦, Refugios 🏠 y Hospitales/Clínicas 🏥.
*   **Vistas Flexibles:** Alterna entre una vista de Lista detallada y un Mapa interactivo para encontrar ubicaciones cercanas.
*   **Búsqueda y Filtros Avanzados:** Busca por nombre, dirección, municipio, necesidades urgentes (insumos) y estado de capacidad.
*   **Reportes en Tiempo Real:** Cualquier usuario puede reportar nuevos lugares de ayuda a través de un formulario integrado.
*   **Actualización Comunitaria:** Permite actualizar el estado de un centro (capacidad, insumos urgentes, insumos recibidos) para mantener la información al día.
*   **Experiencia Offline Mejorada:** Utiliza almacenamiento local (`localStorage`) para mostrar datos cacheados de forma instantánea mientras se obtienen actualizaciones del servidor.

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** [React](https://react.dev/) (v19) + [Vite](https://vitejs.dev/)
*   **Backend / Base de Datos:** [Supabase](https://supabase.com/)
*   **Mapas e Inteligencia de Ubicación:** [Leaflet](https://leafletjs.com/) y [React Leaflet](https://react-leaflet.js.org/)
*   **Iconografía:** [Lucide React](https://lucide.dev/)
*   **Estilos:** CSS puro (diseño moderno, glassmorphism, responsive)

## ⚙️ Instalación y Configuración Local

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd Centro_Acopio
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Renombra el archivo `.env.example` (o crea un archivo `.env` en la raíz del proyecto) y añade tus credenciales de Supabase:
    ```env
    VITE_SUPABASE_URL=tu_supabase_url
    VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
    ```

4.  **Ejecutar en entorno de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📦 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Construye la aplicación para producción.
*   `npm run lint`: Ejecuta Oxlint para analizar el código en busca de errores.
*   `npm run preview`: Previsualiza la compilación de producción localmente.

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar esta plataforma:

1.  Haz un *Fork* del proyecto.
2.  Crea una rama para tu característica (`git checkout -b feature/NuevaCaracteristica`).
3.  Haz *Commit* de tus cambios (`git commit -m 'Añadir nueva característica'`).
4.  Haz *Push* a la rama (`git push origin feature/NuevaCaracteristica`).
5.  Abre un *Pull Request*.

---
*Desarrollado con el objetivo de conectar ayuda y necesidad de forma rápida y transparente.*
