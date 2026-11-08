# 02 — Kubernetes Deployment Report

## 1. Overview

The Student Management System includes an isolated Kubernetes environment for testing the Spring Boot 4 migration.

The test environment runs in the namespace `sms-boot4-test`. It is separate from the original Docker Compose deployment and its MySQL database.

## 2. Kubernetes Environment

The Kubernetes test environment uses K3s.

| Component | Configuration |
|---|---|
| Namespace | `sms-boot4-test` |
| Container runtime | Containerd through K3s |
| Workloads | Frontend, backend and MySQL |
| Image registry | Docker Hub |
| Persistent storage | Kubernetes PersistentVolumeClaim |
| Service exposure | ClusterIP |

## 3. Kubernetes Manifests

The manifests are stored in `k8s/boot4-test/`.

| Manifest | Purpose |
|---|---|
| `namespace.yaml` | Creates the isolated test namespace |
| `backend-deployment.yaml` | Defines the backend workload |
| `backend-service.yaml` | Provides internal backend access |
| `frontend-deployment.yaml` | Defines the frontend workload |
| `frontend-service.yaml` | Provides internal frontend access |
| `mysql-deployment.yaml` | Defines the MySQL workload |
| `mysql-service.yaml` | Provides internal database access |
| `mysql-pvc.yaml` | Requests persistent database storage |

## 4. Workloads and Container Images

The namespace contains three Deployments:

| Deployment | Container image |
|---|---|
| Backend | `bunny2288h/student-management-system-backend` |
| Frontend | `bunny2288h/student-management-system-frontend` |
| MySQL | `mysql:8.0` |

The repository manifests contain `aefc798` as the default tag for the backend and frontend images.

Jenkins Build #6 subsequently published and deployed the backend and frontend images tagged `db87756`. The live workload image tags observed during verification were therefore `db87756`.

The manifest defaults and the observed live deployment versions are intentionally documented separately.

## 5. Services and Network Access

The frontend, backend and MySQL services use the Kubernetes `ClusterIP` service type.

This provides internal service discovery and communication within the cluster. The MySQL service is not configured as a public-facing service.

The frontend uses its Nginx configuration to proxy API requests to the backend.

## 6. Persistent Database Storage

The Kubernetes MySQL workload uses the PersistentVolumeClaim:

- PVC name: `mysql-boot4-pvc`
- Requested capacity: `1Gi`
- Access mode: `ReadWriteOnce`
- Storage class: `local-path`
- Mount path: `/var/lib/mysql`

The PVC was observed in the `Bound` state during verification.

This storage belongs to the Kubernetes test database and is separate from the original Docker Compose volume `sms_mysql_data`.

## 7. Health Probes

### Backend

The backend deployment defines:

- Startup probe: HTTP GET `/api/health`, port `8080`.
- Readiness probe: HTTP GET `/api/health`, port `8080`.
- Liveness probe: HTTP GET `/api/health`, port `8080`.

### Frontend

The frontend deployment defines:

- Readiness probe: HTTP GET `/`, port `80`.
- Liveness probe: HTTP GET `/`, port `80`.

### MySQL

The MySQL deployment defines a readiness probe using `mysqladmin ping` against the local database server.

These probes allow Kubernetes to assess container startup and workload health.

## 8. Container Resource Requests and Limits

The repository manifests define the following container resources:

| Workload | CPU request | Memory request | CPU limit | Memory limit |
|---|---:|---:|---:|---:|
| Backend | 100m | 256Mi | 500m | 768Mi |
| Frontend | 50m | 64Mi | 200m | 128Mi |
| MySQL | 100m | 256Mi | 500m | 512Mi |

Requests specify the resources Kubernetes uses for scheduling. Limits specify the maximum CPU and memory available to each container.

## 9. Runtime Verification

During the November 8, 2026 verification:

- Backend, frontend and MySQL Deployments each reported one ready replica.
- All three application pods were observed in the `Running` state.
- The MySQL PVC was `Bound`.
- The backend health endpoint returned `UP` and database status `CONNECTED`.
- The frontend API proxy successfully returned the backend health response.

These observations describe the environment at the time of verification.

## 10. Deployment Isolation

The namespace `sms-boot4-test` isolates the Spring Boot 4 migration workloads from the original Docker Compose application.

The Jenkins pipeline updates only the backend and frontend Deployments in this namespace. It does not replace the MySQL Deployment, modify the original Compose services or perform a production traffic cutover.

## 11. Conclusion

The Kubernetes environment demonstrates workload orchestration, service discovery, persistent storage, health probes and container resource management.

Keeping the migration deployment isolated provides a controlled way to test the new application and its CI/CD process while preserving the original application baseline.
