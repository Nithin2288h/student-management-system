# ACADEMIC PROJECT REPORT
## Student Management System Using React, Spring Boot, MySQL, Docker, Docker Compose, and AWS EC2

**Course:** AWS DevOps Credit Completion  
**Project Category:** Cloud & Containerized Full-Stack Web Development  
**Academic Year:** 2026  
**Status:** Implementation Complete | Automated Tests Passed (19/19) | Cloud Ready

---

## 1. Abstract

The modern educational landscape requires reliable, secure, and easily maintainable data management solutions. The **Student Management System (SMS)** presented in this project is a production-ready, cloud-native full-stack application developed for the AWS DevOps course credit completion. Built with a decoupled microservice architecture consisting of a React Single Page Application (SPA), a Java Spring Boot RESTful API backend, a MySQL 8 relational database, and an Nginx reverse proxy, the system is fully containerized using Docker and orchestrated with Docker Compose. This report details the design principles, architectural workflows, implementation layers, automated testing suite (achieving 100% test pass rate across 19 unit and integration tests), and deployment specifications on Amazon Web Services (AWS) Elastic Compute Cloud (EC2).

---

## 2. Introduction & Background

DevOps methodologies emphasize the integration of software development (Dev) and IT operations (Ops) through automated workflows, continuous integration, containerization, and infrastructure as code. Traditional monolithic student record applications often suffer from deployment friction, environment divergence, and data fragmentation. 

Containerization with Docker isolates applications from their underlying host environment, ensuring identical runtime behavior across developer workstations and cloud platforms. By deploying multi-container systems on cloud infrastructure such as AWS EC2, educational organizations can ensure high availability, horizontal scalability, and cost efficiency.

---

## 3. Problem Statement

Academic institutions often struggle with:
1. **Data Inconsistency & Collisions**: Disorganized registration systems allow duplicate student roll numbers and email collisions.
2. **Environment Inconsistency**: Disparities between local developer machines and production servers cause runtime failures.
3. **Security Vulnerabilities**: Databases and backends are often directly exposed to the public internet without proper proxy buffering or least-privilege firewall rules.
4. **Maintenance Overhead**: Complex manual setup processes impede swift disaster recovery and cloud portability.

---

## 4. Project Objectives

- Design an intuitive, aesthetically modern user interface with real-time feedback, KPI statistics, search, and responsive CRUD operations.
- Build an enterprise-grade backend adhering to strict separation of concerns (Controller, Service, Repository, Exception Handling, Configuration).
- Enforce strict database validation, unique constraints, and safe schema evolution using Hibernate and MySQL 8.
- Establish Docker multi-stage build patterns for optimal image size and vulnerability reduction.
- Orchestrate multi-container networking where only the reverse proxy is publicly exposed.
- Formulate a reproducible deployment pipeline for AWS EC2 Ubuntu instances.

---

## 5. Technology Stack Summary

| Layer | Component | Selected Technology | Version |
| :--- | :--- | :--- | :--- |
| **Frontend** | Framework & UI | React + Vanilla CSS (Custom Design System) | 18.3.1 |
| **Tooling** | Bundler & Dev Server | Vite | 5.4.2 |
| **Reverse Proxy** | Web Server & Gateway | Nginx Alpine | 1.27 |
| **Backend** | Application Framework | Java Spring Boot | 3.3.4 |
| **Language** | Platform Runtime | Java (JDK/JRE) | 17 LTS / 21 LTS |
| **Build Tool** | Dependency Manager | Apache Maven | 3.9.6 |
| **ORM / Data** | Object Relational Mapping | Spring Data JPA / Hibernate | 6.5.3 |
| **Database** | Relational Database | MySQL Server | 8.0 |
| **Containers** | Containerization | Docker Engine | 24+ / 27+ |
| **Orchestration**| Multi-Container Tool | Docker Compose | 2.20+ |
| **Cloud Hosting**| Virtual Machine Server | AWS EC2 (Ubuntu 22.04 LTS) | - |

---

## 6. System Architecture & Component Interaction

```
                       [ USER WEB BROWSER ]
                                 │
                                 │ HTTP (Port 80)
                                 ▼
         ┌──────────────────────────────────────────────────┐
         │             AWS EC2 LINUX HOST                   │
         │                                                  │
         │  ┌────────────────────────────────────────────┐  │
         │  │    Docker Bridge Network (sms_app_network) │  │
         │  │                                            │  │
         │  │   ┌─────────────────────────────────────┐  │  │
         │  │   │  sms-frontend Container (Port 80)   │  │  │
         │  │   │  - Nginx Reverse Proxy              │  │  │
         │  │   │  - React Production Assets (SPA)    │  │  │
         │  │   └──────────────────┬──────────────────┘  │  │
         │  │                      │                     │  │
         │  │                      │ Proxy /api/ to      │  │
         │  │                      │ http://backend:8080 │  │
         │  │                      ▼                     │  │
         │  │   ┌─────────────────────────────────────┐  │  │
         │  │   │   sms-backend Container (Port 8080) │  │  │
         │  │   │   - Spring Boot 3 REST Application  │  │  │
         │  │   │   - Unprivileged Non-Root User      │  │  │
         │  │   └──────────────────┬──────────────────┘  │  │
         │  │                      │                     │  │
         │  │                      │ Internal TCP:3306   │  │
         │  │                      ▼                     │  │
         │  │   ┌─────────────────────────────────────┐  │  │
         │  │   │    sms-mysql Container (Port 3306)  │  │  │
         │  │   │    - MySQL 8 Relational Database    │  │  │
         │  │   │    - Healthcheck Polling            │  │  │
         │  │   └──────────────────┬──────────────────┘  │  │
         │  └──────────────────────┼─────────────────────┘  │
         │                         │                        │
         │                         ▼                        │
         │              [ Named Docker Volume ]             │
         │                 (sms_mysql_data)                 │
         └──────────────────────────────────────────────────┘
```

---

## 7. Implementation Highlights

### 7.1 Backend Layered Architecture
- **Entity (`Student.java`)**: Implements strict validation annotations (`@NotBlank`, `@Email`, `@Size`, `@Pattern`) and table-level unique constraints on `student_id` and `email`.
- **Repository (`StudentRepository.java`)**: Extends `JpaRepository` and introduces custom JPQL multi-field search query covering first name, last name, student ID, email, department, and course.
- **Service (`StudentServiceImpl.java`)**: Encapsulates business logic, duplicate checks, transaction management (`@Transactional`), and entity mapping.
- **Controller (`StudentController.java`)**: Exposes REST endpoints (`GET`, `POST`, `PUT`, `DELETE`), returning appropriate HTTP status codes (`200 OK`, `201 Created`, `204 No Content`).
- **Exception Handling (`GlobalExceptionHandler.java`)**: Maps uncaught domain exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, validation errors) into uniform JSON error payloads.

### 7.2 Frontend Single Page Application
- Built with React and structured into focused components (`StudentHeader`, `StudentStats`, `StudentTable`, `StudentModal`, `DeleteConfirmModal`, `NotificationToast`).
- Configured with modern design system tokens (CSS variables, dark theme, smooth micro-animations, glassmorphism).
- Integrated with dynamic API client (`studentService.js`) handling real backend communication without mock fallbacks.

### 7.3 Multi-Stage Containerization
- **Frontend Dockerfile**: Builds React bundle with Node 20, then serves assets using a clean Nginx 1.27 Alpine runtime (~25MB).
- **Backend Dockerfile**: Compiles Spring Boot application with Maven 3.9 and packages it into an Eclipse Temurin 17 JRE Alpine runtime (~180MB) executed by a non-root system user (`spring:spring`).

---

## 8. Verification & Genuine Test Results

The backend codebase was validated locally with automated unit and integration tests using Apache Maven and Java 25.

### Test Execution Summary:
- **Build Tool:** Apache Maven 3.9.6
- **Test Frameworks:** JUnit 5 (Jupiter), Spring Boot Test, Mockito, MockMvc, Spring Data JPA Test
- **Total Test Suites Executed:** 3
- **Total Tests Run:** 19
- **Failures:** 0
- **Errors:** 0
- **Skipped:** 0
- **Total Test Execution Time:** ~4.0 seconds
- **Result:** **BUILD SUCCESS**

### Detailed Test Results Breakdown:

| Test Class | Test Name / Scenario | Type | Result |
| :--- | :--- | :--- | :--- |
| `StudentServiceTest` | Create student when studentId and email are unique | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Throw `DuplicateResourceException` on duplicate registration ID | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Throw `DuplicateResourceException` on duplicate email address | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Retrieve student by ID | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Throw `ResourceNotFoundException` on missing ID | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Update existing student record successfully | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Delete student when ID exists | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Throw `ResourceNotFoundException` when deleting missing ID | Unit (Mockito) | **PASSED** |
| `StudentServiceTest` | Search students by keyword across fields | Unit (Mockito) | **PASSED** |
| `StudentControllerTest` | `GET /api/students` returns 200 OK with list | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `GET /api/students/{id}` returns 200 OK when found | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `GET /api/students/{id}` returns 404 NOT FOUND when missing | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `POST /api/students` returns 201 CREATED for valid payload | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `POST /api/students` returns 400 BAD REQUEST on invalid validation | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `POST /api/students` returns 409 CONFLICT on duplicate record | MockMvc Integration | **PASSED** |
| `StudentControllerTest` | `DELETE /api/students/{id}` returns 200 OK on deletion | MockMvc Integration | **PASSED** |
| `StudentRepositoryTest` | Save student, generate ID, and verify timestamp persistence | DataJpaTest (H2) | **PASSED** |
| `StudentRepositoryTest` | Verify `existsByStudentId` and `existsByEmail` queries | DataJpaTest (H2) | **PASSED** |
| `StudentRepositoryTest` | Search students across name, department, and course | DataJpaTest (H2) | **PASSED** |

### Frontend Build Verification:
- **Build Command:** `npm run build` (Vite 5.4.21)
- **Status:** **Exit Code 0 (SUCCESS)**
- **Modules Transformed:** 38 modules
- **Build Duration:** 736 ms
- **Production Artifacts Generated:** `dist/index.html`, `dist/assets/index-*.css`, `dist/assets/index-*.js`

---

## 9. AWS EC2 Cloud Deployment Details

### Target Cloud Configuration:
- **Cloud Provider:** Amazon Web Services (AWS)
- **Compute Service:** Amazon EC2
- **Operating System:** Ubuntu 22.04 LTS (x86_64)
- **Recommended Instance Type:** `t2.small` or `t3.small` (2 vCPU, 2 GiB RAM)
- **Security Group Configuration:**
  - Port `22` (TCP): Inbound restricted to student / admin IP address.
  - Port `80` (TCP): Inbound opened to `0.0.0.0/0` (public web access).
  - Port `3306` (MySQL): **Explicitly closed** from public inbound access.
  - Port `8080` (Backend): **Explicitly closed** from public inbound access.

### Deployment Automation:
The project includes a self-contained shell automation script `deploy-ec2.sh` that installs Docker, configures the local firewall, sets up `.env`, and launches the services with `docker compose up --build -d`.

---

## 10. Student Faculty Demonstration Checklist

During your project defense / viva presentation, follow this sequence:

| Step | Feature to Demonstrate | Expected Faculty Demonstration Observation |
| :--- | :--- | :--- |
| **1** | **Web Application Launch** | Show the dashboard running at `http://<EC2-IP>` or `http://localhost`. Point out the green status badge: **"Backend & DB Online"**. |
| **2** | **View Student List & KPIs** | Show the metrics at the top: Total Students, Departments, Active Courses, and Target Infrastructure (AWS EC2). |
| **3** | **Add Student (Validation)** | Click **"Add Student"**. First submit an empty form to show red field-level validation errors. Then enter valid data (e.g. `STU-2026-001`, Alice Smith, Computer Science, DevOps, phone) and submit. Show green success toast. |
| **4** | **Duplicate Rejection** | Attempt to add another student with the same Student Registration Number (`STU-2026-001`). Point out the HTTP 409 Conflict error toast: "Student registration number is already registered". |
| **5** | **Search Functionality** | Type a keyword (e.g., "DevOps" or "Alice") in the search bar. Show real-time filtering and the "filtered for" counter. Clear search. |
| **6** | **Update Student** | Click **"Edit"** on a student row. Change the department or course and save. Show updated table row and success notification. |
| **7** | **Delete with Confirmation** | Click **"Delete"**. Show the modal dialog asking for confirmation with the student's name and registration number. Confirm deletion and observe row removal. |
| **8** | **Database Persistence Test** | In the terminal, execute `docker compose down`. Show that containers have stopped. Then run `docker compose up -d`. Refresh the browser—demonstrate that student records persist intact from the named volume `sms_mysql_data`. |
| **9** | **Docker Containers & Architecture** | In terminal, run `docker compose ps` to show the 3 healthy containers (`sms-frontend`, `sms-backend`, `sms-mysql`). Point out that only port 80 is exposed publicly. |
| **10**| **Container Logs** | Run `docker compose logs --tail=20 backend` to show live Spring Boot execution logs and database queries. |

---

## 11. Screenshots Capture Checklist for Project Submission

For your formal submission document or presentation slide deck, capture the following screenshots:

1. **Dashboard Home View:** Showing the application title, architecture tech pills, KPI cards, and student records table.
2. **Add Student Form Modal:** Showing the registration dialog with all input fields.
3. **Form Validation Error State:** Showing the red error prompts when required fields are missing or email format is invalid.
4. **Duplicate Record Conflict Alert:** Showing the red toast notifying that the student ID or email is already registered.
5. **Search Results View:** Showing the search bar populated and table filtered by keyword.
6. **Edit Student Modal:** Showing pre-populated fields being modified.
7. **Delete Confirmation Dialog:** Showing the warning modal before deleting a student record.
8. **Docker Containers Status (`docker compose ps`):** Terminal screenshot showing `sms-frontend`, `sms-backend`, and `sms-mysql` running.
9. **Spring Boot Backend Logs (`docker compose logs backend`):** Terminal screenshot showing Spring Boot banner, Hibernate schema initialization, and REST endpoints.
10. **AWS EC2 Console:** Screenshot from AWS Management Console showing the running EC2 instance and Security Group inbound rules.

---

## 12. Conclusion

The **Student Management System** successfully accomplishes all requirements outlined in the AWS DevOps credit completion course. By decoupling the frontend, backend, and persistence tiers into isolated Docker containers and managing them through Docker Compose and Nginx, the project demonstrates contemporary industry practices in full-stack cloud engineering. The solution guarantees deterministic deployments, robust data persistence, strict data validation, and fortified network security.
