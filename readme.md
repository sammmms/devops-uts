# Todo App – Kubernetes & CI/CD

A simple Todo application consisting of a **frontend** and **backend** service, containerized and deployed using **Kubernetes**, with an automated **CI/CD pipeline** using GitHub Actions.

This project was developed as part of a **DevOps / Cloud Computing** course assignment.

---

## 🧩 Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Python (Flask / FastAPI)
- **Containerization**: Podman
- **Orchestration**: Kubernetes (k3s)
- **CI/CD**: GitHub Actions
- **Infrastructure**: DigitalOcean VPS

---

## 🚀 Architecture Overview

- Frontend and backend are deployed as separate Kubernetes Deployments
- Services are exposed using Kubernetes Services (NodePort)
- Backend supports Horizontal Pod Autoscaling (HPA)
- Automated CI/CD pipeline:
  - Build container images
  - Push to Docker Hub
  - Deploy to Kubernetes via SSH

---

## ⚙️ CI/CD Workflow

Every push to the `master` branch triggers the following pipeline:

1. Build backend and frontend container images
2. Push images to Docker Hub
3. Deploy updated manifests to Kubernetes using `kubectl apply`

The pipeline is defined in: `.github/workflows/ci-cd.yml`

---

## ☸️ Kubernetes Deployment

Kubernetes manifests are located in the `k8s/` directory:

```
k8s/
├─ backend-deploy.yaml
├─ backend-svc.yaml
├─ frontend-deploy.yaml
├─ frontend-svc.yaml
├─ hpa-backend.yaml
```

### Accessing the Application

- **Frontend**: `http://146.190.82.217:30003`
- **Backend API**: `http://146.190.82.217:30005`

---

## 📈 Autoscaling

The backend service uses **Horizontal Pod Autoscaler (HPA)** based on CPU utilization.

- **Minimum replicas**: 2
- **Maximum replicas**: 3
- **Target CPU utilization**: 60%

Metrics are collected using Kubernetes Metrics Server.

---

## 🧪 Monitoring

Basic monitoring is performed using:

- `kubectl top pods`
- `kubectl top nodes`

This lightweight approach is chosen due to limited VPS resources.

---

## 🧑‍💻 Local Development (Optional)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on: `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`
