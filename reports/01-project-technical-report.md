# 01 — Student Management System: Project Technical Report

## 1. Project Overview

The Student Management System (SMS) is a web application designed to manage student records through a browser-based interface and a REST API.

The project uses a React frontend, a Spring Boot backend and a MySQL relational database. It is containerized with Docker and deployed on AWS infrastructure.

The repository also contains an isolated Spring Boot 4 migration and Kubernetes CI/CD test environment. This environment is used to validate the migration and deployment workflow without replacing the original application.

## 2. Objectives

- Provide a web interface for managing student records.
- Expose backend functionality through REST APIs.
- Store application data in MySQL.
- Package application components using Docker.
- Deploy and operate the application on AWS EC2.
- Practice Kubernetes deployment and persistent storage.
- Automate build, test, security scanning and deployment through Jenkins.

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, HTML, CSS |
| Backend | Java, Spring Boot, Maven |
| Database | MySQL |
| Containerization | Docker, Docker Compose |
| Orchestration test environment | Kubernetes, K3s |
| CI/CD | Jenkins |
| Image security scanning | Trivy |
| Image registry | Docker Hub |
| Cloud infrastructure | AWS EC2 |

## 4. Application Architecture

The application follows a three-tier architecture.

### Frontend

The React application provides the user interface for student record operations. It communicates with backend REST endpoints.

### Backend

The Spring Boot application handles HTTP requests, application logic and database operations. Its layered structure separates controller, service and repository responsibilities.

### Database

MySQL stores student records. The database is accessed by the backend and is not intended to be exposed publicly.

## 5. Original Docker Compose Deployment

The original deployment runs three services:

| Service | Container | Role |
|---|---|---|
| Frontend | sms-frontend | Serves the web interface |
| Backend | sms-backend | Provides REST APIs |
| MySQL | sms-mysql | Stores student data |

Docker Compose manages the containers and their application network.

The database uses a persistent Docker volume named `sms_mysql_data`, so its data is stored separately from the lifecycle of the database container.

The original deployment is the preserved baseline and must not be replaced by the migration test environment without explicit verification and approval.

## 6. Spring Boot 4 Kubernetes Migration Environment

A separate Kubernetes environment was created in the namespace `sms-boot4-test`.

It contains independent frontend, backend and MySQL workloads, with a dedicated database PVC and services.

The environment is intended for migration and CI/CD validation. It does not replace or receive a production traffic cutover from the original Docker Compose deployment.

The Jenkins pipeline updates only the frontend and backend deployments in this test namespace.

## 7. Deployment and Security Principles

- Keep the original application and its database separate from migration testing.
- Use Kubernetes Secrets for database configuration.
- Use persistent storage for the Kubernetes test database.
- Keep database services internal to their respective deployment networks.
- Apply CPU and memory requests and limits to Kubernetes containers.
- Use health probes to check application availability.
- Scan container images for HIGH and CRITICAL vulnerabilities in the CI pipeline.
- Keep credentials, private keys and environment files out of Git.

## 8. Repository Structure

Important project files and directories include:

| Path | Purpose |
|---|---|
| `README.md` | Main project documentation |
| `PROJECT_REPORT.md` | Academic project report |
| `Jenkinsfile` | CI/CD pipeline definition |
| `backend/` | Spring Boot backend source |
| `frontend/` | React frontend source |
| `k8s/boot4-test/` | Kubernetes migration test manifests |
| `reports/` | Supplementary technical reports |
----------------------------------------------------
## 9. Conclusion

The project demonstrates full-stack application development, containerization, cloud deployment and DevOps practices.

The isolated Spring Boot 4 Kubernetes environment provides a controlled way to validate automated testing, image security scanning and Kubernetes deployment while preserving the original Docker Compose application and its database.
