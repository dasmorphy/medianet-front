Actúa como un Ingeniero de Desarrollo Backend Senior experto en Java, Spring Boot 3+ y Arquitectura de Microservicios. Tu objetivo es generar el código fuente completo, limpio y listo para producción de la capa backend para una prueba técnica bancaria, siguiendo estrictamente las especificaciones indicadas.

### 1. Requerimientos de Arquitectura y Tecnologías
- Stack: Java 17+, Spring Boot 3+, Spring Data JPA, y Base de Datos Relacional (PostgreSQL o MySQL).
- Patrones obligatorios: Repository, Capas de Servicio, DTOs y Manejo Centralizado de Excepciones.
- Separación en 2 Microservicios independientes:
  1. Microservicio de Clientes: Gestiona el dominio de (Cliente, Persona).
  2. Microservicio de Cuentas: Gestiona el dominio de (Cuenta, Movimientos).
- Comunicación: Configura la comunicación entre ambos microservicios (usando WebClient o Spring Cloud OpenFeign) para validar la existencia/datos del Cliente desde el microservicio de Cuentas.

### 2. Modelo de Dominio (Entidades JPA)
Diseña las entidades con sus respectivas claves primarias y restricciones únicas:
- Persona (Clase base o @MappedSuperclass): nombre, género, edad, identificación (UK), dirección, teléfono.
- Cliente (Hereda de Persona): clienteId (PK/UK), contraseña, estado (boolean).
- Cuenta: número de cuenta (PK/UK), tipo de cuenta (Ahorro/Corriente), saldo inicial, estado (boolean), clienteId (relación/referencia lógica al microservicio de clientes).
- Movimiento: id (PK), fecha (LocalDateTime), tipo de movimiento (Débito/Crédito), valor (BigDecimal, positivo para depósito, negativo para retiro), saldo (saldo resultante después del movimiento). Relación ManyToOne con Cuenta.

### 3. Funcionalidades de la API (Endpoints REST)
Debes implementar los controladores exponiendo todos los verbos HTTP (GET, POST, PUT, PATCH, DELETE) para los recursos:
- `/clientes`
- `/cuentas`
- `/movimientos` (Manejar el registro histórico).
- `F3 - Validación de Saldo`: Al crear un movimiento (retiro/negativo), si el valor excede el saldo disponible, se debe lanzar una excepción de negocio personalizada ("Saldo no disponible").
- Manejo Centralizado de Excepciones: Implementar un `@RestControllerAdvice` que capture todas las excepciones (incluyendo validaciones de campos y "Saldo no disponible") y retorne un JSON estructurado con el mensaje de error y el código HTTP correcto.
- `F4 - Reportes (Estado de Cuenta)`: Endpoint `/reportes?fecha={rango}&cliente={id}` que retorne un JSON con la lista de cuentas asociadas al cliente y el detalle de sus movimientos en ese rango de fechas. Estructura esperada por registro: `{ "Fecha": "...", "Cliente": "...", "NumeroCuenta": "...", "Tipo": "...", "SaldoInicial": ..., "Estado": ..., "Movimiento": ..., "SaldoDisponible": ... }`.

### 4. Pruebas y Calidad (JUnit 5 + Mockito)
- Implementar al menos 1 prueba unitaria sobre la lógica de la entidad/servicio Cliente.
- Implementar al menos 2 pruebas unitarias de endpoints/controladores en total.
- Implementar pruebas de integración que validen el flujo completo de persistencia y validación de saldo (F6).

### 5. Dockerización
- Genera un Dockerfile multi-stage optimizado para cada uno de los dos microservicios.
- Genera un archivo `docker-compose.yml` en la raíz que orqueste ambos microservicios y la base de datos relacional elegida, configurando correctamente las variables de entorno para su comunicación interna.

Genera todo el código estructurado por carpetas/paquetes claros (config, controller, service, repository, entity, dto, exception). Asegúrate de que compile y respete los nombres y tipos lógicos.








Actúa como un Ingeniero de Desarrollo Frontend Senior experto en Angular 13+ y diseño de interfaces bancarias. Tu objetivo es construir la aplicación web completa para operar y consultar la API de microservicios bancarios descrita anteriormente.

### 1. Tecnologías y Estilos Obligatorios
- Framework: Angular 13.0
- Componentes UI: Angular Material 13.0 (tablas, formularios, diálogos, botones, etc.)
- Estilos globales y Grid: Bootstrap 5.2.0 para garantizar un diseño limpio y responsive.

### 2. Estructura y Componentes Requeridos
Crea una SPA (Single Page Application) modularizada con las siguientes secciones/componentes:
1. Dashboard / Navegación: Barra de navegación superior o lateral para conmutar entre las vistas.
2. Gestión de Clientes (CRUD):
   - Tabla que liste los clientes consumiendo `/clientes`.
   - Formulario reactivo en un diálogo o vista para Crear, Editar y Eliminar clientes (con validaciones de campos como identificación, teléfono, etc.).
3. Gestión de Cuentas y Movimientos (CRUD):
   - Vista o tabla para administrar las cuentas bancarias asociadas a los clientes.
   - Formulario para registrar un nuevo movimiento (Depósito o Retiro) seleccionando la cuenta. Debe capturar de forma amigable y mostrar un mensaje de alerta (ej. SnackBar de Angular Material) si el backend responde con un error de "Saldo no disponible".
4. Sección de Reportes (Estado de Cuenta):
   - Formulario de consulta con dos filtros obligatorios: Rango de Fechas (Datepicker) y Selección de Cliente.
   - Al buscar, debe consumir el endpoint `/reportes?fecha={rango}&cliente={id}` y renderizar el Estado de Cuenta detallado en una tabla limpia de Angular Material, mostrando los saldos iniciales, movimientos realizados y el saldo disponible final tal cual lo exige el caso de uso de la prueba.

### 3. Integración con el Backend (Servicios)
- Implementar los servicios de Angular (`HttpClient`) organizados para consumir los endpoints REST de los microservicios.
- Configurar un archivo de entorno (`environment.ts`) para parametrizar fácilmente las URLs base de las APIs.
- Manejar adecuadamente los Ciclos de Vida (`OnInit`) y la desuscripción de Observables.

### 4. Dockerización
- Genera un Dockerfile para el proyecto Frontend que compile la aplicación en modo producción (`ng build --prod`) y sirva los archivos estáticos utilizando un servidor Nginx optimizado, incluyendo la configuración de reversión de rutas para SPA (`try_files $uri $uri/ /index.html`).
- Agrega el servicio de este frontend al archivo `docker-compose.yml` global para que toda la solución (Backend + Frontend + DB) se levante con un único comando.

Genera la estructura de archivos del proyecto (`src/app/components`, `src/app/services`, `src/app/models`), el código TypeScript, las plantillas HTML con clases de Bootstrap/Material y las hojas de estilos necesarias.