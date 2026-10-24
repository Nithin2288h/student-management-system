#!/usr/bin/env bash
# ==============================================================================
# MySQL Database Backup and Restoration Utility Script
# Student Management System - AWS DevOps
# ==============================================================================

set -euo pipefail

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="sms-mysql"
DB_NAME="${DB_NAME:-student_db}"
MYSQL_ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-root_secure_password}"

mkdir -p "$BACKUP_DIR"

function show_usage() {
    echo "Usage: $0 {backup|restore <file.sql>|list}"
    echo "  backup               - Dumps current database to backups/ directory"
    echo "  restore <file.sql>   - Restores database from a given SQL dump file"
    echo "  list                 - Lists all available backups"
    exit 1
}

function backup_db() {
    local backup_file="${BACKUP_DIR}/student_db_backup_${TIMESTAMP}.sql"
    echo "Creating backup for database '${DB_NAME}' from container '${CONTAINER_NAME}'..."
    docker exec -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" "${CONTAINER_NAME}" \
        mysqldump -u root --single-transaction --quick "${DB_NAME}" > "${backup_file}"
    echo "Backup completed successfully: ${backup_file} ($(du -h "${backup_file}" | cut -f1))"
}

function restore_db() {
    local sql_file="$1"
    if [ ! -f "$sql_file" ]; then
        echo "Error: Backup file '$sql_file' does not exist."
        exit 1
    fi
    echo "Restoring database '${DB_NAME}' from '$sql_file'..."
    docker exec -i -e MYSQL_PWD="${MYSQL_ROOT_PASSWORD}" "${CONTAINER_NAME}" \
        mysql -u root "${DB_NAME}" < "$sql_file"
    echo "Database restoration completed successfully."
}

function list_backups() {
    echo "Available SQL backups in '${BACKUP_DIR}':"
    ls -lh "${BACKUP_DIR}"/*.sql 2>/dev/null || echo "No backups found."
}

case "${1:-}" in
    backup)
        backup_db
        ;;
    restore)
        if [ -z "${2:-}" ]; then
            echo "Error: Please specify the SQL file to restore."
            show_usage
        fi
        restore_db "$2"
        ;;
    list)
        list_backups
        ;;
    *)
        show_usage
        ;;
esac
