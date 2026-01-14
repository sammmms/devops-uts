# 📋 LAPORAN PENGEMBANGAN APLIKASI KUBERNETES & CI/CD

## DevOps Todo Application with Kubernetes Orchestration

---

## 1. Deskripsi Singkat Aplikasi dan Tata Cara Penggunaannya

### 1.1 Deskripsi Aplikasi

**Todo App – Kubernetes & CI/CD** adalah sebuah aplikasi manajemen tugas (task management) yang dirancang dengan arsitektur microservices modern, menggunakan containerization dan orchestration. Aplikasi ini dibangun sebagai studi kasus untuk penerapan DevOps best practices dalam pengembangan aplikasi cloud-native.

**Fitur Utama:**

- 🔐 User authentication dengan JWT (login, register)
- ✅ Manajemen daftar tugas (Todo) dengan deadline
- 📂 Pengorganisasian tugas berdasarkan kategori
- 📊 Dashboard ringkasan status tugas
- 🔄 Sinkronisasi real-time antara frontend dan backend
- 📱 Responsive UI dengan dark mode support
- ♻️ Automatic scaling berdasarkan CPU utilization
- 📈 24/7 availability dengan high availability setup
- 🚀 Automated CI/CD deployment pipeline

**Tech Stack:**

- **Frontend:** React 19 + Vite + TanStack Router + Tailwind CSS
- **Backend:** Python FastAPI + Pydantic
- **Containerization:** Podman / Docker
- **Orchestration:** Kubernetes (k3s)
- **CI/CD:** GitHub Actions
- **Storage:** JSON-based local storage (dapat diperluas ke PostgreSQL)
- **Infrastructure:** DigitalOcean VPS

### 1.2 Tata Cara Penggunaan

#### **A. Penggunaan Frontend**

1. **Akses Aplikasi:**

   - URL: `http://146.190.82.217:30003`
   - Atau via domain: `https://todo.wsnsam.my.id` (dengan SSL/TLS)

2. **Membuat Todo Baru:**

   - Klik tombol "Create Todo"
   - Isi nama tugas, deadline (opsional), dan pilih kategori
   - Klik "Save"

3. **Mengorganisir Kategori:**

   - Navigasi ke halaman "Categories"
   - Klik "Create Category" untuk membuat kategori baru
   - Gunakan kategori saat membuat atau mengedit todo

4. **Melihat Dashboard:**

   - Halaman utama menampilkan ringkasan statistik:
     - Total todos
     - Todos yang belum selesai
     - Todos yang sudah selesai
     - Todos yang sudah expired/overdue

5. **Filter dan Pencarian:**

   - Filter by Status: Completed, Pending, Overdue
   - Filter by Category
   - Lihat semua atau todo spesifik

6. **Autentikasi:**
   - Register akun baru di halaman `/register`
   - Login dengan email/username dan password di `/login`
   - Logout via tombol di header
   - Semua halaman selain login/register membutuhkan autentikasi

#### **B. Penggunaan Backend API**

**Base URL:** `http://146.190.82.217:30005/api/v1`

**Health Check:**

```bash
GET /api/v1/health
```

**Todo Endpoints:**

```bash
# Create Todo
POST /api/v1/todo
Body: {
  "name": "Buy groceries",
  "deadline": "2026-01-20",
  "description": "Weekly grocery shopping",
  "category_id": 1
}

# Get All Todos (dengan filter)
GET /api/v1/todo?category_id=1&completed=false&overdue=false

# Get Single Todo
GET /api/v1/todo/{todo_id}

# Update Todo
PUT /api/v1/todo/{todo_id}

# Delete Todo
DELETE /api/v1/todo/{todo_id}
```

**Category Endpoints:**

```bash
# Create Category
POST /api/v1/categories
Body: { "name": "Work" }

# Get All Categories
GET /api/v1/categories

# Get Single Category
GET /api/v1/categories/{category_id}

# Update Category
PUT /api/v1/categories/{category_id}

# Delete Category
DELETE /api/v1/categories/{category_id}
```

**Interactive API Documentation:**

- Swagger UI: `http://146.190.82.217:30005/docs`
- ReDoc: `http://146.190.82.217:30005/redoc`

**Authentication Endpoints:**

```bash
# Register User
POST /api/v1/auth/register
Body: {
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}

# Login
POST /api/v1/auth/login
Body: {
  "email": "user@example.com",  # atau username
  "password": "securepassword123"
}

# Get Current User (requires Bearer token)
GET /api/v1/auth/me
Headers: Authorization: Bearer <token>

# Refresh Token
POST /api/v1/auth/refresh
Headers: Authorization: Bearer <token>
```

---

## 2. Informasi Detail Aplikasi Termasuk Sumber Referensi

### 2.1 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                       │
└────────────────────────┬────────────────────────────────┘
                         │
           ┌─────────────┴──────────────┐
           │                            │
    ┌──────▼──────┐           ┌────────▼────────┐
    │   Frontend  │           │    Ingress      │
    │  Deployment │           │   (Traefik)     │
    │  (Nginx)    │           │   with SSL/TLS  │
    │  Replicas:1 │           └────────┬────────┘
    └────────┬────┘                    │
             │                    ┌────┴─────┐
             │                    │           │
         Port 80            ┌─────▼──┐  ┌───▼─────┐
             │              │ /api/* │  │ /*      │
             │              └────────┘  └─────────┘
             │                  │           │
    ┌────────▼──────────────────▼──────────┴───────┐
    │        Kubernetes Service Layer               │
    │   ├── Backend Service (NodePort:30005)       │
    │   ├── Frontend Service (NodePort:30003)      │
    │   └── Postgres Service (ClusterIP:5432)      │
    └────────┬──────────────────────────────────────┘
             │
    ┌────────▼──────────────────────────────────────┐
    │       Kubernetes Cluster (k3s)                │
    │  ┌─────────────────────────────────────────┐  │
    │  │    Backend Deployment                    │  │
    │  │  ├── Pod 1 (FastAPI + SQLAlchemy)       │  │
    │  │  └── Pod 2 (FastAPI + SQLAlchemy)       │  │
    │  │  (Min: 2, Max: 3 via HPA)               │  │
    │  └──────────────────┬──────────────────────┘  │
    │                     │ DB Connection           │
    │  ┌──────────────────▼──────────────────────┐  │
    │  │    PostgreSQL Deployment                 │  │
    │  │  └── Pod 1 (postgres:16-alpine)         │  │
    │  │  (Replicas: 1)                          │  │
    │  └──────────────────┬──────────────────────┘  │
    │                     │                         │
    │  ┌──────────────────▼──────────────────────┐  │
    │  │  PersistentVolumeClaim (postgres-pvc)    │  │
    │  │  /var/lib/postgresql/data               │  │
    │  └─────────────────────────────────────────┘  │
    │                                               │
    │  ┌─────────────────────────────────────────┐  │
    │  │    Frontend Deployment                   │  │
    │  │  └── Pod 1 (Nginx)                      │  │
    │  │  (Static: 1 replica)                    │  │
    │  └─────────────────────────────────────────┘  │
    │  ┌─────────────────────────────────────────┐  │
    │  │  Metrics Server (HPA Monitor)            │  │
    │  └─────────────────────────────────────────┘  │
    └───────────────────────────────────────────────┘
```

### 2.2 Backend Architecture (FastAPI + Clean Architecture)

**Struktur Proyek Backend:**

```
backend/
├── Containerfile              # Docker image definition
├── requirements.txt           # Python dependencies
├── .env                       # Environment variables
├── tests/                     # Test suite
│   └── test_api.py            # API endpoint tests
└── app/
    ├── main.py               # FastAPI app initialization
    ├── dependencies.py       # Dependency injection (repository factories)
    ├── api/
    │   ├── routes_auth.py           # Auth endpoints (register, login, me, refresh)
    │   ├── routes_todo.py           # Todo CRUD endpoints
    │   ├── routes_category.py       # Category CRUD endpoints
    │   ├── routes_category_todo.py  # Category-Todo relations
    │   └── routes_dashboard.py      # Dashboard statistics
    ├── models/
    │   ├── orm/                     # SQLAlchemy ORM models
    │   │   ├── __init__.py          # Model exports
    │   │   ├── todo.py              # Todo table model
    │   │   ├── category.py          # Category table model
    │   │   └── user.py              # User table model
    │   └── pydantic/                # Pydantic schemas
    │       ├── todo_model.py        # Todo request/response schema
    │       ├── category_model.py    # Category schema
    │       └── user_model.py        # User auth schema
    ├── interfaces/
    │   └── repositories/            # Abstract repository interfaces
    │       ├── todo_repository.py   # ITodoRepository interface
    │       ├── category_repository.py # ICategoryRepository interface
    │       └── user_repository.py   # IUserRepository interface
    ├── repositories/
    │   ├── local/                   # JSON-based implementations
    │   │   ├── todo_repository.py
    │   │   ├── category_repository.py
    │   │   └── user_repository.py
    │   └── remote/                  # PostgreSQL implementations
    │       ├── todo_repository.py
    │       ├── category_repository.py
    │       └── user_repository.py
    ├── usecases/                    # Business logic layer
    │   ├── auth_usecase.py          # Authentication logic (JWT)
    │   ├── todo_usecase.py          # Todo operations
    │   └── category_usecase.py      # Category operations
    ├── datasources/
    │   ├── session.py               # SQLAlchemy database session
    │   ├── local_datasource.py      # Local JSON file access
    │   └── remote_datasource.py     # Remote DB connection
    └── utils/
        └── response_util.py         # Response formatting helpers
```

**Clean Architecture Layers:**

1. **API Layer (routes)** - HTTP endpoints and request handling
2. **UseCase Layer** - Business logic and orchestration
3. **Repository Layer** - Data access abstraction
4. **DataSource Layer** - Actual data storage (PostgreSQL or JSON)

**Key Components:**

1. **main.py** - FastAPI Application Setup

   - Creates FastAPI app with CORS middleware
   - Database initialization on startup (auto-creates tables)
   - Environment-based repository mode (`REPOSITORY_MODE=local|remote`)
   - Exposes Swagger UI at `/docs` and ReDoc at `/redoc`

2. **ORM Models (SQLAlchemy):**

   ```python
   # Todo (ORM)
   - id: Integer (Primary Key, auto-increment)
   - name: String (required)
   - deadline: Date (optional)
   - description: Text (optional)
   - completed: Boolean (default: False)
   - category_id: Integer (Foreign Key to Category)
   - user_id: Integer (Foreign Key to User)

   # Category (ORM)
   - id: Integer (Primary Key)
   - name: String (required)
   - user_id: Integer (Foreign Key to User)

   # User (ORM)
   - id: Integer (Primary Key)
   - email: String (unique)
   - username: String (unique)
   - hashed_password: String
   ```

3. **Repository Pattern:**

   - Interface-based abstraction (`ITodoRepository`, `ICategoryRepository`, `IUserRepository`)
   - Dual implementations: Local (JSON files) and Remote (PostgreSQL)
   - `REPOSITORY_MODE` environment variable switches between modes
   - Dependency injection via `dependencies.py`

4. **UseCase Layer:**

   - Business logic encapsulation
   - Filter operations (by category, completion status, overdue date)
   - User-scoped data access
   - JWT token generation and validation

5. **Database Session (PostgreSQL):**
   - SQLAlchemy with connection pooling
   - Environment-based configuration (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)
   - Auto table creation on startup

**Response Format:**

```json
{
  "message": "Success message",
  "data": {
    "todo": {
      /* todo object */
    }
  },
  "error": null
}
```

**Port:** 5000 (inside container), exposed via Kubernetes Service NodePort 30005

### 2.3 Frontend Architecture (React + Vite)

**Struktur Proyek Frontend:**

```
frontend/
├── Containerfile              # Nginx multi-stage build
├── package.json              # npm dependencies & scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── biome.json                # Code formatter config
├── nginx.conf                # Nginx routing configuration
├── index.html                # HTML entry point
├── public/                   # Static assets
│   ├── manifest.json
│   ├── favicon.ico
│   └── robots.txt
└── src/
    ├── main.tsx              # React app entry point
    ├── config.ts             # Configuration constants
    ├── styles.css            # Global styles (Tailwind v4)
    ├── reportWebVitals.ts    # Performance metrics
    ├── routeTree.gen.ts      # Auto-generated routes (TanStack Router)
    ├── components/
    │   ├── CategoriesList.tsx      # List all categories with filtering
    │   ├── CategoryCard.tsx        # Category display card with actions
    │   ├── CategoryForm.tsx        # Category creation/edit form
    │   ├── CreateCategoryDialog.tsx # Modal for new category
    │   ├── CreateTodoDialog.tsx    # Modal for new todo
    │   ├── DatePicker.tsx          # Custom date picker with year/month
    │   ├── Form.tsx                # Reusable form component
    │   ├── GlobalError.tsx         # Error boundary component
    │   ├── Header.tsx              # App header with navigation
    │   ├── NotFound.tsx            # 404 page
    │   ├── ProtectedRoute.tsx      # Auth guard wrapper
    │   ├── Shimmer.tsx             # Loading skeleton animations
    │   ├── SmartFAB.tsx            # Context-aware floating action button
    │   ├── TodoCard.tsx            # Todo card with edit/delete
    │   ├── TodosList.tsx           # Animated todos list
    │   ├── ui/                     # Primitive UI components
    │   └── index.ts                # Component exports
    ├── contexts/
    │   ├── ThemeContext.tsx        # Dark/Light mode context
    │   └── AuthContext.tsx         # User authentication context (JWT)
    ├── models/
    │   ├── CategoryModel.ts        # TypeScript Category interface
    │   └── TodoModel.ts            # TypeScript Todo interface
    ├── routes/
    │   ├── __root.tsx              # Root layout with providers
    │   ├── index.tsx               # Landing page (public)
    │   ├── dashboard.tsx           # Dashboard with stats (protected)
    │   ├── todos.tsx               # Todos management page (protected)
    │   ├── categories.tsx          # Categories management (protected)
    │   ├── about.tsx               # About page (protected)
    │   ├── login.tsx               # Login page (public)
    │   └── register.tsx            # Registration page (public)
    └── utils/
        ├── axios_instance.ts       # Axios with auth interceptors
        └── index.ts                # Utility exports
```

**Key Technologies:**

1. **React 19 + Vite 6:**

   - Lightning-fast development server
   - Optimized production builds with code splitting
   - Hot module replacement (HMR)

2. **TanStack Router:**

   - Type-safe routing
   - Automatic code splitting
   - Nested route layouts
   - File-based routing (routeTree.gen.ts auto-generated)

3. **TanStack React Query:**

   - Server state management
   - Automatic caching & invalidation
   - Background refetching
   - Optimistic updates

4. **UI Components (16 total):**

   - Radix UI (headless components: Dialog, Select, Checkbox)
   - Tailwind CSS v4 (utility-first styling)
   - Motion library (animations & transitions)
   - Lucide React (icon library)
   - Sonner (toast notifications)

5. **Development Tools:**
   - Biome (fast formatter & linter)
   - TypeScript 5.7 (type safety)
   - Vitest (unit testing)

**Build Process:**

```bash
npm run build
# → Vite optimize (dependency pre-bundling)
# → TypeScript checking (tsc --noEmit)
# → Vite production build with manual chunks
# → Output: dist/ folder (static files)
```

**Port:** 3000 (dev), 80 (production via Nginx)

### 2.4 Database Design (PostgreSQL + SQLAlchemy)

**Database Architecture:**

The application uses PostgreSQL as the primary database in production, with an optional JSON-based local storage for development. Database operations are abstracted through SQLAlchemy ORM and the Repository pattern.

**Database Tables (PostgreSQL):**

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Todos Table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    completed BOOLEAN DEFAULT FALSE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Entity Relationships:**

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │──────<│ Categories  │──────<│    Todos    │
├─────────────┤ 1:N   ├─────────────┤ 1:N   ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ name        │       │ name        │
│ username    │       │ user_id(FK) │       │ description │
│ hashed_pwd  │       └─────────────┘       │ deadline    │
└─────────────┘                             │ completed   │
                                            │ category_id │
                                            │ user_id(FK) │
                                            └─────────────┘
```

**Database Operations (via Repository Pattern):**

- **CRUD:** Create, Read, Update, Delete for all entities
- **Filtering:** By category, completion status, overdue date, user
- **Relationships:** User-scoped data (todos and categories belong to users)
- **Cascade Behavior:**
  - Delete user → Delete all user's categories and todos
  - Delete category → Set todos' category_id to NULL
- **Connection Pooling:** SQLAlchemy pools with `pool_size=5, max_overflow=0`

**Environment Configuration:**

```bash
# PostgreSQL Connection
DB_HOST=postgres      # Kubernetes service name
DB_PORT=5432
DB_NAME=tododb
DB_USER=todo
DB_PASSWORD=todopassword

# Repository Mode
REPOSITORY_MODE=remote  # 'remote' for PostgreSQL, 'local' for JSON files
```

---

## 3. Informasi File Pendukung dan Aplikasi Tambahan yang Digunakan

### 3.1 Containerization Files

#### Backend Containerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

**Optimizations:**

- Python 3.11-slim base image (lightweight)
- pip cache cleared to reduce image size
- Two-step copy (requirements first, then code) for better Docker layer caching

#### Frontend Containerfile (Multi-stage build)

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund --prefer-offline=false
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

**Optimizations:**

- Multi-stage build: separates build environment from runtime
- Node 20-alpine for build phase (lighter than full Node)
- Nginx alpine as runtime (minimal size, production-ready)
- Only static files copied to runtime container

**Image Sizes (Approximate):**

- Backend: ~500MB (Python 3.11 + dependencies)
- Frontend: ~50MB (Nginx + static assets)

### 3.2 Kubernetes Manifests

#### 1. **Backend Deployment** (backend-deploy.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2 # Initial 2 pods
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: docker.io/wsnsam/devops-uts_backend:latest
          ports:
            - containerPort: 5000
          imagePullPolicy: Always
          resources:
            requests:
              cpu: "100m" # Minimum guaranteed CPU
              memory: "128Mi" # Minimum guaranteed RAM
            limits:
              cpu: "400m" # Maximum allowed CPU
              memory: "256Mi" # Maximum allowed RAM
```

**Key Points:**

- Initial replicas: 2 (high availability baseline)
- Always pull latest image (for automatic updates)
- Resource requests: Kubernetes scheduler reserves these
- Resource limits: Pod killed if exceeded
- CPU/Memory requests enable accurate HPA decisions

#### 2. **Backend Service** (backend-svc.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  type: NodePort # Expose on node port
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 5000 # Cluster-internal port
      targetPort: 5000 # Pod port
      nodePort: 30005 # External access port
```

**Access:**

- Internal cluster: `http://backend:5000`
- External: `http://node-ip:30005`

#### 3. **Frontend Deployment** (frontend-deploy.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1 # Single replica (static content)
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: docker.io/wsnsam/devops-uts_frontend:latest
          ports:
            - containerPort: 80
          imagePullPolicy: Always
```

**Rationale:**

- 1 replica: Static content, no scaling benefit
- Nginx handles static efficiently
- Can be manually scaled if needed for failover

#### 4. **Frontend Service** (frontend-svc.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
```

**Notes:**

- NodePort auto-assigned (typically 30000-32767)
- Service load-balances across replicas

#### 5. **Horizontal Pod Autoscaler** (hpa-backend.yaml)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2 # Never below 2
  maxReplicas: 3 # Never above 3
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60 # Scale up at 60% avg CPU
```

**Behavior:**

- Metrics collected by Metrics Server
- Updates every 15 seconds (default)
- Scale-up: immediate
- Scale-down: wait 5 minutes (default) to prevent thrashing
- Decision: `replicas = ceil[current_replicas * (current_usage / target)]`

#### 6. **Ingress** (ingress.yaml)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: todo-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
    traefik.ingress.kubernetes.io/router.tls.certresolver: le
spec:
  rules:
    - host: todo.wsnsam.my.id
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend
                port: { number: 5000 }
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port: { number: 80 }
```

**Routing Logic:**

- `/api/*` → Backend Service (FastAPI)
- All other paths → Frontend Service (Nginx)
- TLS enabled via Let's Encrypt (Traefik auto-management)
- Domain: `todo.wsnsam.my.id`

### 3.3 CI/CD Pipeline (GitHub Actions)

**Workflow File:** `.github/workflows/ci-cd.yml`

**Pipeline Stages:**

1. **Trigger:**

   - Event: `push` to `master` branch
   - Automatic on every commit to master

2. **Build & Push Job:**

   - Runner: `ubuntu-latest`
   - Steps:
     a. Checkout repository code
     b. Login to Docker Hub (using secrets)
     c. Build backend image with Podman
     - Architecture: linux/amd64
     - Tag: `docker.io/wsnsam/devops-uts_backend:latest`
       d. Push backend to Docker Hub
       e. Build frontend image with Podman
       f. Push frontend to Docker Hub

3. **Deploy Job:**
   - Depends on: `build-and-push` job completion
   - SSH to VPS server
   - Steps:
     a. Copy k8s manifests via SCP
     b. Apply manifests: `kubectl apply -f ~/k8s`
     c. Trigger rolling restart: `kubectl rollout restart`
     d. Kubernetes performs rolling update (no downtime)

**Secrets Required:**

```
DOCKERHUB_USERNAME    # Docker Hub account username
DOCKERHUB_TOKEN       # Docker Hub access token
VPS_HOST              # DigitalOcean VPS IP address
VPS_USER              # SSH username (root or sudo user)
VPS_KEY               # SSH private key (for authentication)
```

**Time to Deploy:** ~5-10 minutes (build + push + k8s update)

### 3.4 Kubernetes Infrastructure Requirements

**Cluster Setup (k3s):**

- Lightweight Kubernetes distribution
- Single node or multi-node cluster
- Pre-installed on DigitalOcean VPS
- Metrics Server included for HPA

**Storage:**

- Uses **PostgreSQL** (deployed via Kubernetes) with PersistentVolumeClim
- **Local Development:** Can use JSON-based local storage (via `REPOSITORY_MODE=local`) or PostgreSQL
- **Data Persistence:** `/var/lib/postgresql/data` mounted to PVC

**Networking:**

- Traefik Ingress Controller (built into k3s)
- HTTPS/TLS certificate management (Let's Encrypt)
- Service-to-service DNS (Kubernetes DNS)

### 3.5 External Services & Tools

1. **Docker Hub:**

   - Container image registry
   - Public repository: `docker.io/wsnsam/devops-uts_*`
   - Used for image distribution

2. **GitHub:**

   - Source code repository
   - GitHub Actions CI/CD
   - Secrets management

3. **DigitalOcean VPS:**

   - Server hosting
   - IP: `146.190.82.217`
   - k3s cluster runs here
   - Resources: 2vCPU, 4GB RAM (typical)

4. **Let's Encrypt:**

   - Free SSL/TLS certificates
   - Integrated via Traefik
   - Auto-renewal

5. **npm/pip Package Managers:**
   - Frontend: npm (Node Package Manager)
   - Backend: pip (Python Package Manager)

### 3.6 Development & Testing Files

#### Backend Test Suite (`tests/test_api.py`)

A comprehensive test suite is included to validate all API endpoints using a mock data source (Local Repository). This ensures testing without requiring a running database.

**Test Coverage (21 Tests):**

1.  **Health Check**: Verifies API availability
2.  **Authentication**:
    - User Registration & Duplicate Check
    - Login (JWT Token retrieval)
    - Get Current User
    - Token Refresh
3.  **Categories**:
    - Create, List, Get by ID, Update, Delete
4.  **Todos**:
    - Create, List (with/without filters), Get by ID, Update, Delete
5.  **Dashboard**:
    - Statistics verification (total, completed, pending)
6.  **Security**:
    - Invalid Token handling
    - Missing Authentication handling

**How to Run Tests:**

```bash
cd backend
python -m tests.test_api
```

**Output:**

```text
============================================================
BACKEND API ROUTE TESTS (with Local Mock DataSource)
============================================================

[1] Testing Health Check...
  ✓ Health check passed

[2] Testing User Registration...
  ✓ User registered successfully (ID: 1)
  ✓ Token obtained: eyJhbGciOiJIUzI1NiIsIn...

...

============================================================
✅ ALL TESTS PASSED!
============================================================
```

**Frontend Build Configuration:**

- `tsconfig.json`: TypeScript compiler options
- `vite.config.ts`: Vite bundler configuration
- `biome.json`: Code quality & formatting

**Legacy Configuration:**

- `legacy/podman-compose.yml`: Local multi-container development
- Alternative to Kubernetes for development

---

## 4. Naskah Video Penjelasan Implementasi Kubernetes/Openshift

### 📹 VIDEO 1: Application Architecture & Kubernetes Deployment

---

**DURATION:** ~5 Minutes
**TOPICS:** Architecture, PostgreSQL, Kubernetes Manifests, Ingress

---

#### **SCENE 1: INTRODUCTION & APP OVERVIEW [0:00-0:45]**

**Visual:**

- Buka browser, tunjukkan halaman Login aplikasi.
- Login dan demokan fitur: Tambah Todo, Filter Category, Dashboard.

**Script:**
"Halo! Di video ini saya akan mendemokan **DevOps-UTS**, sebuah aplikasi manajemen tugas berbasis Cloud Native.

Aplikasi ini tidak hanya sekedar Todo List biasa, tapi dibangun dengan **Clean Architecture** yang modern:

- **Frontend:** React 19 dengan Tailwind CSS v4 untuk UI yang responsif.
- **Backend:** FastAPI dengan **PostgreSQL** database.
- **Security:** JWT Authentication untuk login yang aman.

Mari kita bedah arsitekturnya!"

---

#### **SCENE 2: ARCHITECTURE & DATABASE [0:45-1:45]**

**Visual:**

- Tampilkan Diagram Arsitektur (yang ada di documentation.md).
- Switch ke VS Code, buka `backend/app` folder structure.

**Script:**
"Secara arsitektur, kami memisahkan Frontend dan Backend menjadi service yang independen.

Backend menggunakan **Clean Architecture** dengan layer:

- **Repository Pattern:** Memisahkan logic database.
- **Usecases:** Menangani business rules.
- **PostgreSQL:** Kami migrasi dari JSON file ke database PostgreSQL 16 untuk reliability data.

Code structure kami di VS Code sangat rapi, memisahkan API routes, models, dan logic database di folder berbeda. Ini memudahkan maintenance dan scaling."

---

#### **SCENE 3: KUBERNETES MANIFESTS [1:45-3:15]**

**Visual:**

- Buka folder `k8s/` di VS Code.
- Tunjukkan `backend-deploy.yaml`, `postgres/postgres-deployment.yaml`, lalu `ingress.yaml`.

**Script:**
"Untuk deployment, kami menggunakan Kubernetes. Semua konfigurasi ada di folder `k8s`.

1.  **Backend Deployment:** Menjalankan 2 replika FastAPI container. Kami menyuntikkan koneksi database via environment variables yang aman dari Secrets.
2.  **PostgreSQL:** Database berjalan di pod sendiri dengan **PersistentVolumeClaim (PVC)**. Ini memastikan data tetap aman (persist) meskipun pod restart.
3.  **Frontend:** Static Nginx server, cukup 1 replika.
4.  **Ingress:** Kami gunakan **Traefik Ingress Controller** untuk routing traffic dan SSL otomatis melalui domain `todo.wsnsam.my.id`."

---

#### **SCENE 4: DEPLOYMENT DEMO [3:15-4:15]**

**Visual:**

- Buka Terminal.
- Jalankan `kubectl get pods`, `kubectl get services`, `kubectl get pvc`.
- Tunjukkan browser mengakses `https://todo.wsnsam.my.id`.

**Script:**
"Mari lihat cluster kami yang sedang berjalan.
(Ketik `kubectl get pods`)
Terlihat semua komponen berjan:

- 2 Pods Backend untuk High Availability.
- 1 Pod Postgres untuk database.
- 1 Pod Frontend.

(Ketik `kubectl get pvc`)
Persistent Volume juga statusnya 'Bound', artinya storage database sudah siap.

Aplikasi dapat diakses publik melalui domain https://todo.wsnsam.my.id yang sudah diamankan dengan HTTPS."

---

#### **SCENE 5: CLOSING [4:15-5:00]**

**Visual:**

- Kembali ke Dashboard aplikasi.
- Tunjukkan slide Summary singkat.

**Script:**
"Kesimpulannya, arsitektur ini memberikan:

1.  **Scalability:** Frontend dan Backend bisa di-scale independen.
2.  **Reliability:** Data aman di PostgreSQL dengan Persistent Storage.
3.  **Security:** Akses terenkripsi HTTPS dan JWT Auth.

Di video selanjutnya, kita akan bahas sisi otomatisasi DevOps: Testing, CI/CD, dan Autoscaling. Terima kasih!"

---

---

## 5. Naskah Video Penjelasan HPA, CI/CD, dan Monitoring

### 📹 VIDEO 2: Testing, CI/CD, Autoscaling & Monitoring

---

**DURATION:** ~5 Minutes
**TOPICS:** Automated Testing, GitHub Actions, HPA, Monitoring

---

#### **SCENE 1: INTRO & TESTING [0:00-1:15]**

**Visual:**

- Buka Terminal.
- Jalankan script testing `python -m tests.test_api`.

**Script:**
"Assalamu alaikum, kembali lagi di video kedua. Sekarang kita akan fokus pada **Automation** dan **Reliability**.

Fondasi dari sistem yang reliable adalah Testing. Kami memiliki 21 Automated Unit Tests untuk Backend.
(Jalankan command test)
Lihat, dalam hitungan detik, script memvalidasi:

- Register & Login User
- CRUD Category & Todos
- Validasi Token JWT

Semua test ini berjalan di local mock environment, memastikan kode bebas bug bahkan sebelum di-commit."

---

#### **SCENE 2: CI/CD PIPELINE [1:15-2:45]**

**Visual:**

- Buka Browser, masuk ke Tab "Actions" di repository GitHub.
- Tunjukkan workflow run terakhir yang sukses.
- Buka file `.github/workflows/ci-cd.yml` sebentar.

**Script:**
"Setelah code di-push, **GitHub Actions** mengambil alih. Pipeline CI/CD kami berjalan otomatis:

1.  **Build:** Membuat Docker Image backend dan frontend secara paralel.
2.  **Push:** Upload image ke Docker Hub registry.
3.  **Deploy:** Melakukan SSH ke VPS kami dan mengupdate Kubernetes cluster.

Proses ini _Zero Downtime_ berkat strategi Rolling Update Kubernetes. Developer cukup push code, dan sistem akan terupdate sendiri dalam beberapa menit."

---

#### **SCENE 3: HORIZONTAL POD AUTOSCALER (HPA) [2:45-4:00]**

**Visual:**

- Buka Terminal. Jalankan `kubectl get hpa`.
- (Opsional) Tunjukkan grafik penggunaan CPU kalau ada (atau `kubectl top pods`).

**Script:**
"Bagaimana jika traffic melonjak? Kami menggunakan **Horizontal Pod Autoscaler (HPA)**.

(Tunjuk metrics di terminal)
Kami mengonfigurasi HPA untuk memonitor CPU Usage.

- Target kami adalah **60% CPU utilization**.
- Jika beban naik di atas 60%, Kubernetes otomatis menambah pod baru (Scale Up).
- Jika beban turun, pod akan dikurangi (Scale Down).

Ini menjamin aplikasi tetap responsif saat ramai, dan hemat biaya saat sepi."

---

#### **SCENE 4: MONITORING & LOGGING [4:00-4:30]**

**Visual:**

- Jalankan `kubectl top nodes` dan `kubectl top pods`.
- Jalankan `kubectl logs deployment/backend --tail=20`.

**Script:**
"Untuk memantau kesehatan server, kami menggunakan built-in monitoring tools.

- `kubectl top`: Melihat konsumsi Real-time CPU & Memory.
- `kubectl logs`: Memeriksa log aplikasi untuk debugging jika ada error.

Semuanya transparan dan mudah diakses oleh System Administrator."

---

#### **SCENE 5: CLOSING [4:30-5:00]**

**Visual:**

- Tampilkan slide penutup atau wajah pembicara.

**Script:**
"Demikianlah demonstrasi implementasi DevOps kami.
Dari **Clean Architecture** yang solid, Database **PostgreSQL** yang reliable, hingga otomatisasi penuh dengan **CI/CD** dan **Autoscaling**.

Sistem ini dirancang untuk:

1.  Mudah dikembangkan (Maintainable)
2.  Aman (Secure)
3.  Siap untuk Production (Scalable)

Terima kasih telah menonton!"

---

"Untuk production-grade monitoring, biasanya digunakan dedicated tools:

Prometheus: Metrics collection dan storage

- Scrape metrics dari application endpoints (atau exporters)
- Store time-series data
- Powerful query language (PromQL)

Grafana: Visualization dashboard

- Query Prometheus
- Create custom dashboards
- Real-time visualization dari metrics

AlertManager: Alerting

- Define rules untuk alert conditions
- Send notifications ke slack, email, pagerduty
- Escalation policies

Elk Stack (Elasticsearch, Logstash, Kibana): Centralized logging

- Aggregate logs dari semua pods
- Full-text search dan analysis
- Historical retention

Dalam implementasi kami di VPS kecil, kami prioritize simplicity dan resource efficiency. Kami menggunakan:

1. Kubernetes Metrics Server (built-in) untuk HPA
2. kubectl commands untuk manual metrics inspection
3. Pod logs untuk debugging dan troubleshooting
4. Swagger documentation untuk API health

Untuk production dengan lebih resources, recommended:

- Install Prometheus + Grafana untuk dashboards
- Configure alerting rules
- Setup centralized logging
- Implement tracing dengan Jaeger atau similar

Monitoring strategy kami adalah:

- Reactive: Check metrics ketika suspect ada issue
- Proactive: Regular health checks via API health endpoints
- Automated: HPA automatically respond ke metrics"

---

#### **SCENE 11: END-TO-END FLOW [15:30-16:30]**

**Visual:** Diagram showing complete flow dari development ke production
**Script:**

"Mari recap end-to-end flow dari development sampai production.

1. Developer develop aplikasi locally:

   - Backend: Python FastAPI, test dengan pytest dan uvicorn
   - Frontend: React dengan npm scripts, test dengan npm test

2. Developer commit dan push ke GitHub:

   - git commit -m \"feature: add todo filter\"
   - git push origin master

3. GitHub Actions workflow trigger otomatis

4. Build stage:

   - Checkout latest code
   - Build backend container image
   - Build frontend container image
   - Push images ke Docker Hub dengan tag 'latest'

5. Deploy stage:

   - Copy k8s manifests ke VPS via SCP
   - SSH ke VPS dan run kubectl apply
   - kubectl trigger rolling restart untuk pull new images
   - Kubernetes perform rolling update - one pod at a time

6. Rolling Update Process:

   - Create new pod dengan new image
   - Check health - pod must pass readiness probe
   - Once healthy, route traffic ke new pod
   - Gracefully terminate old pod
   - Repeat untuk setiap pod in deployment

7. Post-deployment:

   - HPA monitor CPU metrics
   - Jika spike terjadi, HPA automatically scale ke 3 replicas
   - Load balancer distribute traffic across all healthy pods
   - Monitoring alerts triggered jika metrics exceed thresholds

8. Hasil:
   - Zero downtime deployment
   - Automatic rollback jika issue detected
   - Automatic scaling untuk handle variable load
   - Observable system state via metrics dan logs

Entire flow dari commit ke live production: ~10 menit
Tanpa manual intervention atau downtime.

Ini adalah power dari modern DevOps practices - automated, reliable, observable infrastructure."

---

#### **SCENE 12: TROUBLESHOOTING & BEST PRACTICES [16:30-17:30]**

**Visual:** Terminal showing debugging commands
**Script:**

"Ketika issue terjadi, ini debugging commands yang helpful:

Check deployment status:

```
kubectl describe deployment backend
kubectl get events --sort-by='.lastTimestamp'
```

Check pod status dan logs:

```
kubectl get pods -o wide
kubectl logs <pod-name>
kubectl logs <pod-name> --previous  # untuk crashed pod
kubectl describe pod <pod-name>
```

Check service connectivity:

```
kubectl get services
kubectl port-forward svc/backend 5000:5000  # test local
```

Check HPA status:

```
kubectl get hpa
kubectl describe hpa backend
```

Verify image pull:

```
kubectl get events | grep -i pull
```

Common issues dan solutions:

CrashLoopBackOff:

- Pod repeatedly crashing
- Check logs untuk error
- Verify environment variables dan configs
- Check resource limits

ImagePullBackOff:

- Cannot pull container image dari registry
- Verify image tag correct
- Verify imagePullSecrets jika using private registry
- Check network connectivity

Pending pods:

- Pod tidak schedule ke any node
- Check resource requests vs available resources
- Verify node selectors
- Check PVC bound status

Best practices:

1. Always specify resource requests dan limits:

```yaml
resources:
  requests:
    cpu: 100m
    memory: 128Mi
  limits:
    cpu: 400m
    memory: 256Mi
```

2. Implement health checks:

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
readinessProbe:
  httpGet:
    path: /health
    port: 5000
```

3. Proper logging - log ke stdout/stderr, bukan file

4. Version all container images, jangan rely pada 'latest' tag saja

5. Regular backups dan disaster recovery testing

6. Monitor resource trends untuk capacity planning"

---

#### **SCENE 13: SUMMARY & CONCLUSION [17:30-18:00]**

**Visual:** Summary slide with key takeaways
**Script:**

"Recap dari video ini:

Horizontal Pod Autoscaler:

- Monitor metrics dari pods secara terus-menerus
- Automatically scale pod replicas based on demand
- Maintain application performance tanpa manual intervention
- Essential untuk cost-effective production deployment

CI/CD Pipeline:

- Automated build dan deployment process
- GitHub Actions trigger pada code push
- Build, test, dan deploy dalam ~10 menit
- Zero downtime rolling updates

Monitoring:

- Real-time visibility ke aplikasi state
- kubectl commands untuk metrics dan logs
- Foundation untuk troubleshooting dan alerting
- Critical untuk production reliability

Kombinasi dari ketiga aspek ini create robust, scalable, observable system yang dapat maintain 24/7 availability dengan minimal manual effort.

Implementasi Kubernetes dengan HPA dan CI/CD adalah foundation dari modern DevOps practices. Sistem kami dapat:

- Handle variable load otomatis
- Deploy updates tanpa downtime
- Recover dari failures otomatis
- Provide visibility untuk troubleshooting

Terima kasih telah menonton! Semoga video ini helpful dalam understanding production-grade Kubernetes deployment, automatic scaling, dan CI/CD practices.

Jika ada questions atau feedback, silakan comment di bawah. Sampai jumpa di video berikutnya!"

## REFERENSI DOKUMENTASI

**Kubernetes Official Documentation:**

- https://kubernetes.io/docs/
- https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
- https://kubernetes.io/docs/concepts/services-networking/ingress/

**FastAPI Documentation:**

- https://fastapi.tiangolo.com/

**React & Vite Documentation:**

- https://react.dev/
- https://vitejs.dev/

**GitHub Actions:**

- https://docs.github.com/en/actions

**k3s Documentation:**

- https://docs.k3s.io/

**Traefik Ingress Controller:**

- https://doc.traefik.io/traefik/providers/kubernetes-ingress/

**Docker & Container Best Practices:**

- https://docs.docker.com/develop/

---

**Document Version:** 1.1
**Last Updated:** January 14, 2026
**Repository:** https://github.com/sammmms/devops-uts
