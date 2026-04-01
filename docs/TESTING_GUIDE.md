# My Social Media - Testing Guide

This document explains how to test both the backend API and the frontend UI of the My Social Media application.

---

## Prerequisites

- The application is running (see [RUN_GUIDE.md](./RUN_GUIDE.md))
- Backend is accessible at `http://localhost:8085`
- Frontend is accessible at `http://localhost:3000`
- You have `curl` installed (or Postman / any HTTP client)

---

## 1. Testing the Backend API

### 1.1 Register a New User

```bash
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response** (200 OK):
```json
{
  "id": "660a...",
  "username": "johndoe",
  "email": "john@example.com",
  "bio": null,
  "followers": [],
  "following": [],
  "createdAt": "2026-04-01T..."
}
```

### 1.2 Login

```bash
curl -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

**Expected Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": "660a...",
  "username": "johndoe"
}
```

> Save the `token` value -- you will need it for all subsequent requests.

### 1.3 Create a Post

```bash
curl -X POST http://localhost:8085/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "content": "Hello world! This is my first post."
  }'
```

**Expected Response** (200 OK):
```json
{
  "id": "660b...",
  "userId": "660a...",
  "username": "johndoe",
  "content": "Hello world! This is my first post.",
  "likes": [],
  "createdAt": "2026-04-01T..."
}
```

### 1.4 Get News Feed

```bash
curl -X GET http://localhost:8085/api/posts \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response** (200 OK): Array of posts from users you follow (plus your own).

### 1.5 Like a Post

```bash
curl -X POST http://localhost:8085/api/posts/<POST_ID>/like \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response** (200 OK): The updated post with your userId in the `likes` array.

### 1.6 Add a Comment

```bash
curl -X POST http://localhost:8085/api/posts/<POST_ID>/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "content": "Great post!"
  }'
```

**Expected Response** (200 OK):
```json
{
  "id": "660c...",
  "postId": "<POST_ID>",
  "userId": "660a...",
  "username": "johndoe",
  "content": "Great post!",
  "createdAt": "2026-04-01T..."
}
```

### 1.7 Get Comments for a Post

```bash
curl -X GET http://localhost:8085/api/posts/<POST_ID>/comments \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 1.8 Follow a User

First, register a second user, then follow them:

```bash
curl -X POST http://localhost:8085/api/users/<OTHER_USER_ID>/follow \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**Expected Response** (200 OK): Updated user profile with `following` list.

### 1.9 Unfollow a User

```bash
curl -X DELETE http://localhost:8085/api/users/<OTHER_USER_ID>/follow \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 1.10 Get User Profile

```bash
curl -X GET http://localhost:8085/api/users/<USER_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 1.11 Update User Profile

```bash
curl -X PUT http://localhost:8085/api/users/<YOUR_USER_ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{
    "bio": "Software developer and coffee lover"
  }'
```

### 1.12 Get All Users (Explore)

```bash
curl -X GET http://localhost:8085/api/users \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 1.13 Delete a Post

```bash
curl -X DELETE http://localhost:8085/api/posts/<POST_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### 1.14 Delete a Comment

```bash
curl -X DELETE http://localhost:8085/api/comments/<COMMENT_ID> \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 2. Testing with Postman

1. Import the base URL `http://localhost:8085` into Postman.
2. Create a new **Environment** with variable `token` (leave empty initially).
3. After calling `/api/auth/login`, copy the token from the response and set it as the `token` environment variable.
4. For all other requests, set the `Authorization` header to `Bearer {{token}}`.
5. Test each endpoint in order: Register -> Login -> Create Post -> Like -> Comment -> Follow -> Feed.

---

## 3. Testing the Frontend UI

### Manual Test Flow

1. **Open the app**: Navigate to `http://localhost:3000`

2. **Register**:
   - Click "Register" link on the login page
   - Fill in username, email, and password
   - Click "Register" button
   - You should be redirected to the login page

3. **Login**:
   - Enter your username and password
   - Click "Login" button
   - You should be redirected to the Home (news feed) page

4. **Create a Post**:
   - On the Home page, type in the "What's on your mind?" text area
   - Click "Post" button
   - The new post should appear in the feed

5. **Like a Post**:
   - Click the heart icon on any post
   - The like count should update
   - Click again to unlike

6. **Comment on a Post**:
   - Click the comment icon on any post
   - Type a comment and press Enter or click "Send"
   - The comment should appear below the post

7. **Explore Users**:
   - Click "Explore" in the navigation bar
   - You should see a list of all registered users
   - Click "Follow" on a user to follow them

8. **View Profile**:
   - Click on a username to view their profile
   - You should see their bio, follower/following counts, and their posts
   - If it's your own profile, you can edit your bio

9. **News Feed**:
   - Go back to Home
   - You should see posts from users you follow

10. **Logout**:
    - Click "Logout" in the navigation bar
    - You should be redirected to the login page

---

## 4. Common Issues and Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` on API calls | JWT token missing or expired | Login again to get a fresh token |
| `Connection refused` on port 8085 | Backend not running | Start the backend (see RUN_GUIDE.md) |
| `Network Error` in frontend | Backend URL misconfigured or CORS issue | Check that backend is running on port 8085 |
| Posts not showing in feed | Not following any users | Follow users from the Explore page |
| MongoDB connection error | MongoDB not running | Start MongoDB via Docker or locally |

---

## 5. Verifying Docker Setup

After running `docker-compose up`, verify all services:

```bash
# Check all containers are running
docker-compose ps

# Check backend health
curl http://localhost:8085/api/auth/login

# Check frontend
curl http://localhost:3000

# Check MongoDB connection
docker exec -it my-social-media-mongo mongosh --eval "db.stats()"
```
