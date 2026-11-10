# 03 — Jenkins CI/CD and Security Report

## 1. Overview

The Student Management System uses Jenkins to automate the Spring Boot 4 migration test workflow.

The pipeline checks out source code, runs backend tests, builds the frontend, creates Docker images, scans images with Trivy, publishes images to Docker Hub and updates the Kubernetes test deployments.

The pipeline is defined in the repository's `Jenkinsfile`.

## 2. Pipeline Configuration

The pipeline includes:

- Timestamped build logs.
- Concurrent build prevention.
- A 45-minute timeout.
- Source checkout from the configured Git repository.
- Short Git commit SHA tags for generated images.
- Post-build cleanup of local CI images.

## 3. Pipeline Stages

| Stage | Description |
|---|---|
| Checkout SCM | Retrieves source code from Git |
| Verify Docker Access | Checks Docker client and daemon access |
| Backend Unit Tests | Runs Maven tests |
| Frontend Build | Installs npm dependencies and builds the frontend |
| Build Docker Images | Builds backend and frontend container images |
| Trivy Security Scan | Scans images for HIGH and CRITICAL vulnerabilities |
| Publish Docker Hub Images | Pushes commit-tagged images to Docker Hub |
| Deploy to Kubernetes Test | Updates backend and frontend deployments in `sms-boot4-test` |

## 4. Backend Automated Tests

The pipeline uses Maven with Eclipse Temurin Java 17.

The backend test command is:

`mvn -B clean test`

Jenkins Build #6 reported:

| Test class | Tests |
|---|---:|
| StudentRepositoryTest | 3 |
| StudentControllerTest | 7 |
| StudentServiceTest | 9 |
| Total | 19 |

All 19 tests passed, with zero failures, zero errors and zero skipped tests.

## 5. Frontend Build

The frontend pipeline uses Node.js 20.

The build commands are:

- `npm ci`
- `npm run build`

Build #6 completed the Vite production build successfully. The npm audit output reported zero vulnerabilities.

## 6. Docker Image Build and Publishing

The pipeline builds separate backend and frontend Docker images.

Docker Hub repositories:

- Backend: https://hub.docker.com/r/bunny2288h/student-management-system-backend
- Frontend: https://hub.docker.com/r/bunny2288h/student-management-system-frontend

Build #6 published these commit-tagged images:

| Component | Image tag |
|---|---|
| Backend | `bunny2288h/student-management-system-backend:db87756` |
| Frontend | `bunny2288h/student-management-system-frontend:db87756` |

The pipeline uses Jenkins credential ID `dockerhub-creds` for registry authentication. Credentials are not stored in the repository.

## 7. Trivy Image Security Scan

The pipeline uses Trivy version 0.76.2 to scan the backend and frontend Docker images.

The scan is configured to check:

- Vulnerability scanner: `vuln`
- Severity levels: `HIGH` and `CRITICAL`
- Exit code: `1` when vulnerabilities matching the configured severity are found.

Build #6 reported:

| Image | HIGH vulnerabilities | CRITICAL vulnerabilities |
|---|---:|---:|
| Backend | 0 | 0 |
| Frontend | 0 | 0 |

These results apply to the configured HIGH and CRITICAL scan scope. They do not establish that the images contain no vulnerabilities at MEDIUM or LOW severity.

## 8. Kubernetes Test Deployment

After publishing the images, Jenkins updates the backend and frontend Deployments in the `sms-boot4-test` namespace.

The pipeline:

1. Uses the Jenkins Kubernetes configuration.
2. Updates the backend image to the current commit tag.
3. Updates the frontend image to the current commit tag.
4. Waits for both Deployments to complete their rollouts.
5. Uses a rollout timeout of 180 seconds.

The pipeline does not update the MySQL Deployment or modify the original Docker Compose application.

## 9. Jenkins Build #6 Result

| Item | Verified result |
|---|---|
| Job | `sms-boot4-migration-ci` |
| Branch | `security/spring-boot-4-migration` |
| Commit | `db8775659e8ae8b0b626617b54aa9713166a3246` |
| Commit message | `feat: add isolated Spring Boot 4 Kubernetes manifests` |
| Backend tests | 19 passed |
| Frontend build | Successful |
| Trivy scan | 0 HIGH/CRITICAL findings in both images |
| Docker Hub publishing | Successful |
| Kubernetes rollouts | Successful |
| Overall result | SUCCESS |

## 10. Security Notes and Future Improvements

- Docker Hub authentication uses the Jenkins credential ID `dockerhub-creds`.
- The pipeline uses `docker login --password-stdin` and runs `docker logout` after publishing.
- Jenkins reported a warning that Docker credentials were stored unencrypted in its Docker configuration file. A Docker credential helper can improve credential storage.
- Docker also reported a legacy builder deprecation warning. This did not cause Build #6 to fail.
- The Trivy results should be interpreted only within the configured HIGH and CRITICAL severity scope.

## 11. Conclusion

The Jenkins pipeline automates backend testing, frontend compilation, container image creation, vulnerability scanning, image publishing and isolated Kubernetes deployment.

Build #6 completed successfully, demonstrating the Spring Boot 4 migration test workflow without replacing the original application deployment.

-----
