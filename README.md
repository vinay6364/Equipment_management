# Equipment Management System

Monorepo for the Equipment Management web application: backend (Spring Boot), frontend (React + shadcn/ui + Tailwind), and database (PostgreSQL).

## Structure

- **`/backend`** – Spring Boot (Java 17) REST API
- **`/frontend`** – React (Vite) + TypeScript + shadcn/ui + Tailwind CSS
- **`/db`** – PostgreSQL schema and seed data

## Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **PostgreSQL** (e.g. 14+)
- **Maven 3.6+** (or use wrapper under `backend/`)

## Database setup

1. Create a database and user (if needed):

```bash
psql -U postgres -c "CREATE DATABASE equipment_db;"
```

2. Run the schema and seed script:

```bash
psql -U postgres -d equipment_db -f db/schema.sql
```

3. Default equipment types are inserted by `db/schema.sql`. You can change or add types later in the `equipment_type` table without changing application code.

## Backend

1. Configure DB connection in `backend/src/main/resources/application.yml` if needed:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/equipment_db
    username: postgres
    password: postgres
```

2. Run the backend:

```bash
cd backend
mvn spring-boot:run
```

(Or use `./mvnw spring-boot:run` if you add the Maven wrapper.)

API base: **http://localhost:8080**

Endpoints:

- `GET /api/equipment` – list equipment  
- `GET /api/equipment/{id}` – get one equipment  
- `POST /api/equipment` – create equipment  
- `PUT /api/equipment/{id}` – update equipment  
- `DELETE /api/equipment/{id}` – delete equipment  
- `GET /api/equipment-types` – list equipment types (for dropdown)  
- `POST /api/maintenance` – create maintenance log  
- `GET /api/equipment/{id}/maintenance` – list maintenance for an equipment  

## Frontend

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server (proxies `/api` to the backend):

```bash
npm run dev
```

App: **http://localhost:5173**

Build for production:

```bash
npm run build
```

## Additional libraries

### Backend

- **Spring Boot 3.2** – web, data-jpa, validation  
- **PostgreSQL** – JDBC driver  
- **Lombok** – optional; reduce boilerplate (getters/setters, etc.)  

No extra installation beyond `mvn` dependencies.

### Frontend

- **React 18**, **Vite 5**, **TypeScript**  
- **Tailwind CSS** – styling  
- **shadcn/ui** – UI components (built on Radix UI):  
  - `class-variance-authority`, `clsx`, `tailwind-merge` – styling utilities  
  - `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot`  
- **lucide-react** – icons  

All are installed with:

```bash
cd frontend && npm install
```

## Assumptions

- PostgreSQL is on `localhost:5432` with database `equipment_db` and user `postgres` unless overridden in `application.yml`.
- Backend runs on port **8080**, frontend dev server on **5173**; the Vite proxy sends `/api` to the backend.
- Equipment types are managed only via the database (no type CRUD UI in the app); the schema supports future type management without code changes.
- “Last Cleaned Date” is optional except when status is “Active”; the 30-day rule for “Active” is enforced only in the backend.

## Compliance

See **COMPLIANCE.md** for confirmation of UI rules (no inline styles, no raw form elements, shared Add/Edit form), dynamic equipment types, and backend business rules.
