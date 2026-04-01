# My Social Media - How to Run and Test (Complete Guide)

This is a single comprehensive document covering everything you need to run and test both the backend and frontend of the My Social Media application.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Running the Application](#2-running-the-application)
3. [Testing the Backend API](#3-testing-the-backend-api)
4. [Testing the Frontend UI](#4-testing-the-frontend-ui)
5. [Full End-to-End Test Walkthrough](#5-full-end-to-end-test-walkthrough)
6. [Stopping the Application](#6-stopping-the-application)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

Make sure you have the following installed:

| Tool           | Version | Check Command            |
|----------------|---------|--------------------------|
| Java JDK       | 17+     | `java -version`          |
| Maven          | 3.9+    | `mvn -version`           |
| Node.js        | 18+     | `node -version`          |
| npm            | 9+      | `npm -version`           |
| Docker Desktop | 24+     | `docker --version`       |

---

## 2. Running the Application

### Step 1: Start MongoDB (via Docker)

```bash
docker run -d --name my-social-media-mongo -p 27017:27017 mongo:7
```

Verify it's running:
```bash
docker ps --filter name=my-social-media-mongo
```

### Step 2: Start the Backend (Spring Boot)

Open a terminal and run:

```bash
cd my-social-media/backend

# Build the project (first time or after changes)
mvn clean install -DskipTests

# Start the server
mvn spring-boot:run
```

Wait until you see:
```
Tomcat started on port 8085 (http) with context path ''
Started MySocialMediaApplication in X seconds
```

The backend API is now live at **http://localhost:8085**

### Step 3: Start the Frontend (React)

Open a **second terminal** and run:

```bash
cd my-social-media/frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

Wait until you see:
```
Compiled successfully!
You can now view my-social-media-frontend in the browser.
  Local: http://localhost:3000
```

The frontend is now live at **http://localhost:3000**

### Alternative: Run Everything with Docker Compose

If you prefer a single-command approach:

```bash
cd my-social-media
docker-compose up --build
```

This starts MongoDB, backend, and frontend all at once.

---

## 3. Testing the Backend API

You can test the API using **curl** (Git Bash / Linux / Mac), **PowerShell**, or **Postman**.

### Using PowerShell (Windows)

#### 3.1 Register a User

```powershell
$body = '{"username":"johndoe","email":"john@example.com","password":"password123"}'
Invoke-RestMethod -Uri http://localhost:8085/api/auth/register -Method POST -ContentType "application/json" -Body $body
```

Expected output:
```
id        : 69cd...
username  : johndoe
email     : john@example.com
bio       :
followers : {}
following : {}
createdAt : 2026-04-01...
```

#### 3.2 Login (Get JWT Token)

```powershell
$body = '{"username":"johndoe","password":"password123"}'
$response = Invoke-RestMethod -Uri http://localhost:8085/api/auth/login -Method POST -ContentType "application/json" -Body $body
$token = $response.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "Logged in! Token saved."
```

> Keep this terminal open -- `$headers` is used in all subsequent requests.

#### 3.3 Create a Post

```powershell
$postBody = '{"content":"Hello World! This is my first post!"}'
Invoke-RestMethod -Uri http://localhost:8085/api/posts -Method POST -ContentType "application/json" -Body $postBody -Headers $headers
```

#### 3.4 Get News Feed

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/posts -Method GET -Headers $headers
```

#### 3.5 Like a Post

```powershell
# Replace POST_ID with the actual post id from step 3.3
Invoke-RestMethod -Uri http://localhost:8085/api/posts/POST_ID/like -Method POST -Headers $headers
```

#### 3.6 Add a Comment

```powershell
$commentBody = '{"content":"Great post!"}'
Invoke-RestMethod -Uri http://localhost:8085/api/posts/POST_ID/comments -Method POST -ContentType "application/json" -Body $commentBody -Headers $headers
```

#### 3.7 Get Comments

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/posts/POST_ID/comments -Method GET -Headers $headers
```

#### 3.8 Register a Second User and Follow

```powershell
$body2 = '{"username":"janedoe","email":"jane@example.com","password":"password123"}'
$user2 = Invoke-RestMethod -Uri http://localhost:8085/api/auth/register -Method POST -ContentType "application/json" -Body $body2

# Follow the second user
Invoke-RestMethod -Uri "http://localhost:8085/api/users/$($user2.id)/follow" -Method POST -Headers $headers
```

#### 3.9 Get All Users (Explore)

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/users -Method GET -Headers $headers
```

#### 3.10 Get User Profile

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/users/USER_ID -Method GET -Headers $headers
```

#### 3.11 Update Bio

```powershell
$bioBody = '{"bio":"Software developer and coffee lover"}'
Invoke-RestMethod -Uri http://localhost:8085/api/users/YOUR_USER_ID -Method PUT -ContentType "application/json" -Body $bioBody -Headers $headers
```

#### 3.12 Unfollow a User

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/users/OTHER_USER_ID/follow -Method DELETE -Headers $headers
```

#### 3.13 Delete a Post

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/posts/POST_ID -Method DELETE -Headers $headers
```

#### 3.14 Delete a Comment

```powershell
Invoke-RestMethod -Uri http://localhost:8085/api/comments/COMMENT_ID -Method DELETE -Headers $headers
```

### Using curl (Git Bash / Linux / Mac)

```bash
# Register
curl -X POST http://localhost:8085/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:8085/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"password123"}' | jq -r '.token')

# Create post
curl -X POST http://localhost:8085/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"content":"Hello World!"}'

# Get feed
curl -X GET http://localhost:8085/api/posts \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. Set base URL to `http://localhost:8085`
2. Create an Environment with variable `token`
3. Call `POST /api/auth/login` with body `{"username":"johndoe","password":"password123"}`
4. Copy the token from response and set it as the `token` variable
5. For all other requests, add header: `Authorization: Bearer {{token}}`
6. Test endpoints in order: Register -> Login -> Create Post -> Like -> Comment -> Follow

---

## 4. Testing the Frontend UI

Open your browser and go to **http://localhost:3000**

### Manual Test Checklist

| # | Test | Steps | Expected Result |
|---|------|-------|-----------------|
| 1 | **Register** | Click "Sign up" link, fill in username/email/password, click "Sign Up" | Redirected to login page |
| 2 | **Login** | Enter username and password, click "Sign In" | Redirected to Home page, navbar visible |
| 3 | **Create Post** | Type text in "What's on your mind?", click "Post" | New post appears in feed |
| 4 | **Like Post** | Click heart icon on a post | Heart turns red, count increments |
| 5 | **Unlike Post** | Click heart icon again | Heart turns back to outline, count decrements |
| 6 | **Open Comments** | Click comment icon on a post | Comment section expands |
| 7 | **Add Comment** | Type text and click "Send" | Comment appears below post |
| 8 | **Delete Comment** | Click X on your own comment | Comment is removed |
| 9 | **Explore** | Click "Explore" in navbar | List of all users shown |
| 10 | **Search Users** | Type in search bar on Explore page | User list filters in real-time |
| 11 | **Follow User** | Click "Follow" button on a user card | Button changes to "Unfollow" |
| 12 | **View Profile** | Click on a username anywhere | Profile page with posts and stats |
| 13 | **Edit Bio** | On your own profile, click "Edit Bio", type, click "Save" | Bio is updated |
| 14 | **News Feed** | Go Home after following users | Posts from followed users appear |
| 15 | **Delete Post** | Click X on your own post | Post is removed from feed |
| 16 | **Logout** | Click "Logout" in navbar | Redirected to login page |

---

## 5. Full End-to-End Test Walkthrough

Here is a step-by-step PowerShell script that tests every major feature:

```powershell
Write-Host "=== 1. Register User A ===" -ForegroundColor Cyan
$userA = Invoke-RestMethod -Uri http://localhost:8085/api/auth/register -Method POST -ContentType "application/json" -Body '{"username":"alice","email":"alice@test.com","password":"pass123"}'
Write-Host "Created: $($userA.username) (ID: $($userA.id))"

Write-Host "`n=== 2. Register User B ===" -ForegroundColor Cyan
$userB = Invoke-RestMethod -Uri http://localhost:8085/api/auth/register -Method POST -ContentType "application/json" -Body '{"username":"bob","email":"bob@test.com","password":"pass123"}'
Write-Host "Created: $($userB.username) (ID: $($userB.id))"

Write-Host "`n=== 3. Login as Alice ===" -ForegroundColor Cyan
$loginA = Invoke-RestMethod -Uri http://localhost:8085/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"alice","password":"pass123"}'
$headersA = @{ Authorization = "Bearer $($loginA.token)" }
Write-Host "Logged in as Alice"

Write-Host "`n=== 4. Login as Bob ===" -ForegroundColor Cyan
$loginB = Invoke-RestMethod -Uri http://localhost:8085/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"bob","password":"pass123"}'
$headersB = @{ Authorization = "Bearer $($loginB.token)" }
Write-Host "Logged in as Bob"

Write-Host "`n=== 5. Alice creates a post ===" -ForegroundColor Cyan
$post = Invoke-RestMethod -Uri http://localhost:8085/api/posts -Method POST -ContentType "application/json" -Body '{"content":"Hello from Alice!"}' -Headers $headersA
Write-Host "Post created: $($post.content) (ID: $($post.id))"

Write-Host "`n=== 6. Bob follows Alice ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:8085/api/users/$($userA.id)/follow" -Method POST -Headers $headersB | Out-Null
Write-Host "Bob now follows Alice"

Write-Host "`n=== 7. Bob's news feed ===" -ForegroundColor Cyan
$feed = Invoke-RestMethod -Uri http://localhost:8085/api/posts -Method GET -Headers $headersB
$feed | ForEach-Object { Write-Host "  [$($_.username)] $($_.content)" }

Write-Host "`n=== 8. Bob likes Alice's post ===" -ForegroundColor Cyan
$liked = Invoke-RestMethod -Uri "http://localhost:8085/api/posts/$($post.id)/like" -Method POST -Headers $headersB
Write-Host "Likes: $($liked.likes.Count)"

Write-Host "`n=== 9. Bob comments on Alice's post ===" -ForegroundColor Cyan
$comment = Invoke-RestMethod -Uri "http://localhost:8085/api/posts/$($post.id)/comments" -Method POST -ContentType "application/json" -Body '{"content":"Nice post, Alice!"}' -Headers $headersB
Write-Host "Comment: $($comment.content)"

Write-Host "`n=== 10. Get all comments ===" -ForegroundColor Cyan
$comments = Invoke-RestMethod -Uri "http://localhost:8085/api/posts/$($post.id)/comments" -Method GET -Headers $headersA
$comments | ForEach-Object { Write-Host "  [$($_.username)] $($_.content)" }

Write-Host "`n=== 11. Get all users (Explore) ===" -ForegroundColor Cyan
$users = Invoke-RestMethod -Uri http://localhost:8085/api/users -Method GET -Headers $headersA
$users | ForEach-Object { Write-Host "  $($_.username) - followers: $($_.followers.Count)" }

Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green
```

Save this as `test-api.ps1` and run with:
```powershell
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

---

## 6. Stopping the Application

### If Running Manually

1. **Frontend**: Press `Ctrl+C` in the frontend terminal
2. **Backend**: Press `Ctrl+C` in the backend terminal
3. **MongoDB**: `docker stop my-social-media-mongo && docker rm my-social-media-mongo`

### If Running with Docker Compose

```bash
# Stop all services
docker-compose down

# Stop and delete all data
docker-compose down -v
```

---

## 7. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Port 8085 already in use` | Another process on 8085 | Run `netstat -aon \| findstr 8085` and kill the process |
| `Port 3000 already in use` | Another React app running | Kill the process or use a different port |
| `MongoDB connection refused` | MongoDB not started | Run `docker start my-social-media-mongo` or restart it |
| `401 Unauthorized` | Token missing or expired | Login again to get a fresh JWT token |
| `CORS error in browser` | Backend not running or wrong port | Ensure backend is running on port 8085 |
| `npm install fails` | Node.js version too old | Upgrade to Node.js 18+ |
| `mvn command not found` | Maven not installed or not in PATH | Install Maven and add to system PATH |
| `Posts not in feed` | Not following anyone | Go to Explore page and follow some users |
| Frontend shows blank page | JavaScript error | Open browser DevTools (F12) and check Console tab |

---

## Ports Summary

| Service  | Port  | URL                      |
|----------|-------|--------------------------|
| Frontend | 3000  | http://localhost:3000     |
| Backend  | 8085  | http://localhost:8085     |
| MongoDB  | 27017 | mongodb://localhost:27017 |
