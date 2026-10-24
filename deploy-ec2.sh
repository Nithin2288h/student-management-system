#!/usr/bin/env bash
# ==============================================================================
# AWS EC2 One-Click Deployment Script for Student Management System
# Supported OS: Ubuntu 22.04 LTS / 24.04 LTS
# Course: AWS DevOps Credit Completion
# ==============================================================================

set -euo pipefail

echo "=========================================================="
echo " Starting Student Management System AWS Deployment"
echo "=========================================================="

# 1. Update system packages
echo "--> [1/7] Updating package index..."
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw

# 2. Install official Docker Engine & Docker Compose Plugin
if ! command -v docker &> /dev/null; then
    echo "--> [2/7] Installing Docker Engine..."
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Enable and start Docker service
    sudo systemctl enable docker
    sudo systemctl start docker

    # Add current user to docker group
    sudo usermod -aG docker "$USER"
    echo "Docker installed successfully."
else
    echo "--> [2/7] Docker is already installed: $(docker --version)"
fi

# 3. Configure UFW Firewall (Least Privilege)
echo "--> [3/7] Configuring UFW Firewall..."
sudo ufw allow 22/tcp comment 'SSH Access' || true
sudo ufw allow 80/tcp comment 'HTTP Web Application' || true
# Ensure MySQL port 3306 is NOT allowed publicly
sudo ufw deny 3306/tcp comment 'Block MySQL from Public' || true
sudo ufw --force enable || true

# 4. Prepare Environment Configuration (.env)
echo "--> [4/7] Checking environment configuration..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "Creating .env from .env.example with secure random passwords..."
        cp .env.example .env
        ROOT_PASS=$(openssl rand -hex 16)
        USER_PASS=$(openssl rand -hex 16)
        sed -i "s/change_this_root_secure_password/${ROOT_PASS}/" .env
        sed -i "s/change_this_student_db_password/${USER_PASS}/" .env
        echo "Generated production secrets into .env"
    else
        echo "ERROR: .env.example not found!"
        exit 1
    fi
fi

# 5. Build and Launch Containers with Docker Compose
echo "--> [5/7] Building and starting containers..."
sudo docker compose down || true
sudo docker compose up --build -d

# 6. Verify Service Status
echo "--> [6/7] Waiting for containers to become healthy..."
sleep 15
sudo docker compose ps

# 7. Health Check
echo "--> [7/7] Testing application health..."
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "FAILED")

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || curl -s ifconfig.me || echo "your-ec2-ip")

echo "=========================================================="
if [ "$HEALTH_STATUS" = "200" ]; then
    echo " SUCCESS: Application is ONLINE and healthy!"
    echo " Access the Web Application at: http://${PUBLIC_IP}"
    echo " API Health Check:             http://${PUBLIC_IP}/api/health"
else
    echo " Container startup in progress (HTTP $HEALTH_STATUS)."
    echo " Check logs using: sudo docker compose logs -f"
    echo " Once ready, access at: http://${PUBLIC_IP}"
fi
echo "=========================================================="
