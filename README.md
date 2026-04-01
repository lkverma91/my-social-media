# My Social Media

A full-stack social media application built with **Spring Boot**, **React.js**, **MongoDB**, and **Docker**.

## Features

- User registration and login (JWT authentication)
- Create, delete, and view text posts
- Like and unlike posts
- Comment on posts
- Follow and unfollow users
- Personalized news feed (posts from people you follow)
- Explore page to discover new users
- Editable user profiles with bio

## Tech Stack

| Component | Technology     |
|-----------|----------------|
| Backend   | Spring Boot 3.2, Java 17 |
| Frontend  | React 18, React Router 6 |
| Database  | MongoDB 7      |
| Auth      | JWT (jjwt)     |
| Container | Docker, Docker Compose |

## Quick Start (Docker)

```bash
cd my-social-media
docker-compose up --build
```

Then open **http://localhost:3000** in your browser.

## Manual Development Setup

### Prerequisites
- Java 17+, Maven 3.9+
- Node.js 18+, npm 9+
- MongoDB 7 (or Docker for MongoDB)

### Start MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

### Start Backend
```bash
cd backend
mvn spring-boot:run
```

### Start Frontend
```bash
cd frontend
npm install
npm start
```

## Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md) -- Architecture, data models, API endpoints
- [Testing Guide](docs/TESTING_GUIDE.md) -- How to test backend and frontend
- [Run Guide](docs/RUN_GUIDE.md) -- Detailed instructions for running the application

## Project Structure

```
my-social-media/
├── docs/                   # Documentation
├── backend/                # Spring Boot REST API
│   ├── src/main/java/com/mysocialmedia/
│   ├── pom.xml
│   └── Dockerfile
├── frontend/               # React.js SPA
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Full-stack orchestration
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/users | List all users |
| GET | /api/users/:id | Get user profile |
| PUT | /api/users/:id | Update profile |
| POST | /api/users/:id/follow | Follow user |
| DELETE | /api/users/:id/follow | Unfollow user |
| GET | /api/posts | News feed |
| POST | /api/posts | Create post |
| DELETE | /api/posts/:id | Delete post |
| POST | /api/posts/:id/like | Like/unlike |
| GET | /api/posts/:id/comments | Get comments |
| POST | /api/posts/:id/comments | Add comment |
| DELETE | /api/comments/:id | Delete comment |

## License

This project is for learning and demonstration purposes.
