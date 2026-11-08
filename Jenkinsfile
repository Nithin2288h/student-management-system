pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
        timestamps()
        skipDefaultCheckout(true)
    }

    environment {
        TRIVY_CACHE = '/var/lib/jenkins/.cache/trivy'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    env.SHORT_SHA = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    env.BACKEND_IMAGE = "sms-backend:ci-${env.SHORT_SHA}"
                    env.FRONTEND_IMAGE = "sms-frontend:ci-${env.SHORT_SHA}"
                }
            }
        }

        stage('Verify Docker Access') {
            steps {
                sh 'docker version && docker info >/dev/null'
            }
        }

        stage('Backend Unit Tests') {
            steps {
                sh '''
                    set -eu

                    mkdir -p "$WORKSPACE/.m2"

                    docker run --rm \
                      -v "$WORKSPACE/backend:/workspace" \
                      -v "$WORKSPACE/.m2:/root/.m2" \
                      -w /workspace \
                      maven:3.9.6-eclipse-temurin-17-alpine \
                      mvn -B clean test
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                      -v "$WORKSPACE/frontend:/workspace" \
                      -w /workspace \
                      node:20-alpine \
                      sh -c 'npm ci && npm run build'
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    set -eu

                    docker build -t "$BACKEND_IMAGE" ./backend
                    docker build -t "$FRONTEND_IMAGE" ./frontend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    set -eu

                    mkdir -p "$TRIVY_CACHE"

                    for IMAGE in "$BACKEND_IMAGE" "$FRONTEND_IMAGE"; do
                        echo "Scanning $IMAGE"

                        docker run --rm \
                          -v /var/run/docker.sock:/var/run/docker.sock \
                          -v "$TRIVY_CACHE:/root/.cache/trivy" \
                          aquasec/trivy:0.76.2 \
                          image \
                          --cache-dir /root/.cache/trivy \
                          --scanners vuln \
                          --severity HIGH,CRITICAL \
                          --exit-code 1 \
                          "$IMAGE"
                    done
                '''
            }
        }

        stage('Publish Docker Hub Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKERHUB_USERNAME',
                    passwordVariable: 'DOCKERHUB_TOKEN'
                )]) {
                    sh '''
                        set -eu

                        if [ "$DOCKERHUB_USERNAME" != "bunny2288h" ]; then
                            echo "ERROR: Unexpected Docker Hub username."
                            exit 1
                        fi

                        BACKEND_REPO="bunny2288h/student-management-system-backend"
                        FRONTEND_REPO="bunny2288h/student-management-system-frontend"

                        BACKEND_TAG="${BACKEND_REPO}:${SHORT_SHA}"
                        FRONTEND_TAG="${FRONTEND_REPO}:${SHORT_SHA}"

                        echo "$DOCKERHUB_TOKEN" | docker login \
                          --username "$DOCKERHUB_USERNAME" \
                          --password-stdin

                        trap 'docker logout >/dev/null 2>&1 || true' EXIT

                        docker tag "$BACKEND_IMAGE" "$BACKEND_TAG"
                        docker tag "$FRONTEND_IMAGE" "$FRONTEND_TAG"

                        docker push "$BACKEND_TAG"
                        docker push "$FRONTEND_TAG"

                        docker image rm "$BACKEND_TAG" "$FRONTEND_TAG" || true
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes Test') {
            steps {
                sh '''
                    set -eu

                    export KUBECONFIG=/var/lib/jenkins/.kube/config
                    KUBECTL=/usr/local/bin/kubectl
                    NAMESPACE="sms-boot4-test"

                    BACKEND_IMAGE="bunny2288h/student-management-system-backend:${SHORT_SHA}"
                    FRONTEND_IMAGE="bunny2288h/student-management-system-frontend:${SHORT_SHA}"

                    echo "Deploying commit ${SHORT_SHA} to ${NAMESPACE}"

                    "$KUBECTL" set image deployment/backend \
                      backend="$BACKEND_IMAGE" -n "$NAMESPACE"

                    "$KUBECTL" set image deployment/frontend \
                      frontend="$FRONTEND_IMAGE" -n "$NAMESPACE"

                    "$KUBECTL" rollout status deployment/backend \
                      -n "$NAMESPACE" --timeout=180s

                    "$KUBECTL" rollout status deployment/frontend \
                      -n "$NAMESPACE" --timeout=180s

                    echo "===== DEPLOYED IMAGES ====="
                    "$KUBECTL" get deployments -n "$NAMESPACE" \
                      -o custom-columns='NAME:.metadata.name,IMAGE:.spec.template.spec.containers[0].image'
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker image rm -f \
                  "${BACKEND_IMAGE:-sms-backend:missing}" \
                  "${FRONTEND_IMAGE:-sms-frontend:missing}" \
                  2>/dev/null || true
            '''
        }

        success {
            echo 'SMS Spring Boot 4 migration CI completed successfully.'
        }

        failure {
            echo 'CI failed. Review the failed stage logs.'
        }
    }
}
