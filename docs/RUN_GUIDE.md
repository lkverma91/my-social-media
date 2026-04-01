# My Social Media - Run Guide

This document explains how to run the My Social Media application, both using Docker (recommended) and manually for development.

---

## Prerequisites

| Tool          | Version  | Download                                      |
|---------------|----------|-----------------------------------------------|
| Java JDK      | 17+      | https://adoptium.net/                         |
| Maven          | 3.9+     | https://maven.apache.org/download.cgi         |
| Node.js        | 18+      | https://nodejs.org/                           |
| npm            | 9+       | Comes with Node.js                            |
| Docker         | 24+      | https://www.docker.com/get-started            |
| Docker Compose | 2.x      | Included with Docker Desktop                  |
| MongoDB        | 7.x      | https://www.mongodb.com/try/download/community (only needed for manual run) |

---

## Option 1: Run with Docker Compose (Recommended)

This is the easiest way -- a single command starts everything.

### Steps

1. **Navigate to the project root:**

   ```bash
   cd my-social-media
   ```

2. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**

   | Service   | URL                          |
   |-----------|------------------------------|
   | Frontend  | http://localhost:3000         |
   | Backend   | http://localhost:8085         |
   | MongoDB   | localhost:27017 (no web UI)  |

4. **Stop all services:**

   ```bash
   docker-compose down
   ```

5. **Stop and remove all data (fresh start):**

   ```bash
   docker-compose down -v
   ```

---

## Option 2: Run Manually (For Development)

Use this when you want hot-reload and faster development feedback.

### Step 1: Start MongoDB

**Option A -- Using Docker (easiest):**

```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

**Option B -- Using local MongoDB:**

Start the MongoDB service on your machine. It should be listening on `localhost:27017`.

### Step 2: Start the Backend

```bash
cd my-social-media/backend

# Build the project
mvn clean install -DskipTests

# Run the application
mvn spring-boot:run
```

The backend will start on **http://localhost:8085**.

You can verify it's running:

```bash
curl http://localhost:8085/api/auth/login
# Should return 400 or 401 (not connection refused)
```

### Step 3: Start the Frontend

Open a **new terminal**:

```bash
cd my-social-media/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on **http://localhost:3000** and open in your default browser.

---

## Environment Configuration

### Backend (`backend/src/main/resources/application.yml`)

| Property                       | Default Value              | Description                     |
|--------------------------------|----------------------------|---------------------------------|
| `spring.data.mongodb.uri`     | `mongodb://localhost:27017/mysocialmedia` | MongoDB connection string |
| `server.port`                  | `8085`                     | Backend server port             |
| `jwt.secret`                   | (set in config)            | Secret key for JWT signing      |
| `jwt.expiration`               | `86400000` (24 hours)      | JWT token validity in ms        |

### Frontend

The frontend API base URL is configured in `frontend/src/api/axios.js`. By default it points to `http://localhost:8085/api`.

When running via Docker, the Nginx config proxies `/api` requests to the backend container.

---

## Project Structure Quick Reference

```
my-social-media/
├── docker-compose.yml          # Orchestrates all services
├── backend/
│   ├── Dockerfile              # Multi-stage Java build
│   ├── pom.xml                 # Maven dependencies
│   └── src/main/
│       ├── java/com/mysocialmedia/   # Java source code
│       └── resources/
│           └── application.yml       # App configuration
├── frontend/
│   ├── Dockerfile              # Multi-stage Node/Nginx build
│   ├── package.json            # npm dependencies
│   ├── public/                 # Static assets
│   └── src/                    # React source code
└── docs/                       # Documentation
```

---

## Useful Commands

### Docker

```bash
# Rebuild a specific service
docker-compose up --build backend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Enter MongoDB shell
docker exec -it my-social-media-mongo mongosh

# List MongoDB databases
docker exec -it my-social-media-mongo mongosh --eval "show dbs"
```

### Backend (Maven)

```bash
# Clean build
mvn clean package -DskipTests

# Run tests
mvn test

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend (npm)

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm start

# Create production build
npm run build

# Run tests
npm test
```

---

## Ports Summary

| Service  | Port  | Protocol |
|----------|-------|----------|
| Frontend | 3000  | HTTP     |
| Backend  | 8085  | HTTP     |
| MongoDB  | 27017 | TCP      |

> Make sure these ports are not in use by other applications before starting.
