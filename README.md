# Sistema de Gestión de Stock y Ventas

Un sistema completo de gestión empresarial diseñado para pequeños negocios, desarrollado con Next.js 15 y Supabase. Permite gestionar productos, ventas, gastos y generar comprobantes de manera eficiente y profesional.

## 🚀 Características Principales

### 📊 Dashboard Inteligente
- **Resumen de ventas diarias** con gráficos interactivos
- **Monitoreo de pagos pendientes** y gestión de cobros
- **Control de gastos** con análisis por categorías
- **Alertas de stock bajo** para reposición oportuna
- **Métricas en tiempo real** del rendimiento del negocio

### 📦 Gestión de Productos
- **CRUD completo** de productos con validaciones
- **Control de inventario** con alertas automáticas
- **Categorización** y organización de productos
- **Cálculo automático** de márgenes de ganancia
- **Búsqueda y filtros** avanzados
- **Códigos SKU** únicos para cada producto

### 💰 Sistema de Ventas
- **Carrito de compras** intuitivo y responsive
- **Múltiples métodos de pago**: Efectivo, Tarjeta, A pagar, Contra entrega
- **Cálculo automático** de totales e impuestos
- **Actualización automática** del stock
- **Historial completo** de ventas realizadas
- **Estados de pago** (Pagado/Pendiente)

### 📋 Registro de Gastos
- **Categorización** de gastos empresariales
- **Filtros por fecha** y categoría
- **Análisis visual** con gráficos circulares
- **Estadísticas mensuales** y promedios
- **Edición y eliminación** de registros

### 🧾 Sistema de Comprobantes
- **Generación automática** de tickets de venta
- **Información completa** del negocio personalizable
- **Impresión optimizada** para tickets térmicos
- **Reimpresión** de comprobantes anteriores
- **Búsqueda y filtros** de comprobantes históricos
- **Descarga en PDF** y envío por email

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Fuentes**: Geist Sans, Manrope (Google Fonts)
- **Deployment**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (opcional, para deployment)

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio
\`\`\`bash
git clone <url-del-repositorio>
cd sistema-gestion
\`\`\`

### 2. Instalar Dependencias
\`\`\`bash
npm install
# o
yarn install
\`\`\`

### 3. Configurar Variables de Entorno
Crear un archivo `.env.local` con las siguientes variables:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Desarrollo (opcional)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### 4. Configurar Base de Datos
Ejecutar los scripts SQL en Supabase en el siguiente orden:

1. **Crear tablas**: `scripts/001_create_tables.sql`
2. **Datos de ejemplo**: `scripts/002_insert_sample_data.sql`
3. **Funciones**: `scripts/003_create_functions.sql`

### 5. Ejecutar en Desarrollo
\`\`\`bash
npm run dev
# o
yarn dev
\`\`\`

El sistema estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

\`\`\`
sistema-gestion/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── products/            # Endpoints de productos
│   │   ├── sales/               # Endpoints de ventas
│   │   ├── expenses/            # Endpoints de gastos
│   │   └── business-settings/   # Configuración del negocio
│   ├── productos/               # Página de gestión de productos
│   ├── ventas/                  # Página de ventas
│   ├── gastos/                  # Página de gastos
│   ├── comprobantes/            # Página de comprobantes
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Dashboard principal
│   └── globals.css              # Estilos globales
├── components/                   # Componentes React
│   ├── dashboard/               # Componentes del dashboard
│   ├── products/                # Componentes de productos
│   ├── sales/                   # Componentes de ventas
│   ├── expenses/                # Componentes de gastos
│   ├── receipts/                # Componentes de comprobantes
│   ├── ui/                      # Componentes UI base (shadcn)
│   └── navigation.tsx           # Navegación principal
├── lib/                         # Utilidades y configuración
│   ├── supabase/               # Clientes de Supabase
│   └── utils.ts                # Utilidades generales
├── scripts/                     # Scripts SQL
│   ├── 001_create_tables.sql   # Creación de tablas
│   ├── 002_insert_sample_data.sql # Datos de ejemplo
│   └── 003_create_functions.sql # Funciones de base de datos
└── types/                       # Definiciones de TypeScript
\`\`\`

## 🎯 Uso del Sistema

### Dashboard Principal
- **Acceso**: Página principal (`/`)
- **Funciones**: Visualización de métricas, gráficos de ventas, productos con stock bajo

### Gestión de Productos
- **Acceso**: `/productos`
- **Funciones**: Agregar, editar, eliminar productos; búsqueda y filtros

### Sistema de Ventas
- **Acceso**: `/ventas`
- **Funciones**: Crear nuevas ventas, ver historial, generar comprobantes

### Registro de Gastos
- **Acceso**: `/gastos`
- **Funciones**: Registrar gastos, categorizar, analizar con gráficos

### Comprobantes
- **Acceso**: `/comprobantes`
- **Funciones**: Ver todos los comprobantes, reimprimir, configu
