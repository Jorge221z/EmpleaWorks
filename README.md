# EmpleaWorks

**EmpleaWorks** es una plataforma web diseñada para facilitar la búsqueda y publicación de ofertas de empleo de forma local, conectando candidatos y empresas de manera sencilla y eficiente.

## Características

- **Publicación de ofertas de empleo:** Empresas pueden registrar, administrar y publicar vacantes laborales.
- **Búsqueda avanzada:** Los candidatos pueden filtrar ofertas por categoría, tipo de contrato, ubicación y fecha.
- **Perfiles personalizados:** Candidatos y empresas cuentan con perfiles y funcionalidades específicas según su rol.
- **Autenticación segura:** Registro y login tradicional y mediante Google OAuth2.
- **Gestión de CVs:** Descarga segura de currículums mediante enlaces temporales.
- **Política de cookies y privacidad:** Gestión y explicación clara del uso de cookies.

## Tecnologías principales

- **Backend:** Laravel (PHP)
- **Frontend:** React + TypeScript (con Inertia.js)
- **Autenticación:** Laravel Socialite (Google OAuth2)
- **Base de datos:** MySQL

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Jorge221z/EmpleaWorks.git
   ```
2. Instala las dependencias de backend y frontend:
   ```bash
   cd EmpleaWorks
   composer install
   npm install
   ```
3. Copia y configura el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
   Modifica las variables necesarias (DB, correo, servicios OAuth, etc).
4. Genera la clave de la aplicación:
   ```bash
   php artisan key:generate
   ```
5. Migra la base de datos:
   ```bash
   php artisan migrate
   ```
6. Compila los assets de frontend:
   ```bash
   npm run dev
   ```
7. Inicia el servidor:
   ```bash
   php artisan serve
   ```

## Estructura del proyecto

- `app/`: Lógica de backend (controladores, modelos, middleware)
- `resources/js/`: Código frontend en React/TypeScript
  - `pages/`: Páginas principales del frontend
  - `components/`: Componentes reutilizables (barra lateral, formularios, etc)
  - `utils/`: Utilidades y helpers (traducción, hooks)
  - `types/`: Definiciones de tipos TypeScript
- `routes/`: Definición de rutas web y API


## Licencia

Este proyecto está bajo la licencia MIT.

---

**EmpleaWorks** — Tu puente al empleo local.
