# 📋 Todo App – Kubernetes & CI/CD

A production-grade **Task Management Application** demonstrating modern DevOps practices with containerization, Kubernetes orchestration, and automated CI/CD pipeline. The application features a **React frontend** and **Python FastAPI backend**, deployed with **zero-downtime updates** and **automatic scaling** capabilities.

This project was developed as part of a **DevOps / Cloud Computing** course assignment, serving as a comprehensive case study for cloud-native application development and deployment.

> 📖 **For detailed information**, see [DOCUMENTATION.md](./documentation.md)

---

## 🧩 Tech Stack

### Frontend

- **Framework**: React 19 + Vite (lightning-fast dev server)
- **Routing**: TanStack Router (type-safe file-based routing)
- **State Management**: TanStack React Query (server state)
- **Styling**: Tailwind CSS + Radix UI (headless components)
- **Build Tool**: Vite (optimized production builds)
- **Code Quality**: Biome (formatter + linter)

### Backend

- **Framework**: FastAPI (modern async Python framework)
- **Validation**: Pydantic (type-safe data validation)
- **Server**: Uvicorn (ASGI server)
- **Database**: JSON-based local storage (can extend to PostgreSQL)
- **API Docs**: Swagger UI & ReDoc (auto-generated)

### Infrastructure & DevOps

- **Containerization**: Docker/Podman (multi-stage builds)
- **Orchestration**: Kubernetes (k3s - lightweight distribution)
- **Container Registry**: Docker Hub
- **CI/CD**: GitHub Actions (automated build & deploy)
- **Infrastructure**: DigitalOcean VPS
- **Ingress Controller**: Traefik (with automatic SSL/TLS)
- **Autoscaling**: Horizontal Pod Autoscaler (CPU-based)
- **Monitoring**: Kubernetes Metrics Server

---

## ✨ Key Features

- 🔐 **User Authentication**: Secure JWT-based login and registration system
- ✅ **Complete Todo Management**: Create, read, update, delete tasks with deadlines and categories
- 📂 **Task Organization**: Group todos by custom categories
- 📊 **Dashboard**: Real-time statistics and overview of all todos
- 📱 **Responsive UI**: Mobile-friendly design with dark mode support
- ♻️ **Automatic Scaling**: Horizontal Pod Autoscaler (HPA) scales backend from 2-3 replicas based on CPU load
- 🔄 **Zero-Downtime Deployment**: Rolling updates via CI/CD pipeline without service interruption
- 🕒 **24/7 Availability**: High availability setup with multiple replicas and health checks
- 🚀 **Automated CI/CD**: Push to GitHub → Build → Test → Deploy in ~10 minutes
- 📈 **Observable System**: Metrics collection, logging, and health monitoring
- 🔒 **HTTPS/TLS**: Automatic SSL certificate management via Let's Encrypt

---

## 🏗️ Architecture Overview

```
Internet Traffic (HTTPS)
        ↓
┌─────────────────────────────────────┐
│   Traefik Ingress Controller        │
│   (SSL/TLS, Path Routing)           │
└────────────┬─────────────────────────┘
             ↓
    ┌────────┴──────────┐
    ↓                   ↓
┌──────────┐        ┌──────────────┐
│ Frontend │        │ Backend API  │
│  (Nginx) │        │  (FastAPI)   │
│ 1 Replica│        │ 2-3 Replicas │
└────┬─────┘        │ (HPA enabled)│
     │              └──────┬───────┘
     │                     ↓
     │              ┌──────────────┐
     │              │ Metrics Srvr │
     └──────────────→ (Monitoring) │
                    └──────────────┘
```

**Deployment Model:**

- **Frontend**: Single Kubernetes Deployment with 1 replica (static content, no scaling needed)
- **Backend**: Single Kubernetes Deployment with 2-3 replicas (dynamic scaling via HPA)
- **Load Balancing**: Kubernetes Service distributes traffic across backend replicas
- **Routing**: Traefik Ingress Controller routes requests based on path (\*/api → backend, others → frontend)

---

## 🚀 Deployment Architecture

- **Frontend and Backend** are deployed as separate **Kubernetes Deployments**
- **Services**: NodePort type for external access, with Ingress for production routing
- **Database**: JSON file storage (local persistence, can migrate to PostgreSQL)
- **Networking**: Traefik Ingress Controller with automatic HTTPS
- **Autoscaling**: HPA monitors CPU metrics and scales backend 2→3 pods
- **Health Checks**: Liveness and readiness probes for automatic recovery

---

## ⚙️ CI/CD Workflow & Automation

Every push to the `master` branch triggers an automated pipeline:

```
Developer Push
    ↓
GitHub Actions Trigger
    ├─ Build & Push
    │  ├─ Build backend Docker image (Python FastAPI)
    │  ├─ Build frontend Docker image (Node → Nginx)
    │  └─ Push images to Docker Hub
    │
    └─ Deploy & Update
       ├─ Copy k8s manifests to VPS via SCP
       ├─ Apply manifests with kubectl
       └─ Trigger rolling restart
          (Kubernetes pulls new images & updates pods)
```

**Timeline**: ~5-10 minutes from git push to live production

**Features**:

- Automated container image building and testing
- Secure credential management via GitHub Secrets
- Zero-downtime rolling updates
- Automatic rollback capability
- SSH-based deployment to VPS

The pipeline is defined in: `.github/workflows/ci-cd.yml`

---

## ☸️ Kubernetes Manifests & Configuration

Kubernetes manifests are located in the `k8s/` directory:

```
k8s/
├─ backend-deploy.yaml      # Backend deployment (2 initial replicas)
├─ backend-svc.yaml         # Backend service (NodePort: 30005)
├─ frontend-deploy.yaml     # Frontend deployment (1 replica)
├─ frontend-svc.yaml        # Frontend service (NodePort: 30003)
├─ hpa-backend.yaml         # Horizontal Pod Autoscaler (2-3 replicas, 60% CPU)
└─ ingress.yaml             # Traefik Ingress (SSL/TLS, path-based routing)
```

**Key Configuration Details:**

### Backend Deployment

- **Image**: `docker.io/wsnsam/devops-uts_backend:latest`
- **Replicas**: 2 (min) - 3 (max via HPA)
- **Port**: 5000
- **Resources**:
  - Request: 100m CPU, 128Mi RAM
  - Limit: 400m CPU, 256Mi RAM
- **Image Pull**: Always (ensures latest version)

### Frontend Deployment

- **Image**: `docker.io/wsnsam/devops-uts_frontend:latest`
- **Replicas**: 1 (static content, no scaling)
- **Port**: 80 (Nginx)

### Horizontal Pod Autoscaler (HPA)

- **Metric**: CPU utilization
- **Target**: 60% average CPU
- **Min Replicas**: 2
- **Max Replicas**: 3
- **Scale-up Delay**: Immediate
- **Scale-down Delay**: 5 minutes (to prevent thrashing)

### Ingress Configuration

- **Domain**: `todo.wsnsam.my.id`
- **TLS**: Enabled (Let's Encrypt auto-renewal)
- **Routing**:
  - `/api/*` → Backend Service (5000)
  - `/*` → Frontend Service (80)

### Accessing the Application

| Service         | Access Method   | URL                                 |
| --------------- | --------------- | ----------------------------------- |
| **Frontend**    | NodePort        | `http://146.190.82.217:30003`       |
| **Backend API** | NodePort        | `http://146.190.82.217:30005`       |
| **Frontend**    | Ingress (HTTPS) | `https://todo.wsnsam.my.id`         |
| **API Docs**    | Swagger UI      | `http://146.190.82.217:30005/docs`  |
| **API Docs**    | ReDoc           | `http://146.190.82.217:30005/redoc` |

---

## 📈 Autoscaling & High Availability

The backend service uses **Horizontal Pod Autoscaler (HPA)** for automatic scaling:

- **Minimum replicas**: 2 (ensures availability even if one pod fails)
- **Maximum replicas**: 3 (cost constraint for VPS)
- **Target CPU utilization**: 60%
- **Metrics Server**: Kubernetes built-in component collects resource metrics

**Scaling Behavior Example:**

```
T=0min: Backend at 2 replicas, 30% average CPU → No scaling
T=5min: Traffic surge, 75% average CPU → HPA calculates: ceil[2 × (75/60)] = 3 replicas
T=7min: New pod provisioned and healthy, traffic distributed across 3 pods
T=10min: Traffic normalizes, 45% average CPU → Queued for scale-down (5min delay)
T=15min: Scale-down to 2 replicas executed
```

**Benefits:**

- ✅ Cost-effective: Only pay for what you need
- ✅ Performance: Automatically handles traffic spikes
- ✅ Reliability: Maintains minimum replicas for high availability

---

## 🧪 Monitoring & Observability

### Built-in Monitoring

```bash
# View node metrics
kubectl top nodes

# View pod metrics (current usage)
kubectl top pods

# View pod metrics with namespaces
kubectl top pods --all-namespaces

# Watch pod status in real-time
kubectl get pods -w

# View deployment rollout status
kubectl rollout status deployment/backend
```

### Logs & Debugging

```bash
# View backend logs
kubectl logs deployment/backend

# View frontend logs
kubectl logs deployment/frontend

# View logs from specific pod
kubectl logs pod-name

# View previous pod logs (if crashed)
kubectl logs pod-name --previous

# Stream logs in real-time
kubectl logs deployment/backend -f
```

### Health & API Testing

**Health Endpoint:**

```bash
curl http://146.190.82.217:30005/api/v1/health
# Response: {"message":"API is running","data":null,"error":null}
```

**Interactive API Documentation:**

- Swagger UI: `http://146.190.82.217:30005/docs`
- ReDoc: `http://146.190.82.217:30005/redoc`

### Monitoring Approach

Due to VPS resource constraints, we use a lightweight monitoring strategy:

- ✅ Kubernetes Metrics Server (CPU/Memory monitoring)
- ✅ kubectl commands for real-time metrics
- ✅ Application logs for debugging
- ✅ Health check endpoints

**Future Enhancement**: Deploy Prometheus + Grafana for comprehensive dashboards and alerting.

---

## 📚 Project Structure

```
devops-uts/
├── documentation.md            # Comprehensive documentation (START HERE!)
├── readme.md                   # This file
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions CI/CD pipeline
├── backend/                    # Python FastAPI Backend
│   ├── Containerfile          # Docker image definition
│   ├── requirements.txt        # Python dependencies
│   └── app/
│       ├── main.py            # FastAPI app initialization
│       ├── api/               # REST API routes
│       ├── models/            # Pydantic data models
│       ├── services/          # Business logic
│       ├── db/                # Database layer & JSON storage
│       └── utils/             # Utility functions
├── frontend/                   # React + Vite Frontend
│   ├── Containerfile          # Multi-stage Docker build
│   ├── package.json           # npm dependencies
│   ├── vite.config.ts         # Vite bundler config
│   ├── tsconfig.json          # TypeScript config
│   ├── index.html             # HTML entry point
│   └── src/
│       ├── main.tsx           # React app entry
│       ├── components/        # React components
│       ├── routes/            # Page routes
│       ├── models/            # TypeScript interfaces
│       ├── contexts/          # React contexts
│       └── utils/             # Utility functions
├── k8s/                        # Kubernetes manifests
│   ├── backend-deploy.yaml    # Backend deployment
│   ├── backend-svc.yaml       # Backend service
│   ├── frontend-deploy.yaml   # Frontend deployment
│   ├── frontend-svc.yaml      # Frontend service
│   ├── hpa-backend.yaml       # Horizontal Pod Autoscaler
│   └── ingress.yaml           # Ingress configuration
└── legacy/
    └── podman-compose.yml     # Local development (alternative)
```

---

## 🧑‍💻 Local Development Setup

### Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.11+** (for backend)
- **Docker/Podman** (optional, for local containerization)
- **kubectl** (optional, for testing with local k3s)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

Backend runs on: `http://localhost:5000`
API Docs: `http://localhost:5000/docs`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Building Docker Images (Local)

**Backend:**

```bash
cd backend
docker build -t devops-uts_backend:latest .
docker run -p 5000:5000 devops-uts_backend:latest
```

**Frontend:**

```bash
cd frontend
docker build -t devops-uts_frontend:latest .
docker run -p 3000:80 devops-uts_frontend:latest
```

### Local Multi-Container Development (Legacy)

```bash
# Using Podman Compose
podman-compose -f legacy/podman-compose.yml up

# Cleanup
podman-compose -f legacy/podman-compose.yml down
```

---

## 🧪 Testing

### Backend Tests

A comprehensive test suite is included that validates all 21 backend API routes:

```bash
# Navigate to backend directory
cd backend

# Run all tests
python3 test_all_routes.py

# Or with pytest for CI/CD
python3 -m pytest test_all_routes.py -v
```

**Test Coverage:**

- ✅ Authentication (register, login, token refresh, current user)
- ✅ Categories CRUD (create, read, update, delete)
- ✅ Todos CRUD (create, read, update, delete, filter)
- ✅ Dashboard statistics
- ✅ Security (invalid token rejection, missing auth)

Tests run in 1-3 seconds with automatic test data setup and cleanup.

---

## 🔄 API Endpoints

### Base URL

- **Development**: `http://localhost:5000/api/v1`
- **Production**: `http://146.190.82.217:30005/api/v1`

### Health Check

```http
GET /api/v1/health
```

### Todo Endpoints

```http
POST   /api/v1/todo              # Create todo
GET    /api/v1/todo              # List todos (with filters)
GET    /api/v1/todo/{id}         # Get specific todo
PUT    /api/v1/todo/{id}         # Update todo
DELETE /api/v1/todo/{id}         # Delete todo
```

### Category Endpoints

```http
POST   /api/v1/categories        # Create category
GET    /api/v1/categories        # List categories
GET    /api/v1/categories/{id}   # Get specific category
PUT    /api/v1/categories/{id}   # Update category
DELETE /api/v1/categories/{id}   # Delete category
```

### Dashboard Endpoint

```http
GET    /api/v1/dashboard/stats   # Get dashboard statistics
```

### Authentication Endpoints

```http
POST   /api/v1/auth/register     # Register new user
POST   /api/v1/auth/login        # Login and get JWT token
GET    /api/v1/auth/me           # Get current user info (requires token)
POST   /api/v1/auth/refresh      # Refresh access token
```

See [API Documentation](http://146.190.82.217:30005/docs) for detailed schemas and examples.

---

## 🔐 Environment Variables & Secrets

### GitHub Actions Secrets (Required for CI/CD)

```
DOCKERHUB_USERNAME    # Docker Hub account username
DOCKERHUB_TOKEN       # Docker Hub personal access token
VPS_HOST              # DigitalOcean VPS IP address
VPS_USER              # SSH username (for VPS access)
VPS_KEY               # SSH private key (for authentication)
```

**How to set secrets:**

1. Go to GitHub Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with corresponding value

---

## 📹 Video Documentation

### Video 1: Kubernetes Implementation (12-15 minutes)

Complete explanation of:

- Kubernetes cluster architecture
- Container image building and pushing
- Deployment manifests (backend, frontend)
- Service exposure and networking
- Ingress configuration with SSL/TLS
- Rolling updates and zero-downtime deployment

**Watch**: [Link to your video]

### Video 2: HPA, CI/CD & Monitoring (15-18 minutes)

Detailed walkthrough of:

- Horizontal Pod Autoscaler (HPA) concept and configuration
- Automatic scaling behavior under load
- GitHub Actions CI/CD workflow
- Automated build, push, and deployment pipeline
- Monitoring strategies and debugging commands
- End-to-end flow from code push to production

**Watch**: [Link to your video]

---

## 🎓 Learning Resources

### Kubernetes

- [Official Kubernetes Documentation](https://kubernetes.io/docs/)
- [k3s Documentation](https://docs.k3s.io/)
- [HPA Guide](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)

### Backend

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

### Frontend

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)

### DevOps & CI/CD

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/)
- [Traefik Ingress Controller](https://doc.traefik.io/traefik/)

---

## 📊 Implementation Summary

### Kubernetes/OpenShift (15 points)

✅ k3s cluster deployed on DigitalOcean VPS
✅ Multiple Kubernetes Deployments (frontend, backend)
✅ Service-based networking (NodePort + Ingress)
✅ Infrastructure as Code (YAML manifests)
✅ Resource requests and limits configured

### Horizontal Pod Autoscaler (15 points)

✅ HPA configured for backend service
✅ CPU-based scaling metrics
✅ Min: 2 replicas, Max: 3 replicas
✅ Target CPU utilization: 60%
✅ Automatic scaling tested and verified

### CI/CD Implementation (15 points)

✅ GitHub Actions workflow configured
✅ Automatic triggers on push to master
✅ Container image building and registry push
✅ Automated deployment to Kubernetes
✅ Rolling updates without downtime

### Monitoring (15 points)

✅ Kubernetes Metrics Server for resource monitoring
✅ kubectl commands for metric inspection
✅ Container logs and debugging capabilities
✅ Health endpoints (/health, /docs)
✅ Deployment event tracking and alerts

---

## 🚀 Getting Started

1. **Read the Documentation**: Start with [DOCUMENTATION.md](./documentation.md) for comprehensive project details
2. **Watch Video 1**: Understand Kubernetes architecture and deployment
3. **Watch Video 2**: Learn about HPA, CI/CD, and monitoring
4. **Local Development**: Follow "Local Development Setup" section above
5. **Deployment**: Use the k8s manifests and CI/CD pipeline for production

---

## 📝 Contributing

To contribute to this project:

1. Clone the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Changes to `master` branch automatically trigger the CI/CD pipeline for testing and deployment.

---

## 📄 License

This project is part of an educational course assignment and is provided as-is for learning purposes.

---

## 🤝 Support & Questions

For detailed information about any aspect of this project, refer to:

- **[DOCUMENTATION.md](./documentation.md)** - Comprehensive technical documentation
- **API Docs** - Interactive Swagger UI at `/docs` endpoint
- **Inline Code Comments** - Well-documented source code

---

**Last Updated**: January 14, 2026
**Repository**: https://github.com/sammmms/devops-uts
