# Docker Setup for Betting Platform

This document describes how to use the Docker setup for the Betting Platform project.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Node.js and npm installed for running the application

## Services

The Docker Compose setup includes the following services:

1. **PostgreSQL**
   - External Port: 5433 (mapped to internal 5432)
   - Database: betting_platform
   - Username: betting_platform_user
   - Password: P@ssw0rd_S3cur3_DB_2024!

2. **Redis**
   - External Port: 6380 (mapped to internal 6379)
   - Password: Redis_S3cur3_P@ss_2024!

## Getting Started

1. Start the services:
   ```bash
   docker-compose up -d
   ```

2. Verify the services are running:
   ```bash
   docker-compose ps
   ```

3. The application is configured to connect to these services using the environment variables in the `.env` file.

## Connection Strings

The application uses the following connection strings to connect to the services:

- **PostgreSQL**: `postgresql://betting_platform_user:P@ssw0rd_S3cur3_DB_2024!@localhost:5433/betting_platform`
- **Redis**: `redis://:Redis_S3cur3_P@ss_2024!@localhost:6380`

## Stopping the Services

To stop the services:
```bash
docker-compose down
```

To stop the services and remove the volumes (this will delete all data):
```bash
docker-compose down -v
```

## Accessing the Services Directly

### PostgreSQL

```bash
# Connect to PostgreSQL using psql
docker exec -it betting-platform-postgres psql -U betting_platform_user -d betting_platform
```

### Redis

```bash
# Connect to Redis CLI
docker exec -it betting-platform-redis redis-cli -p 6379 -a Redis_S3cur3_P@ss_2024!
```
