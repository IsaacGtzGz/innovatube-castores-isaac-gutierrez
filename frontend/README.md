# InnovaTube - Frontend

Plataforma web para la gestión y exploración de contenido de video, desarrollada bajo los principios de Arquitectura Limpia y diseño responsivo.

**Despliegue en vivo:** [https://innovatube-frontend-seven.vercel.app/login](https://innovatube-frontend-seven.vercel.app/login)

## Credenciales de Evaluación

Para facilitar la revisión del módulo de autenticación y acceder al panel de control protegido, se ha habilitado el siguiente usuario de prueba en el entorno de producción:

- Correo Electrónico: admin@innovatube.com
- Contraseña: Password123

## Arquitectura y Tecnologías

- Framework: Angular 18 (Arquitectura basada en Standalone Components).
- Estilos: Tailwind CSS para un maquetado ágil y responsivo.
- Seguridad:
  - Implementación de Functional Guards (CanActivateFn) para el blindaje de rutas privadas.
  - Interceptores HTTP para la inyección automática y segura de tokens JWT hacia el backend.
  - Integración de Google reCAPTCHA en el flujo de registro.
- Gestión del Estado y Formularios: Uso de Reactive Forms para la captura de datos, validación estricta y aislamiento total de la lógica de negocio.
- Despliegue (CI/CD): 
  - Frontend alojado en Vercel.
  - Backend (API Node.js + PostgreSQL) alojado en Render.
