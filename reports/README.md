# Student Management System — Technical Reports

Supplementary documentation for the Student Management System (SMS), covering the original Docker Compose application and the isolated Spring Boot 4 Kubernetes migration.

## Reports

1. [Project Technical Report](01-project-technical-report.md)
2. [Kubernetes Deployment Report](02-kubernetes-deployment-report.md)
3. [Jenkins CI/CD and Security Report](03-jenkins-cicd-security-report.md)
4. [Testing and Evidence](04-testing-and-evidence.md)

## Deployment separation

The original Docker Compose application and its MySQL data are preserved. The Spring Boot 4 migration runs separately in the Kubernetes namespace `sms-boot4-test`.

The Jenkins pipeline updates only the backend and frontend deployments in `sms-boot4-test`. It does not replace the original Docker Compose deployment.

## Repository references

- [Main README](../README.md)
- [Academic Project Report](../PROJECT_REPORT.md)
- [Jenkinsfile](../Jenkinsfile)
- [Kubernetes manifests](../k8s/boot4-test/)

## Documentation accuracy

This documentation distinguishes repository configuration from live deployment observations and Jenkins Build #6 results. Runtime status describes the time of verification and is not a guarantee of future availability.

Never commit credentials, passwords, private keys, `.env` contents, or database secrets.
