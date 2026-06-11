# 🚀 Sistema Inmobiliario Full Stack

Este proyecto implementa una arquitectura Full Stack para la gestión de activos inmobiliarios, integrando un backend basado en Node.js y PostgreSQL con un frontend reactivo desarrollado en React.

El objetivo es proporcionar una plataforma escalable para la administración, consulta y filtrado de propiedades, aplicando buenas prácticas de desarrollo, organización modular y diseño de APIs REST.

---

# 🏗️ Arquitectura del Repositorio

La estructura del proyecto está organizada para separar claramente la lógica de negocio, la persistencia de datos y la capa de presentación.

```plaintext
projeto-inmobiliario/
├── api-inmob/                 # Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Configuración del pool de conexiones PostgreSQL
│   │   │   └── seederMasivo.js    # Generador de datos para pruebas
│   │   ├── controllers/
│   │   │   └── propiedades.js     # Lógica de negocio y filtros
│   │   ├── routes/
│   │   │   └── propiedades.js     # Endpoints REST
│   │   └── app.js                 # Servidor Express y configuración global
│   ├── .env                       # Variables de entorno
│   └── package.json
│
├── src-client/                # Frontend
│   ├── services/
│   │   └── api.js                 # Cliente Axios para comunicación con la API
│   └── ClientApp.jsx              # Componente principal de la interfaz
│
└── README.md
```

---

# ⚙️ Flujo de Datos

El sistema implementa un flujo de comunicación estructurado entre el frontend y el backend para garantizar una gestión eficiente y segura de la información.

## 1. Solicitud del Cliente

El componente `ClientApp.jsx` procesa la interacción del usuario y construye los parámetros de consulta:

- Texto de búsqueda
- Tipo de operación
- Rango de precios
- Paginación

## 2. Comunicación con la API

El servicio `api.js` utiliza **Axios** para enviar solicitudes HTTP al backend, gestionando de forma centralizada la configuración y serialización de parámetros.

## 3. Procesamiento en el Backend

El controlador `propiedades.js`:

- Valida los parámetros recibidos.
- Aplica filtros dinámicos utilizando `ILIKE`.
- Gestiona la paginación mediante `LIMIT` y `OFFSET`.
- Ejecuta consultas parametrizadas sobre PostgreSQL.
- Gestiona errores mediante bloques `try/catch`, devolviendo respuestas estructuradas.

## 4. Respuesta

La API devuelve un formato estándar para facilitar el consumo desde cualquier cliente:

```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150
  },
  "data": [
    {
      "id": 1,
      "titulo": "Apartamento en Barcelona",
      "precio": 350000
    }
  ]
}
```

## 5. Renderizado en el Frontend

El frontend valida la estructura de los datos mediante `Array.isArray()` antes de realizar el renderizado dinámico con `.map()`, mejorando la robustez de la interfaz.

---

# 🛡️ Seguridad y Rendimiento

## Seguridad

- Uso de consultas SQL parametrizadas (`$1`, `$2`, etc.) para prevenir ataques de SQL Injection.
- Gestión de credenciales mediante variables de entorno (`.env`).
- Validación de datos de entrada en la capa de negocio.

## Rendimiento

- Pool de conexiones PostgreSQL mediante `pg`.
- Consultas optimizadas con paginación (`LIMIT/OFFSET`).
- Arquitectura modular para facilitar el mantenimiento y la escalabilidad.

## Integridad de Datos

- Implementación de estrategia **Soft Delete** mediante el campo `deleted_at`, preservando el histórico de registros sin afectar las relaciones de la base de datos.

---

# 🛠️ Stack Tecnológico

## Backend
- Node.js
- Express.js
- PostgreSQL
- pg (Connection Pool)

## Frontend
- React
- Axios

## Herramientas
- JavaScript (ES6+)
- REST API
- JSON
- Variables de entorno (.env)

---

# 🚀 Guía de Inicio Rápido

## 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd projeto-inmobiliario
```

## 2. Configurar y ejecutar el Backend

```bash
cd api-inmob
npm install
node app.js
```

El servidor estará disponible por defecto en:

```text
http://localhost:3000
```

## 3. Configurar y ejecutar el Frontend

En una nueva terminal:

```bash
cd src-client
npm install
npm start
```

La aplicación React se iniciará normalmente en:

```text
http://localhost:5173
```

*(La URL puede variar según la configuración del entorno de desarrollo.)*

---

# 📚 Objetivos de Aprendizaje

Este laboratorio fue desarrollado para poner en práctica conceptos fundamentales de desarrollo Full Stack:

- Diseño de APIs REST.
- Integración entre React y Node.js.
- Persistencia de datos con PostgreSQL.
- Consultas SQL parametrizadas y seguridad básica.
- Gestión de filtros y paginación.
- Arquitecturas modulares y buenas prácticas de organización del código.

---

# 📄 Licencia

Proyecto desarrollado con fines educativos y de aprendizaje práctico en desarrollo Full Stack y arquitectura de aplicaciones web.