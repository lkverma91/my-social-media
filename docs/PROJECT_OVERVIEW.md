# My Social Media - Project Overview

## What Are We Building?

**My Social Media** is a full-stack social media web application where users can register, create posts, follow other users, like and comment on posts, and browse a personalized news feed. It is a lightweight, self-hosted platform designed for learning and demonstration purposes.

---

## Tech Stack

| Layer       | Technology          | Version | Purpose                              |
|-------------|---------------------|---------|--------------------------------------|
| Backend     | Spring Boot         | 3.2.x   | REST API server                      |
| Language    | Java                | 17      | Backend programming language         |
| Database    | MongoDB             | 7.x     | NoSQL document storage               |
| Frontend    | React.js            | 18.x    | Single-page application UI           |
| Routing     | React Router        | 6.x     | Client-side navigation               |
| HTTP Client | Axios               | 1.x     | API communication from frontend      |
| Auth        | JWT (jjwt)          | 0.12.x  | Stateless token-based authentication |
| Containers  | Docker / Compose    | Latest  | Containerization and orchestration   |
| Web Server  | Nginx               | Alpine  | Serve production frontend build      |

---

## Architecture

```
┌─────────────────┐       HTTP        ┌─────────────────────┐       Mongo       ┌───────────┐
│  React Frontend │  ◄──────────────► │  Spring Boot Backend│  ◄──────────────► │  MongoDB  │
│  (Port 3000)    │    REST + JWT     │  (Port 8085)        │    Driver          │ (Port     │
│                 │                   │                     │                    │  27017)   │
└─────────────────┘                   └─────────────────────┘                    └───────────┘
        │                                      │                                      │
        └──────────────────────────────────────┴──────────────────────────────────────┘
                                    Docker Compose
```

### How It Works

1. **Frontend** (React) runs in the browser, sends HTTP requests to the backend via Axios.
2. **Backend** (Spring Boot) exposes REST endpoints, validates JWT tokens, processes business logic, and reads/writes to MongoDB.
3. **MongoDB** stores all persistent data (users, posts, comments) as JSON-like documents.
4. **Docker Compose** orchestrates all three services so the entire stack starts with a single command.

---

## Features

### Authentication
- User registration with username, email, and password
- Login returns a JWT token stored in the browser
- All protected routes require a valid JWT in the `Authorization` header

### User Profiles
- View any user's profile (username, bio, follower/following counts)
- Edit your own profile (bio)

### Posts
- Create text-based posts
- Delete your own posts
- View posts in a chronological news feed

### Likes
- Like or unlike any post (toggle)
- See the like count on each post

### Comments
- Add comments to any post
- Delete your own comments
- View all comments on a post

### Follow System
- Follow or unfollow other users
- Your news feed shows posts only from people you follow

### Explore
- Browse all users on the platform
- Discover new people to follow

---

## Data Models

### User
| Field     | Type       | Description                     |
|-----------|------------|---------------------------------|
| id        | String     | MongoDB auto-generated ObjectId |
| username  | String     | Unique username                 |
| email     | String     | Unique email address            |
| password  | String     | BCrypt hashed password          |
| bio       | String     | Short user biography            |
| followers | List<String> | List of user IDs who follow this user |
| following | List<String> | List of user IDs this user follows    |
| createdAt | Date       | Account creation timestamp      |

### Post
| Field     | Type       | Description                     |
|-----------|------------|---------------------------------|
| id        | String     | MongoDB auto-generated ObjectId |
| userId    | String     | ID of the author                |
| username  | String     | Username of the author          |
| content   | String     | Post text content               |
| likes     | List<String> | List of user IDs who liked    |
| createdAt | Date       | Post creation timestamp         |

### Comment
| Field     | Type   | Description                     |
|-----------|--------|---------------------------------|
| id        | String | MongoDB auto-generated ObjectId |
| postId    | String | ID of the parent post           |
| userId    | String | ID of the comment author        |
| username  | String | Username of the comment author  |
| content   | String | Comment text                    |
| createdAt | Date   | Comment creation timestamp      |

---

## API Endpoints

### Authentication
| Method | Endpoint              | Description        | Auth Required |
|--------|-----------------------|--------------------|---------------|
| POST   | `/api/auth/register`  | Register new user  | No            |
| POST   | `/api/auth/login`     | Login, get JWT     | No            |

### Users
| Method | Endpoint                  | Description        | Auth Required |
|--------|---------------------------|--------------------|---------------|
| GET    | `/api/users/{id}`         | Get user profile   | Yes           |
| PUT    | `/api/users/{id}`         | Update profile     | Yes           |
| POST   | `/api/users/{id}/follow`  | Follow a user      | Yes           |
| DELETE | `/api/users/{id}/follow`  | Unfollow a user    | Yes           |
| GET    | `/api/users`              | Get all users      | Yes           |

### Posts
| Method | Endpoint                      | Description          | Auth Required |
|--------|-------------------------------|----------------------|---------------|
| GET    | `/api/posts`                  | Get news feed        | Yes           |
| POST   | `/api/posts`                  | Create a post        | Yes           |
| DELETE | `/api/posts/{id}`             | Delete a post        | Yes           |
| POST   | `/api/posts/{id}/like`        | Like/unlike a post   | Yes           |
| GET    | `/api/posts/user/{userId}`    | Get user's posts     | Yes           |

### Comments
| Method | Endpoint                          | Description          | Auth Required |
|--------|-----------------------------------|----------------------|---------------|
| GET    | `/api/posts/{id}/comments`        | Get post comments    | Yes           |
| POST   | `/api/posts/{id}/comments`        | Add a comment        | Yes           |
| DELETE | `/api/comments/{id}`              | Delete a comment     | Yes           |

---

## Frontend Pages

| Page     | Route        | Description                                |
|----------|--------------|--------------------------------------------|
| Login    | `/login`     | User login form                            |
| Register | `/register`  | New user registration form                 |
| Home     | `/`          | News feed with posts from followed users   |
| Profile  | `/profile/:id` | User profile with their posts            |
| Explore  | `/explore`   | Browse and discover all users              |

---

## How We Will Build It

### Step 1: Documentation (this file + two more)
Create PROJECT_OVERVIEW.md, TESTING_GUIDE.md, and RUN_GUIDE.md.

### Step 2: Backend
1. Set up Spring Boot project with Maven (`pom.xml`)
2. Configure MongoDB connection (`application.yml`)
3. Create data models (User, Post, Comment)
4. Create repositories (Spring Data MongoDB)
5. Implement services with business logic
6. Add JWT authentication (filter + utility)
7. Build REST controllers

### Step 3: Frontend
1. Initialize React project (`package.json`)
2. Set up routing with React Router
3. Create authentication context (JWT storage)
4. Build reusable components (Navbar, PostCard, etc.)
5. Build pages (Login, Register, Home, Profile, Explore)
6. Style with modern CSS

### Step 4: Docker
1. Write Dockerfile for backend (multi-stage Maven build)
2. Write Dockerfile for frontend (multi-stage Node + Nginx)
3. Create `docker-compose.yml` to orchestrate all services
