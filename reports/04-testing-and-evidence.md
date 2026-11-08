# 04 — Testing and Deployment Evidence Report

## 1. Purpose

This report records the automated test results, container security scan results, Docker Hub publishing, Kubernetes runtime checks and original application baseline verification for the Student Management System.

The results below reflect the verification performed on November 8, 2026.

## 2. Backend Test Results

Jenkins Build #6 executed the backend Maven test suite.

| Test class | Tests |
|---|---:|
| StudentRepositoryTest | 3 |
| StudentControllerTest | 7 |
| StudentServiceTest | 9 |
| Total | 19 |

Result: 19 passed, 0 failures, 0 errors and 0 skipped.

## 3. Frontend Build Results

- Node.js version: 20.
- Dependency installation: `npm ci`.
- Production build: `npm run build`.
- Vite production build: successful.
- npm audit: zero reported vulnerabilities.

## 4. Container Security Scan

Trivy version 0.76.2 scanned the backend and frontend images for HIGH and CRITICAL vulnerabilities.

| Image | HIGH | CRITICAL |
|---|---:|---:|
| Backend | 0 | 0 |
| Frontend | 0 | 0 |

These results describe only the configured HIGH and CRITICAL severity scan.

## 5. Docker Hub Publishing

Jenkins Build #6 successfully published:

- `bunny2288h/student-management-system-backend:db87756`
- `bunny2288h/student-management-system-frontend:db87756`

The images are published to the project's Docker Hub repositories.

## 6. Kubernetes Runtime Verification

The isolated namespace is `sms-boot4-test`.

At the time of verification:

| Deployment | Ready replicas |
|---|---:|
| Backend | 1/1 |
| Frontend | 1/1 |
| MySQL | 1/1 |

All three pods were Running. The MySQL persistent volume claim `mysql-boot4-pvc` was Bound with a capacity of 1Gi.

## 7. Application Health Check

The backend health endpoint was tested through the frontend Nginx proxy:

`/api/health`

The response reported:

- Application status: `UP`.
- Database status: `CONNECTED`.
- Service: Student Management System Backend.

## 8. CRUD Verification

CRUD operations were tested through the frontend proxy against the isolated Kubernetes test environment:

1. Create a student using POST.
2. Retrieve student records using GET.
3. Update a student using PUT.
4. Retrieve records again to verify the update.
5. Delete the test record using DELETE.

The test database student count was zero after cleanup. This test was performed against the isolated migration environment, not the original application database.

## 9. Original Docker Compose Baseline

The original Docker Compose application was preserved during the Spring Boot 4 migration work.

At the last recorded verification:

- Frontend, backend and MySQL Compose services were healthy.
- The original backend health endpoint reported `UP`.
- The original database connection reported `CONNECTED`.
- The original `students` table contained five records.

The isolated Kubernetes pipeline did not replace the original Compose services or database.

## 10. Suggested Evidence Screenshots

The following screenshots can be collected for project submission:

- Jenkins Build #6 successful console output.
- Backend test summary showing 19 passing tests.
- Frontend production build result.
- Trivy backend and frontend scan summaries.
- Docker Hub repositories showing the `db87756` tags.
- Kubernetes Deployments and pod status in `sms-boot4-test`.
- MySQL PVC showing Bound status.
- Application health endpoint response.
- CRUD API verification.
- Original Docker Compose service and health status.

Screenshots should be captured from the actual Jenkins, Docker Hub and EC2 environment. No screenshots are represented as attached to this report.

## 11. Conclusion

The recorded results demonstrate successful backend testing, frontend compilation, container security scanning, Docker Hub publishing, isolated Kubernetes deployment, health verification and CRUD testing.

The original Docker Compose application remains a separate baseline, preserving the existing deployment while the Spring Boot 4 migration is evaluated.
