#!/bin/bash

# Config Vault Docker Manager
# Usage: ./docker-manager.sh [command]

set -e

show_help() {
    echo "Config Vault Docker Manager"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Development Commands:"
    echo "  dev-start     Start development environment"
    echo "  dev-stop      Stop development environment"
    echo "  dev-restart   Restart development environment"
    echo "  dev-logs      View development logs"
    echo "  dev-build     Rebuild development containers"
    echo ""
    echo "Production Commands:"
    echo "  prod-start    Start production environment"
    echo "  prod-stop     Stop production environment"
    echo "  prod-restart  Restart production environment"
    echo "  prod-logs     View production logs"
    echo "  prod-build    Rebuild production containers"
    echo ""
    echo "Utility Commands:"
    echo "  clean         Clean all containers and volumes (CAUTION!)"
    echo "  status        Show running containers"
    echo "  help          Show this help message"
}

# Development commands
dev_start() {
    echo "🚀 Starting development environment..."
    docker-compose up -d
    echo "✅ Development environment started!"
    echo "   Client: http://localhost:3000"
    echo "   Server: http://localhost:4000"
}

dev_stop() {
    echo "🛑 Stopping development environment..."
    docker-compose down
    echo "✅ Development environment stopped!"
}

dev_restart() {
    echo "🔄 Restarting development environment..."
    docker-compose down
    docker-compose up -d
    echo "✅ Development environment restarted!"
}

dev_logs() {
    echo "📋 Viewing development logs..."
    docker-compose logs -f
}

dev_build() {
    echo "🔨 Rebuilding development containers..."
    docker-compose up --build -d
    echo "✅ Development containers rebuilt!"
}

# Production commands
prod_start() {
    echo "🚀 Starting production environment..."
    docker-compose -f docker-compose.prod.yml up -d
    echo "✅ Production environment started!"
    echo "   Client: http://localhost:3000"
    echo "   Server: http://localhost:4000"
}

prod_stop() {
    echo "🛑 Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    echo "✅ Production environment stopped!"
}

prod_restart() {
    echo "🔄 Restarting production environment..."
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up -d
    echo "✅ Production environment restarted!"
}

prod_logs() {
    echo "📋 Viewing production logs..."
    docker-compose -f docker-compose.prod.yml logs -f
}

prod_build() {
    echo "🔨 Rebuilding production containers..."
    docker-compose -f docker-compose.prod.yml up --build -d
    echo "✅ Production containers rebuilt!"
}

# Utility commands
clean() {
    echo "⚠️  WARNING: This will remove all containers and volumes!"
    read -p "Are you sure? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🧹 Cleaning all containers and volumes..."
        docker-compose down -v
        docker-compose -f docker-compose.prod.yml down -v
        docker system prune -f
        echo "✅ Cleanup completed!"
    else
        echo "❌ Cleanup cancelled."
    fi
}

status() {
    echo "📊 Docker container status:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

# Main command handler
case ${1:-help} in
    dev-start)
        dev_start
        ;;
    dev-stop)
        dev_stop
        ;;
    dev-restart)
        dev_restart
        ;;
    dev-logs)
        dev_logs
        ;;
    dev-build)
        dev_build
        ;;
    prod-start)
        prod_start
        ;;
    prod-stop)
        prod_stop
        ;;
    prod-restart)
        prod_restart
        ;;
    prod-logs)
        prod_logs
        ;;
    prod-build)
        prod_build
        ;;
    clean)
        clean
        ;;
    status)
        status
        ;;
    help|*)
        show_help
        ;;
esac
