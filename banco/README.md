# Despliegue de Microfrontends en Docker

Este proyecto forma parte de la **Clase 8** del curso, cuyo tema principal es la arquitectura de **micro frontends** utilizando múltiples frameworks. Todo contenido en contenedores Docker.

# Microfront-Multirepo

Repositorio para el proyecto de microfrontends con múltiples repositorios.

## Arquitectura

- **Dashboard** (Host)  - Aplicación React en el puerto 3000
- **Login**             - Microfrontend Angular en el puerto 3003
- **MoneyExchange**     - Microfrontend React en el puerto 3001
- **Payment**           - Microfrontend React en el puerto 3002
- **BFF-Exchange**      - Backend Node.js/Express en el puerto 4000
- **Shared Libraries**  - Utilidades, componentes y recursos comunes

## Librerías Compartidas

- `common-utils`            - Funciones utilitarias compartidas
- `common-components-react` - Librería de componentes en React
- `common-webcomponents`    - Librería de Web Components
- `common-resources`        - Recursos y estilos compartidos

## Requisitos previos
- Docker y Docker Compose instalados
- Al menos 4GB de RAM disponibles
- Puertos 3000-3003 y 4000 disponibles

## Levantar la aplicacion

1. **Clona el repositorio y entra al proyecto:**

   ```bash
   cd banco
   ```

2. **Construye e inicia todos los servicios:**

   ```bash
   docker-compose up --build
   ```

3. **Accede a las aplicaciones:**
   - **Dashboard Principal**:           http://localhost:3000
   - **Login Microfrontend**:           http://localhost:3003
   - **MoneyExchange Microfrontend**:   http://localhost:3001
   - **Payment Microfrontend**:         http://localhost:3002
   - **Backend API**:                   http://localhost:4000

## Credenciales de acceso
Para probar el inicio de sesión:

- **Email**: jose@gmail.com
- **Password**: 123456

## Configuración Docker

### Dependencias entre micro frontends

```
REPOSITORIOS        → DEPENDENCIAS
dashboard           → login, money-exchange, payment, bff-exchange
money-exchange      → shared-libs, bff-exchange
payment             → shared-libs
login               → shared-libs
bff-exchange        → (independiente)
shared-libs         → (servicio base)
```

### Proceso de Construcción

1. **Librerías Compartidas:**: Se construyen primero y se comparten vía volumen Docker
2. **Backend**: Servicio independiente en Node.js
3. **Microfrontends**: Se construyen con acceso a librerías compartidas
4. **Dashboard**: Aplicación Host que consume todos los microfrontends remotos

## Comandos para Desarrollo

### Iniciar todos los servicios

```bash
docker-compose up
```

### Construir e iniciar

```bash
docker-compose up --build
```

### Iniciar un servicio específico

```bash
docker-compose up dashboard
docker-compose up login
docker-compose up money-exchange
docker-compose up payment
docker-compose up bff-exchange
```

### Ver logs

```bash
docker-compose logs -f [service-name]
```

### Detener todo el proyecto

```bash
docker-compose down
```

### Eliminar volúmenes y reconstruir

```bash
docker-compose down -v
docker-compose up --build
```

## Arquitectura de Red

Todos los servicios corren en una red Docker personalizada(`microfrontend-network`) que permite:

- Descubrimiento de servicios por nombre de contenedor
- Comunicación en red aislada
- Capacidades de balanceo de carga

## Gestión de Volúmenes

- **shared-libs-volume**: Contiene las librerías compartidas ya construidas accesibles para todos los microfrontends
- Persiste entre reinicios de contenedores
- Se llena automáticamente desde el servicio shared-libs
