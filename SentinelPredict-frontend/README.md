# SentinelPredict Frontend

Frontend del prototipo **SentinelPredict**, desarrollado con **React** y **Vite**, orientado a la visualización, gestión y análisis de reportes narrativos de incidentes industriales.

## Descripción

SentinelPredict es una aplicación web que permite:

- Visualizar un dashboard analítico con métricas, gráficos, tendencias y recomendaciones.
- Consultar reportes registrados en el sistema.
- Filtrar reportes por búsqueda, estado, área, clasificación y rango de fechas.
- Crear, editar y eliminar reportes desde la interfaz.
- Importar reportes mediante archivos CSV.
- Exportar reportes filtrados a formato CSV.
- Navegar entre una landing pública, un login visual y una capa interna de aplicación.
- Visualizar perfiles y opciones de usuario dentro de una experiencia tipo producto.

Este frontend forma parte del proyecto de tesis SentinelPredict, orientado a la gestión predictiva de riesgos industriales mediante análisis automatizado de reportes narrativos.

---

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- Tailwind CSS
- Recharts

---

## Estructura general del proyecto

```bash
SentinelPredict-frontend/
├── public/
│   └── profile-avatar.jpg
├── src/
│   ├── components/
│   │   ├── BarChartCard.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── DashboardSkeleton.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ReportsTableSkeleton.jsx
│   │   ├── ReportDetailSkeleton.jsx
│   │   ├── SkeletonBlock.jsx
│   │   ├── StatCard.jsx
│   │   ├── Toast.jsx
│   │   ├── ToastContainer.jsx
│   │   ├── TrendChartCard.jsx
│   │   ├── UserAvatar.jsx
│   │   └── UserMenu.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── CreateReportPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── EditReportPage.jsx
│   │   ├── ImportReportsPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── ReportDetailPage.jsx
│   │   └── ReportsPage.jsx
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── csv.js
│   │   ├── formatters.js
│   │   └── importCsv.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```
## Requisitos previos

Antes de ejecutar el frontend, asegúrate de tener instalado:

* Node.js 18 o superior
* npm

## Instalación
1. Abrir el proyecto

Ubícate en la carpeta del frontend:
```bash
cd SentinelPredict-frontend
```
2. Instalar dependencias
```bash
npm install
```

## Variables de entorno

El frontend utiliza una variable de entorno para conectarse al backend.

Crea un archivo .env en la raíz del frontend con el siguiente contenido:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```
También puedes usar .env.example como referencia.

## Ejecución en desarrollo

Para iniciar el frontend en modo desarrollo:
```bash
npm run dev
```
Por defecto, la aplicación estará disponible en:
```bash
http://localhost:5173
```
## Flujo general de la aplicación

La aplicación está organizada en dos capas:

Capa pública
* / → landing principal del producto
* /login → pantalla de acceso visual

## Capa interna de la aplicación
* /app → dashboard principal
* /app/reports → listado de reportes
* /app/reports/create → creación manual de reportes
* /app/reports/import → importación de reportes desde CSV
* /app/reports/:id → detalle del reporte
* /app/reports/:id/edit → edición del reporte
* /app/profile → perfil de usuario

## Funcionalidades principales

Landing pública
* Hero section con propuesta de valor del producto.
* Sección de funcionalidades.
* Flujo de uso del sistema.
* Sección de contacto.
* Acceso al login.

Dashboard
* Métricas principales del sistema.
* Incidente más común.
* Área más afectada.
* Gráficos de incidentes por tipo y por área.
* Tendencias temporales.
* Entidades más frecuentes.
* Recomendaciones generadas.
* Filtro por rango de fechas.

Gestión de reportes
* Listado de reportes.
* Búsqueda por texto.
* Filtros por estado, área, clasificación y fechas.
* Paginación.
* Vista de detalle.
* Creación, edición y eliminación.

Importación y exportación
* Exportación de reportes filtrados a CSV.
* Importación masiva de reportes mediante archivos CSV.
* Previsualización antes de importar.

Experiencia de usuario
* Navbar sticky.
* Skeleton loaders.
* Toasts de éxito y error.
* Modal visual de confirmación.
* Menú de usuario con avatar.
* Perfil visual del usuario.

## Conexión con el backend

El frontend consume el backend de SentinelPredict a través de la URL configurada en:
```bash
VITE_API_BASE_URL
```
Asegúrate de tener el backend ejecutándose localmente en:
```bash
http://127.0.0.1:8000
```
o de actualizar la variable de entorno según el entorno donde lo despliegues.

## Scripts disponibles
Ejecutar en desarrollo
```bash
npm run dev
```
Generar build de producción
```bash
npm run build
```
Previsualizar build de producción
```bash
npm run preview
```

## Flujo recomendado de demostración

Para mostrar el funcionamiento del frontend, se recomienda el siguiente flujo:

1. Abrir landing pública
```bash
/
```
2. Ir al login
```bash
/login
```
3. Entrar a la aplicación
```bash
/app
```
4. Mostrar dashboard
* métricas,
* gráficos,
* tendencias,
* recomendaciones,
* filtro temporal.
5. Ir a reportes
```bash
/app/reports
```
6. Mostrar filtros, paginación y detalle
7. Crear un reporte manualmente
```bash
/app/reports/create
```
8. Importar reportes desde CSV
```bash
/app/reports/import
```
9. Exportar reportes a CSV
10. Mostrar perfil y menú de usuario
```bash
/app/profile
```

## Consideraciones del MVP

Este frontend corresponde a un Producto Mínimo Viable (MVP) del sistema SentinelPredict.

En esta etapa:

* la autenticación es visual y no está conectada a un sistema real de login;
* el perfil de usuario es representativo y no persiste cambios reales en backend;
* la capa pública y privada están separadas visualmente para mejorar la percepción de producto;
* el objetivo principal es demostrar la viabilidad funcional, visual y técnica del sistema.

## Autoría

Proyecto desarrollado como parte del trabajo de tesis SentinelPredict.