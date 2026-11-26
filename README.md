# MiniBlog API — Proyecto Integrador M2

API REST de autores y publicaciones desarrollada con Node.js, Express y PostgreSQL.

Autor: Luis Rafael Veracierta Navarro.

## Tecnologías

- Node.js y Express 5.
- PostgreSQL y consultas SQL directas con pg.
- dotenv para variables de entorno.
- Supertest y el ejecutor de pruebas de Node.js.
- OpenAPI 3.0.3 y Swagger UI.

## Requisitos

- Node.js 24 recomendado.
- npm.
- PostgreSQL en ejecución para utilizar la API.

## Instalación

```bash
git clone https://github.com/Mikey0800/ProyectoM2-LuisVeracierta.git
cd ProyectoM2-LuisVeracierta
npm ci
```

Copia `.env.example` como `.env`:

```bash
cp .env.example .env
```

Completa las variables con tu configuración local:

```dotenv
PORT=3000
PGHOST=localhost
PGPORT=5432
PGDATABASE=devspark
PGUSER=postgres
PGPASSWORD=TU_CONTRASENA_LOCAL
```

No subas `.env` a GitHub.

## Preparar la base de datos

1. Abre pgAdmin y conéctate a PostgreSQL.
2. Crea una base de datos llamada `devspark`, si todavía no existe.
3. Abre Query Tool conectado a esa base.
4. Abre y ejecuta `desarrollo/setup.sql`.

El script contiene la creación de tablas, índices y datos iniciales.
En una base nueva carga tres autores y cinco publicaciones.

La relación es uno a muchos: un autor puede tener varias publicaciones.
`posts.author_id` referencia a `authors.id`.

La relación utiliza `ON DELETE CASCADE`: al eliminar un autor,
también se eliminan sus publicaciones.

## Ejecutar la API

```bash
npm start
```

Para desarrollo con reinicio automático:

```bash
npm run dev
```

Dirección local: http://localhost:3000

Comprobación del servidor: http://localhost:3000/health

## Endpoints

| Método | Ruta | Función |
|---|---|---|
| GET | /authors | Listar autores |
| GET | /authors/:id | Obtener un autor |
| POST | /authors | Crear un autor |
| PUT | /authors/:id | Actualizar un autor |
| DELETE | /authors/:id | Eliminar un autor |
| GET | /posts | Listar publicaciones |
| GET | /posts/:id | Obtener una publicación |
| GET | /posts/author/:authorId | Publicaciones con detalle de su autor |
| POST | /posts | Crear una publicación |
| PUT | /posts/:id | Actualizar una publicación |
| DELETE | /posts/:id | Eliminar una publicación |

### Crear o actualizar un autor

```json
{
  "name": "Luis Veracierta",
  "email": "luis@example.com",
  "bio": "Estudiante de desarrollo web"
}
```

### Crear o actualizar una publicación

Utiliza un `author_id` que exista:

```json
{
  "title": "Mi primera publicación",
  "content": "Aprendiendo Express y PostgreSQL",
  "author_id": 1,
  "published": false
}
```

PUT requiere los mismos campos obligatorios que POST.
Si se omite `bio`, se guarda null.
Si se omite `published`, se guarda false.

## Validaciones y respuestas

- Los IDs deben ser enteros positivos.
- Los autores requieren name y email no vacíos.
- El email de un autor debe ser único.
- Las publicaciones requieren title, content y author_id.
- El autor de una publicación debe existir.
- published debe ser un booleano cuando se proporciona.
- title admite hasta 200 caracteres.

Códigos utilizados:

- 200: consulta o actualización exitosa.
- 201: recurso creado.
- 204: eliminación exitosa sin cuerpo.
- 400: datos inválidos, email duplicado o autor referenciado inexistente.
- 404: recurso o ruta inexistente.
- 500: error interno.

Los errores controlados de las rutas se responden como:

```json
{
  "error": "Descripción del error"
}
```

## Pruebas automatizadas

```bash
npm test
```

Las ocho pruebas cubren:

- Consulta parametrizada de un autor.
- Creación de autores.
- Consulta de un autor por ID.
- Creación de publicaciones.
- Eliminación de una publicación inexistente.
- Rechazo de nombres vacíos.
- Rechazo de IDs inválidos.
- Manejo de emails duplicados.

Se utiliza Supertest para probar las rutas y mocks de `pool.query`
para sustituir la conexión externa a PostgreSQL durante estas pruebas.
No insertan ni eliminan registros reales.

El CRUD también se comprobó manualmente contra PostgreSQL mediante curl.

## Documentación OpenAPI

Archivo: `documentacion/openapi.json`.

Con el servidor ejecutándose:

- Swagger UI: http://localhost:3000/docs/
- Especificación JSON: http://localhost:3000/openapi.json

Swagger UI permite consultar los cuerpos, parámetros y respuestas
de los endpoints, y enviar solicitudes de prueba.

## Organización

- `index.js`: inicia el servidor.
- `desarrollo/app.js`: configura Express y conecta los routers.
- `desarrollo/routes/`: rutas y respuestas HTTP.
- `desarrollo/services/`: consultas SQL parametrizadas.
- `desarrollo/db/`: configuración del pool de PostgreSQL.
- `desarrollo/middlewares/`: validaciones compartidas.
- `desarrollo/test/`: pruebas automatizadas.
- `desarrollo/setup.sql`: creación de tablas y seed.
- `documentacion/`: documentación de la API.

## Deployment en Railway

Estado: desplegado en Railway. Consultas de lectura verificadas el 26 de noviembre de 2026.

API pública: https://proyecto-m2-production.up.railway.app/
Swagger UI: https://proyecto-m2-production.up.railway.app/docs/
OpenAPI: https://proyecto-m2-production.up.railway.app/openapi.json

Pre-deploy: npm run db:setup
Arranque: npm start

Procedimiento de despliegue:

1. Subir la versión actual del proyecto a GitHub.
2. Crear un proyecto en Railway con PostgreSQL y un servicio para la API.
3. Conectar el repositorio y configurar las variables de entorno.
4. Inicializar las tablas y el seed en PostgreSQL remoto.
5. Iniciar la API con `npm start`.
6. Generar un dominio público y verificar sus endpoints.

La aplicación utiliza PORT y escucha en 0.0.0.0.

Variables de conexión:
PGHOST, PGPORT, PGDATABASE, PGUSER y PGPASSWORD.

URL pública de la API: pendiente.

URL interna de la API, sin credenciales: pendiente.

documentacion/railway.png

## Registro de uso de IA

Desarrollé este proyecto utilizando ChatGPT como tutor y herramienta de generación de código, explicación y revisión. La IA corrigió gran parte de la implementación final me ayudó a incorporar y ajustar el código, plantear dudas, tomar decisiones de organización y comprobar los resultados.

Las consultas incluyeron:

- Explicación de Express, validaciones y códigos HTTP.
- Corrección de intentos de rutas y consultas SQL.
- Configuración de la conexión a PostgreSQL.
- Servicios y middlewares.
- Preparación de pruebas automatizadas y documentación OpenAPI.

La asistencia aportó explicaciones, ejemplos y bloques de código.
La implementación se fue incorporando y comprobando mediante
consultas en pgAdmin, solicitudes curl y pruebas automatizadas.

### Alcance de la asistencia

ChatGPT propuso y generó código para:

- Configurar la conexión entre Node.js y PostgreSQL.
- Implementar los servicios SQL y los endpoints CRUD de autores y publicaciones.
- Agregar validaciones y manejo de errores HTTP.
- Preparar las ocho pruebas automatizadas con Node.js y Supertest.
- Elaborar la especificación OpenAPI, integrar Swagger UI.

### Ejemplos de prompts utilizados

Los siguientes fragmentos corresponden a solicitudes realizadas durante la conversación:

| Prompt | Influencia en el desarrollo |
|---|---|
| “puedes leer mi codigo a medida que lo voy cambiando?” | Permitió revisar los archivos guardados y detectar errores de sintaxis, importaciones y ubicación del código. |
| “Necesito que desgloses la explicación y me guíes línea por línea.” | Dio lugar a explicaciones sobre parámetros de URL, desestructuración, validaciones, return y respuestas HTTP. |
| “mi index.js ya se hizo demasiado largo, puedes revisarlo por favor, quiero separarlo en distintas carpetas” | Motivó la separación de las rutas y la configuración de Express en archivos independientes. |

### Participación y comprobaciones realizadas

Incorporé los bloques de código al proyecto, configuré el entorno local y ejecuté las comprobaciones. Compartí los resultados y solicité explicaciones y correcciones durante el proceso.

Las comprobaciones incluyeron:

- Creación y consulta de tablas en pgAdmin.
- Solicitudes manuales con curl para crear, consultar, actualizar y eliminar recursos.
- Verificación de respuestas de éxito y errores de validación.
- Ejecución de ocho pruebas automatizadas, todas aprobadas.
- Consulta de la documentación mediante Swagger UI.

