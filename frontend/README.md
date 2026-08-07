# InnovaTube - Frontend

Plataforma web para la gestión y exploración de contenido de video, estructurada bajo principios de Arquitectura Limpia.

## Credenciales de Evaluación

Para revisar el módulo de autenticación y acceder al panel de control protegido, se ha habilitado el siguiente usuario de prueba en el entorno de producción:

- Correo Electrónico: admin@innovatube.com
- Contraseña: Password123

## Arquitectura y Tecnologías

- Framework: Angular 18 (Standalone Components).
- Estilos: Tailwind CSS.
- Seguridad: Implementación de Functional Guards (CanActivateFn) para la protección de rutas privadas e intercepción HTTP para la inyección automática de tokens JWT.
- Gestión del Estado: Formularios reactivos (Reactive Forms) para la captura, validación estricta y aislamiento de la lógica de datos.
