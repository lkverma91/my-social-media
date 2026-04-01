# My Social Media - MongoDB Beginner Guide

If you are using MongoDB for the first time, this guide will explain what MongoDB is, how it works, how our Spring Boot backend uses it, and how you can inspect and interact with your data.

---

## Table of Contents

1. [What is MongoDB?](#1-what-is-mongodb)
2. [MongoDB vs SQL Databases (MySQL/PostgreSQL)](#2-mongodb-vs-sql-databases)
3. [Key MongoDB Terminology](#3-key-mongodb-terminology)
4. [How to Install and Run MongoDB](#4-how-to-install-and-run-mongodb)
5. [How Our Project Uses MongoDB](#5-how-our-project-uses-mongodb)
6. [Spring Boot + MongoDB Connection Explained](#6-spring-boot--mongodb-connection-explained)
7. [Understanding Our Data Models](#7-understanding-our-data-models)
8. [How Spring Data MongoDB Works](#8-how-spring-data-mongodb-works)
9. [Interacting with MongoDB (Hands-On Commands)](#9-interacting-with-mongodb-hands-on-commands)
10. [Viewing Your Data with MongoDB Compass (GUI)](#10-viewing-your-data-with-mongodb-compass-gui)
11. [Common MongoDB Operations](#11-common-mongodb-operations)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What is MongoDB?

MongoDB is a **NoSQL database** that stores data as **JSON-like documents** instead of rows and columns (like MySQL or PostgreSQL).

### Simple Analogy

Think of it like this:

- **SQL Database (MySQL)** = Data stored in a spreadsheet (fixed rows and columns)
- **MongoDB** = Data stored in a folder of JSON files (flexible structure)

### A User in MySQL (rows and columns):
```
| id | username | email           | bio    |
|----|----------|-----------------|--------|
| 1  | johndoe  | john@test.com   | Hello  |
| 2  | janedoe  | jane@test.com   | Hi     |
```

### The Same User in MongoDB (JSON document):
```json
{
  "_id": "69cd354b50c35f1e3e0a365d",
  "username": "johndoe",
  "email": "john@test.com",
  "bio": "Hello",
  "followers": ["69cd3a..."],
  "following": ["69cd3b..."],
  "createdAt": "2026-04-01T15:10:03"
}
```

Notice how MongoDB can store **arrays directly** (followers, following) -- in MySQL you'd need a separate table for that!

---

## 2. MongoDB vs SQL Databases

| Feature | MongoDB | MySQL/PostgreSQL |
|---------|---------|-----------------|
| **Data format** | JSON documents | Rows and columns |
| **Schema** | Flexible (no fixed structure) | Strict (must define columns first) |
| **Relationships** | Embedded documents or references | JOIN tables |
| **Primary key** | `_id` (auto-generated ObjectId) | Auto-increment integer `id` |
| **Query language** | MongoDB Query Language | SQL |
| **Best for** | Flexible data, rapid development | Complex relationships, transactions |
| **Scaling** | Horizontal (add more servers) | Vertical (bigger server) |
| **Used by** | Our project, many startups | Banks, enterprise apps |

### Why We Chose MongoDB for This Project

1. **Flexible schema** -- We can add new fields to documents without altering a schema
2. **Natural JSON** -- Our REST API sends and receives JSON, MongoDB stores JSON
3. **Arrays are easy** -- Storing followers/following/likes as arrays is natural in MongoDB
4. **Quick setup** -- No need to define tables, columns, or write migration scripts
5. **Spring Boot support** -- Excellent integration via Spring Data MongoDB

---

## 3. Key MongoDB Terminology

| MongoDB Term | SQL Equivalent | What It Means |
|-------------|---------------|---------------|
| **Database** | Database | Container for all your data (ours is called `mysocialmedia`) |
| **Collection** | Table | A group of documents (like `users`, `posts`, `comments`) |
| **Document** | Row | A single record (like one user or one post) |
| **Field** | Column | A key-value pair inside a document (like `username: "johndoe"`) |
| **ObjectId** | Auto-increment ID | MongoDB's auto-generated unique identifier (24 hex characters) |
| **mongosh** | mysql / psql | MongoDB's command-line shell |
| **MongoDB Compass** | phpMyAdmin / pgAdmin | MongoDB's graphical (GUI) tool |

### Our Database Structure

```
Database: mysocialmedia
├── Collection: users        (stores all registered users)
│   ├── Document: { _id: "69cd...", username: "johndoe", ... }
│   ├── Document: { _id: "69ce...", username: "janedoe", ... }
│   └── ...
├── Collection: posts        (stores all posts)
│   ├── Document: { _id: "69cf...", content: "Hello!", userId: "69cd...", ... }
│   └── ...
└── Collection: comments     (stores all comments)
    ├── Document: { _id: "69d0...", content: "Nice!", postId: "69cf...", ... }
    └── ...
```

---

## 4. How to Install and Run MongoDB

### Option A: Using Docker (Recommended -- No Installation Needed)

```bash
# Start MongoDB in a Docker container
docker run -d --name my-social-media-mongo -p 27017:27017 mongo:7

# Verify it's running
docker ps --filter name=my-social-media-mongo

# Stop MongoDB
docker stop my-social-media-mongo

# Start it again later
docker start my-social-media-mongo

# Remove the container completely (deletes all data!)
docker rm -f my-social-media-mongo
```

### Option B: Install MongoDB Locally

1. Download from: https://www.mongodb.com/try/download/community
2. Choose your OS (Windows/Mac/Linux)
3. Install with default settings
4. MongoDB runs as a service on port 27017 automatically

### Option C: Use MongoDB Atlas (Cloud - Free Tier)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a free cluster
4. Get the connection string
5. Update `application.yml` with the Atlas connection string

---

## 5. How Our Project Uses MongoDB

### The Connection Flow

```
Spring Boot Application
    │
    ├── application.yml  (has the MongoDB connection URL)
    │     └── mongodb://localhost:27017/mysocialmedia
    │
    ├── Model classes (User.java, Post.java, Comment.java)
    │     └── @Document annotation tells Spring which collection to use
    │
    ├── Repository interfaces (UserRepository, PostRepository, CommentRepository)
    │     └── Spring auto-generates the actual database queries
    │
    └── Service classes (UserService, PostService, CommentService)
          └── Use repositories to read/write data
```

### What Happens Step-by-Step When a User Registers

```
1. Frontend sends POST /api/auth/register with { username, email, password }
2. AuthController.java receives the request
3. Controller creates a new User object (Java)
4. Controller calls userRepository.save(user)
5. Spring Data MongoDB converts User object to a BSON document
6. MongoDB driver sends the document to MongoDB server
7. MongoDB stores it in the "users" collection
8. MongoDB returns the document with a generated _id
9. Spring converts it back to a Java User object
10. Controller returns it as JSON to the frontend
```

---

## 6. Spring Boot + MongoDB Connection Explained

### application.yml

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mysocialmedia
```

Breaking down the URI:
```
mongodb://          Protocol (like http:// for websites)
localhost           Host (where MongoDB is running)
:27017              Port (MongoDB's default port)
/mysocialmedia      Database name (created automatically if it doesn't exist)
```

### For Docker Compose (when services are in containers)

```yaml
# In docker-compose.yml, the backend uses:
SPRING_DATA_MONGODB_URI=mongodb://mongodb:27017/mysocialmedia
#                                 ^^^^^^^
#                    Container name instead of "localhost"
```

### Required Maven Dependency (in pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>
```

This single dependency gives us:
- MongoDB Java driver (connects to MongoDB)
- Spring Data MongoDB (auto-generates repository implementations)
- Auto-configuration (reads application.yml and connects automatically)

---

## 7. Understanding Our Data Models

### User.java - How a Java Class Maps to MongoDB

```java
@Document(collection = "users")     // This class maps to the "users" collection
public class User {

    @Id                              // This field is the MongoDB _id
    private String id;               // Auto-generated 24-character hex string

    @Indexed(unique = true)          // Creates a unique index (no duplicate usernames)
    private String username;

    @Indexed(unique = true)          // Creates a unique index (no duplicate emails)
    private String email;

    private String password;         // Stored as BCrypt hash

    private String bio;

    private List<String> followers;  // Array of user IDs who follow this user
    private List<String> following;  // Array of user IDs this user follows

    private LocalDateTime createdAt; // Stored as ISO date in MongoDB
}
```

**What it looks like in MongoDB:**
```json
{
  "_id": ObjectId("69cd354b50c35f1e3e0a365d"),
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2a$10$X7cYZ...",
  "bio": "Software developer",
  "followers": ["69cd3a1b50c35f1e3e0a365e"],
  "following": ["69cd3a1b50c35f1e3e0a365e", "69cd3b2c50c35f1e3e0a365f"],
  "createdAt": ISODate("2026-04-01T15:10:03.000Z"),
  "_class": "com.mysocialmedia.model.User"
}
```

### Post.java

```java
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String userId;           // References a User._id (not a foreign key)
    private String username;         // Denormalized for quick display
    private String content;
    private List<String> likes;      // Array of user IDs who liked
    private LocalDateTime createdAt;
}
```

### Comment.java

```java
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;
    private String postId;           // References a Post._id
    private String userId;           // References a User._id
    private String username;
    private String content;
    private LocalDateTime createdAt;
}
```

### Important: MongoDB Annotations

| Annotation | What It Does | Example |
|-----------|-------------|---------|
| `@Document(collection = "users")` | Maps this class to a MongoDB collection | User.java -> "users" collection |
| `@Id` | Marks the primary key field | Auto-generates a unique ObjectId |
| `@Indexed(unique = true)` | Creates a database index for fast lookups, prevents duplicates | No two users with same username |

---

## 8. How Spring Data MongoDB Works

### Repository Pattern (Zero Boilerplate)

In our project, we define a repository **interface** (no implementation needed!):

```java
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
```

Spring Data MongoDB **automatically generates the implementation** at runtime by reading the method names:

| Method Name | Generated MongoDB Query | SQL Equivalent |
|-------------|------------------------|----------------|
| `findById(id)` | `db.users.findOne({ _id: id })` | `SELECT * FROM users WHERE id = ?` |
| `findByUsername(name)` | `db.users.findOne({ username: name })` | `SELECT * FROM users WHERE username = ?` |
| `existsByEmail(email)` | `db.users.countDocuments({ email: email }) > 0` | `SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)` |
| `findAll()` | `db.users.find({})` | `SELECT * FROM users` |
| `save(user)` | `db.users.insertOne(user)` or `updateOne` | `INSERT INTO users ...` or `UPDATE users ...` |
| `deleteById(id)` | `db.users.deleteOne({ _id: id })` | `DELETE FROM users WHERE id = ?` |

### PostRepository

```java
public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserIdOrderByCreatedAtDesc(String userId);
    // Translates to: db.posts.find({ userId: ? }).sort({ createdAt: -1 })

    List<Post> findByUserIdInOrderByCreatedAtDesc(List<String> userIds);
    // Translates to: db.posts.find({ userId: { $in: [id1, id2, ...] } }).sort({ createdAt: -1 })
}
```

### How Method Name Parsing Works

```
findByUserIdInOrderByCreatedAtDesc
│      │       │       │          │
│      │       │       │          └── Desc = Descending order
│      │       │       └── CreatedAt = sort by this field
│      │       └── In = match any value in a list ($in operator)
│      └── UserId = filter by this field
└── findBy = SELECT query
```

---

## 9. Interacting with MongoDB (Hands-On Commands)

### Open the MongoDB Shell

```bash
# If MongoDB is running in Docker:
docker exec -it my-social-media-mongo mongosh

# If MongoDB is installed locally:
mongosh
```

### Basic Commands

```javascript
// Show all databases
show dbs

// Switch to our database
use mysocialmedia

// Show all collections
show collections
// Output: users, posts, comments

// Count documents in a collection
db.users.countDocuments()
// Output: 2

// Find all users
db.users.find()

// Find all users (pretty formatted)
db.users.find().pretty()

// Find a specific user by username
db.users.findOne({ username: "johndoe" })

// Find all posts by a specific user
db.posts.find({ username: "johndoe" })

// Find all posts, sorted by newest first
db.posts.find().sort({ createdAt: -1 })

// Find all comments for a specific post
db.comments.find({ postId: "69cf..." })

// Count how many posts exist
db.posts.countDocuments()
```

### Useful Inspection Commands

```javascript
// See what a user document looks like
db.users.findOne()

// See all indexes on the users collection
db.users.getIndexes()

// See database statistics
db.stats()

// See collection statistics
db.users.stats()
```

### Modifying Data (Use Carefully!)

```javascript
// Update a user's bio
db.users.updateOne(
  { username: "johndoe" },
  { $set: { bio: "Updated from mongosh!" } }
)

// Delete a specific post
db.posts.deleteOne({ _id: ObjectId("69cf...") })

// Delete ALL posts (be careful!)
db.posts.deleteMany({})

// Drop (delete) a collection entirely
db.posts.drop()

// Drop the entire database (VERY destructive!)
db.dropDatabase()
```

### Querying with Conditions

```javascript
// Find users with more than 2 followers
db.users.find({ "followers.2": { $exists: true } })

// Find posts that a specific user liked
db.posts.find({ likes: "69cd354b50c35f1e3e0a365d" })

// Find posts created in the last 24 hours
db.posts.find({
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
})

// Find users whose username starts with "j"
db.users.find({ username: /^j/i })
```

---

## 10. Viewing Your Data with MongoDB Compass (GUI)

If you prefer a graphical interface instead of the command line:

1. **Download MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Open it** and connect to: `mongodb://localhost:27017`
3. **Click on `mysocialmedia`** database
4. **Click on `users`, `posts`, or `comments`** collections
5. **Browse documents visually**, edit them, filter them, and more

Compass is great for:
- Seeing your data in a clean table/tree view
- Editing documents by clicking on them
- Running queries with a visual query builder
- Checking indexes and performance

---

## 11. Common MongoDB Operations

### How Data is Stored vs How We Access It

| What You Do in the App | Backend Code | MongoDB Operation |
|------------------------|-------------|-------------------|
| Register a user | `userRepository.save(user)` | `db.users.insertOne({...})` |
| Login | `userRepository.findByUsername("john")` | `db.users.findOne({username: "john"})` |
| Create a post | `postRepository.save(post)` | `db.posts.insertOne({...})` |
| Like a post | `postRepository.save(post)` (with updated likes array) | `db.posts.updateOne({_id: ...}, {$set: {likes: [...]}})` |
| Get news feed | `postRepository.findByUserIdInOrderByCreatedAtDesc(ids)` | `db.posts.find({userId: {$in: [...]}}).sort({createdAt: -1})` |
| Follow a user | `userRepository.save(user)` (with updated following array) | `db.users.updateOne(...)` |
| Add a comment | `commentRepository.save(comment)` | `db.comments.insertOne({...})` |
| Delete a post | `postRepository.delete(post)` + `commentRepository.deleteByPostId(id)` | `db.posts.deleteOne(...)` + `db.comments.deleteMany({postId: ...})` |

---

## 12. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `Connection refused on 27017` | MongoDB is not running | Start it: `docker start my-social-media-mongo` |
| `Database mysocialmedia not showing` | No data inserted yet | MongoDB creates the database automatically when first data is saved |
| `Duplicate key error on username` | Trying to register with existing username | Use a different username, or delete the old user |
| `Documents have `_class` field` | Spring Data adds this to know which Java class to map to | Normal behavior, can be ignored |
| `ObjectId looks different than in logs` | Shell shows `ObjectId("...")`, JSON shows just the hex string | Both are the same value, just different display |
| `Data gone after Docker container removed` | Docker container was removed with data | Use `-v` flag or Docker volumes for persistent data |
| `Cannot connect from backend in Docker Compose` | Using `localhost` instead of container name | In docker-compose, use `mongodb` as hostname, not `localhost` |

### Quick Health Check Commands

```bash
# Is MongoDB running?
docker ps --filter name=my-social-media-mongo

# Can we connect?
docker exec -it my-social-media-mongo mongosh --eval "db.runCommand({ping: 1})"

# How many users are registered?
docker exec -it my-social-media-mongo mongosh mysocialmedia --eval "db.users.countDocuments()"

# Show all collections
docker exec -it my-social-media-mongo mongosh mysocialmedia --eval "show collections"
```
