# ==============================================================================
# Multi-Stage Dockerfile for Spring Boot Backend
# Stage 1: Build Application JAR with Maven & OpenJDK 17
# Stage 2: Minimal, Secure JRE Runtime with Non-Root User
# ==============================================================================

# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy application source code and package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Production JRE runtime
FROM eclipse-temurin:17-jre-alpine

# Install curl for container health check
RUN apk add --no-cache curl

# Create non-root system group and user for security compliance
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy executable jar from builder stage
COPY --from=builder /build/target/student-management-system-1.0.0.jar app.jar

# Set ownership to non-root user
RUN chown -R spring:spring /app

# Switch to unprivileged user
USER spring:spring

# Expose backend internal port
EXPOSE 8080

# Environment variables with sensible defaults
ENV DB_HOST=mysql \
    DB_PORT=3306 \
    DB_NAME=student_db \
    DB_USERNAME=student_user \
    DB_PASSWORD=student_pass

# Container healthcheck using backend health REST endpoint
HEALTHCHECK --interval=20s --timeout=5s --start-period=35s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Launch Spring Boot Application
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
