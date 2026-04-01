# My Social Media - Frontend Learning Guide (React.js for Beginners)

If you are completely new to React.js, this document will explain every file in our frontend project, what it does, why we need it, and how everything connects together.

---

## Table of Contents

1. [What is React.js?](#1-what-is-reactjs)
2. [Prerequisites to Learn React](#2-prerequisites-to-learn-react)
3. [How to Set Up and Run the Frontend](#3-how-to-set-up-and-run-the-frontend)
4. [Project Folder Structure Explained](#4-project-folder-structure-explained)
5. [Important Files - What They Do and Why We Need Them](#5-important-files---what-they-do-and-why-we-need-them)
6. [React Concepts Used in This Project](#6-react-concepts-used-in-this-project)
7. [How Data Flows in Our App](#7-how-data-flows-in-our-app)
8. [Step-by-Step Learning Path](#8-step-by-step-learning-path)
9. [File-by-File Detailed Explanation](#9-file-by-file-detailed-explanation)
10. [Common Questions](#10-common-questions)

---

## 1. What is React.js?

React.js is a **JavaScript library** created by Facebook for building user interfaces (UI). Think of it like this:

- **HTML** = The skeleton of a web page (structure)
- **CSS** = The clothes/styling of a web page (appearance)
- **JavaScript** = The brain of a web page (behavior)
- **React.js** = A smart way to organize JavaScript so you can build complex UIs easily

### Key Ideas in React

| Concept | Simple Explanation | Real-World Analogy |
|---------|-------------------|--------------------|
| **Component** | A reusable piece of UI (like a button, card, or form) | LEGO brick - build big things from small pieces |
| **JSX** | HTML-like code written inside JavaScript | Writing HTML directly in your JS files |
| **Props** | Data passed FROM a parent TO a child component | A parent giving instructions to a child |
| **State** | Data that can CHANGE inside a component | The current status of something (e.g., "is the light on or off?") |
| **Hook** | Special functions that let you use React features | Tools in a toolbox (useState, useEffect, etc.) |

---

## 2. Prerequisites to Learn React

Before you start with React, you should know:

### Must Know
| Skill | Why You Need It | Where to Learn |
|-------|----------------|----------------|
| **HTML basics** | React renders HTML elements | w3schools.com/html |
| **CSS basics** | To style your components | w3schools.com/css |
| **JavaScript basics** | React IS JavaScript | javascript.info |

### Good to Know (React uses these JS features a lot)
| JavaScript Feature | How React Uses It | Example |
|-------------------|-------------------|---------|
| **Arrow functions** | Writing components and handlers | `const MyComponent = () => { }` |
| **Template literals** | Building dynamic strings | `` `Hello ${name}` `` |
| **Destructuring** | Extracting values from objects | `const { user, login } = useAuth()` |
| **Array methods** | Rendering lists, filtering data | `posts.map(post => <PostCard />)` |
| **Async/Await** | Making API calls | `const res = await API.get('/posts')` |
| **Import/Export** | Splitting code into files | `import Navbar from './components/Navbar'` |

### Software Prerequisites
| Tool | Version | What It Is | Download |
|------|---------|-----------|----------|
| **Node.js** | 18+ | JavaScript runtime (runs JS outside the browser) | https://nodejs.org |
| **npm** | 9+ | Package manager (installs libraries) | Comes with Node.js |
| **Code Editor** | Any | VS Code or Cursor recommended | https://code.visualstudio.com |
| **Browser** | Any modern | Chrome recommended (has great developer tools) | Already installed |

---

## 3. How to Set Up and Run the Frontend

### First Time Setup

```bash
# Step 1: Go to the frontend folder
cd my-social-media/frontend

# Step 2: Install all dependencies (downloads all libraries)
npm install
# This reads package.json and downloads everything listed in "dependencies"
# It creates a "node_modules" folder (which is HUGE - never edit it manually)

# Step 3: Start the development server
npm start
# This starts a local web server at http://localhost:3000
# It also watches for file changes and auto-refreshes the browser (hot reload)
```

### What Happens When You Run `npm start`?

```
1. npm reads package.json
2. Finds "start" script: "react-scripts start"
3. react-scripts compiles all your .js/.jsx files
4. Starts a development server on port 3000
5. Opens http://localhost:3000 in your browser
6. Watches for file changes and auto-refreshes
```

### Available npm Commands

| Command | What It Does | When to Use |
|---------|-------------|-------------|
| `npm install` | Downloads all dependencies | First time, or after adding new packages |
| `npm start` | Starts dev server (port 3000) | During development |
| `npm run build` | Creates production-ready files | Before deploying to a real server |
| `npm test` | Runs test files | When you write tests |

---

## 4. Project Folder Structure Explained

```
frontend/
├── public/                    [PUBLIC FOLDER - Static files]
│   └── index.html             The ONE and ONLY HTML page (React is a Single Page App)
│
├── src/                       [SOURCE FOLDER - All your React code lives here]
│   ├── index.js               ENTRY POINT - The very first file React runs
│   ├── index.css              Global styles for the entire app
│   ├── App.js                 ROOT COMPONENT - Sets up routing and layout
│   ├── App.css                Styles for App layout and auth pages
│   │
│   ├── api/                   [API LAYER - Communication with backend]
│   │   └── axios.js           Configured HTTP client for API calls
│   │
│   ├── context/               [GLOBAL STATE - Shared data across all components]
│   │   └── AuthContext.js     Manages login/logout state globally
│   │
│   ├── components/            [REUSABLE UI PIECES - Used inside pages]
│   │   ├── Navbar.jsx         Top navigation bar
│   │   ├── Navbar.css
│   │   ├── PostCard.jsx       Displays a single post (with like/comment)
│   │   ├── PostCard.css
│   │   ├── CreatePost.jsx     Form to write a new post
│   │   ├── CreatePost.css
│   │   ├── CommentSection.jsx Shows and adds comments under a post
│   │   ├── CommentSection.css
│   │   ├── UserCard.jsx       Displays a user (with follow button)
│   │   └── UserCard.css
│   │
│   └── pages/                 [FULL PAGES - One per URL route]
│       ├── Login.jsx          Login page (/login)
│       ├── Register.jsx       Registration page (/register)
│       ├── Home.jsx           News feed page (/)
│       ├── Home.css
│       ├── Profile.jsx        User profile page (/profile/:id)
│       ├── Profile.css
│       ├── Explore.jsx        Discover users page (/explore)
│       └── Explore.css
│
├── package.json               PROJECT MANIFEST - Lists dependencies and scripts
├── Dockerfile                 Docker build instructions
├── nginx.conf                 Web server config for production
└── .dockerignore              Files to skip during Docker build
```

---

## 5. Important Files - What They Do and Why We Need Them

### 5.1 `package.json` - The Project Identity Card

**What is it?** The most important file in any Node.js/React project. It is like a recipe book for your project.

**Why do we need it?** Without this file, npm doesn't know what your project is, what libraries it needs, or how to run it.

**What's inside ours?**

```json
{
  "name": "my-social-media-frontend",    // Project name
  "version": "1.0.0",                    // Version number
  "dependencies": {                       // Libraries our project NEEDS to run
    "axios": "^1.7.2",                   // HTTP client (talks to backend API)
    "react": "^18.3.1",                  // React library itself
    "react-dom": "^18.3.1",             // React + browser DOM connection
    "react-router-dom": "^6.23.1",      // URL routing (page navigation)
    "react-scripts": "5.0.1"            // Build tools (webpack, babel, etc.)
  },
  "scripts": {                           // Commands you can run
    "start": "react-scripts start",      // npm start -> starts dev server
    "build": "react-scripts build",      // npm run build -> production build
    "test": "react-scripts test"         // npm test -> run tests
  }
}
```

**Our dependencies explained:**

| Package | What It Does | Why We Need It |
|---------|-------------|----------------|
| `react` | The core React library | Without it, no React at all |
| `react-dom` | Connects React to the browser's HTML | Renders components into the actual web page |
| `react-router-dom` | Page navigation without full page reload | So clicking "Explore" doesn't reload the entire page |
| `axios` | Makes HTTP requests to our backend | So frontend can talk to Spring Boot API |
| `react-scripts` | Build tooling (webpack, babel, dev server) | Compiles JSX, bundles files, runs dev server |

---

### 5.2 `public/index.html` - The One and Only HTML Page

**What is it?** The single HTML file of our entire application.

**Why only one?** React is a **Single Page Application (SPA)**. The browser loads this ONE HTML page, and then React dynamically changes what you see using JavaScript. When you click "Explore", React doesn't load a new HTML page -- it swaps the components shown on screen.

**The key line:**
```html
<div id="root"></div>
```
This empty `<div>` is where React injects your entire application. Think of it as a picture frame -- React paints the picture inside it.

---

### 5.3 `src/index.js` - The Starting Point

**What is it?** The very first JavaScript file that runs when your app starts.

**What it does:**
```javascript
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

Step by step:
1. Finds the `<div id="root">` in index.html
2. Creates a React "root" attached to that div
3. Renders the `<App />` component inside it

**Why we need it:** This is the bridge between the HTML page and React. Without it, React has nowhere to render.

---

### 5.4 `src/App.js` - The Brain of the Application

**What is it?** The root component that sets up the entire app structure: routing, authentication, and layout.

**What it does:**
1. Wraps everything in `AuthProvider` (so all components can access login state)
2. Sets up `React Router` (so different URLs show different pages)
3. Defines `ProtectedRoute` (pages that require login)
4. Defines `PublicRoute` (login/register -- redirect to home if already logged in)
5. Shows/hides the `Navbar` based on whether the user is logged in

**The routing table:**
```
URL                 -> Page Component    -> Protected?
/login              -> Login.jsx         -> No (public)
/register           -> Register.jsx      -> No (public)
/                   -> Home.jsx          -> Yes (must be logged in)
/profile/:id        -> Profile.jsx       -> Yes
/explore            -> Explore.jsx       -> Yes
```

**Why we need it:** Without App.js, there's no routing, no layout, and no way to know which page to show.

---

### 5.5 `src/api/axios.js` - The Backend Communicator

**What is it?** A pre-configured HTTP client that all components use to talk to our Spring Boot backend.

**What it does:**
1. Creates an Axios instance pointed at `http://localhost:8085/api`
2. **Request Interceptor**: Automatically attaches the JWT token to every request header
3. **Response Interceptor**: If the server returns 401 (unauthorized), automatically logs out the user

**Why we need it:** Instead of writing the base URL and token header in every single API call, we configure it ONCE here. Every component just imports `API` and makes calls like `API.get('/posts')`.

**Without axios.js (repetitive):**
```javascript
// In EVERY component, you'd have to write:
const token = localStorage.getItem('token');
fetch('http://localhost:8085/api/posts', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**With axios.js (clean):**
```javascript
// Just this, token is added automatically:
API.get('/posts');
```

---

### 5.6 `src/context/AuthContext.js` - The Login State Manager

**What is it?** A React Context that stores the current user's login information and makes it available to every component in the app.

**What it does:**
1. On app start, checks `localStorage` for a saved token (so you stay logged in after refresh)
2. Provides a `login()` function that saves token and user info
3. Provides a `logout()` function that clears everything
4. Provides a `user` object with `{ token, userId, username }`

**Why we need it?** Without this, every component would need to read localStorage directly and pass user data through many levels of props. Context makes it available everywhere with a simple `const { user } = useAuth()`.

**Think of it like this:**
```
Without Context:                         With Context:
App -> Navbar (pass user)                App -> AuthProvider
App -> Home (pass user)                      -> Navbar (useAuth())
Home -> PostCard (pass user)                 -> Home (useAuth())
PostCard -> CommentSection (pass user)            -> PostCard (useAuth())
                                                       -> CommentSection (useAuth())
```

---

## 6. React Concepts Used in This Project

### 6.1 Components (Every .jsx file is a component)

A component is a function that returns JSX (HTML-like code).

```javascript
// Simple component
const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>My Social Media</h1>
    </nav>
  );
};
```

Our components:

| Component | Type | What It Renders |
|-----------|------|-----------------|
| `Navbar` | Reusable | Top navigation bar with links |
| `PostCard` | Reusable | A single post with like/comment buttons |
| `CreatePost` | Reusable | Text area + "Post" button |
| `CommentSection` | Reusable | List of comments + add comment form |
| `UserCard` | Reusable | User info card with follow button |
| `Login` | Page | Login form |
| `Register` | Page | Registration form |
| `Home` | Page | News feed (list of PostCards) |
| `Profile` | Page | User profile + their posts |
| `Explore` | Page | List of all users (UserCards) |

---

### 6.2 useState - Storing Data That Changes

```javascript
const [posts, setPosts] = useState([]);  // Start with empty array
// posts    = the current value
// setPosts = function to update the value
// []       = initial value

setPosts([newPost, ...posts]);  // Adds a new post to the top
```

**Used in our project for:** form inputs, post lists, loading states, error messages, comments.

---

### 6.3 useEffect - Doing Something When Component Loads

```javascript
useEffect(() => {
  fetchFeed();  // Call the API when this component first appears
}, []);         // [] means "run only once when component mounts"
```

**Used in our project for:** Loading posts when Home page opens, loading user profile, loading comments.

---

### 6.4 Props - Passing Data Between Components

```javascript
// Parent (Home.jsx) passes data DOWN to child (PostCard.jsx):
<PostCard post={post} onDelete={handleDelete} />

// Child (PostCard.jsx) RECEIVES and uses the data:
const PostCard = ({ post, onDelete }) => {
  return <p>{post.content}</p>;
};
```

---

### 6.5 React Router - Navigating Between Pages

```javascript
// Define routes (in App.js):
<Route path="/profile/:id" element={<Profile />} />

// Navigate with a link:
<Link to="/explore">Explore</Link>

// Navigate programmatically:
const navigate = useNavigate();
navigate('/login');

// Read URL parameters:
const { id } = useParams();  // Gets :id from /profile/:id
```

---

### 6.6 Context API - Sharing Data Globally

```javascript
// Create context (AuthContext.js):
const AuthContext = createContext(null);

// Provide it at the top of your app (App.js):
<AuthProvider>
  <AppContent />
</AuthProvider>

// Use it ANYWHERE in the app:
const { user, login, logout } = useAuth();
```

---

## 7. How Data Flows in Our App

### Login Flow
```
User types username/password in Login.jsx
  -> handleSubmit() calls API.post('/auth/login', { username, password })
    -> Backend returns { token, userId, username }
      -> login() from AuthContext saves to localStorage and state
        -> user state updates
          -> ProtectedRoute sees user exists
            -> Navigate to Home page
```

### Creating a Post Flow
```
User types in CreatePost.jsx textarea
  -> handleSubmit() calls API.post('/posts', { content })
    -> Backend creates post in MongoDB, returns it
      -> onPostCreated(newPost) called
        -> Home.jsx adds new post to the top of posts array
          -> React re-renders the post list with the new post
```

### Like a Post Flow
```
User clicks heart in PostCard.jsx
  -> handleLike() calls API.post('/posts/{id}/like')
    -> Backend toggles userId in likes array, returns updated post
      -> onUpdate(updatedPost) called
        -> Home.jsx replaces old post with updated post
          -> PostCard re-renders with new like count
```

---

## 8. Step-by-Step Learning Path

Here is the recommended order to study the files in this project:

### Stage 1: Understand the Foundation (30 minutes)
1. **Read `package.json`** -- See what libraries we use
2. **Read `public/index.html`** -- See the single HTML page
3. **Read `src/index.js`** -- See where React starts
4. **Read `src/App.js`** -- See how routing works

### Stage 2: Understand State Management (30 minutes)
5. **Read `src/context/AuthContext.js`** -- Learn about Context and useState
6. **Read `src/api/axios.js`** -- Learn how API calls work

### Stage 3: Study a Simple Page (45 minutes)
7. **Read `src/pages/Login.jsx`** -- A form with useState, API call, navigation
8. **Read `src/pages/Register.jsx`** -- Almost identical to Login, good practice

### Stage 4: Study the Main Page (45 minutes)
9. **Read `src/pages/Home.jsx`** -- useEffect for loading data, rendering a list
10. **Read `src/components/CreatePost.jsx`** -- Form submission, calling parent function

### Stage 5: Study Complex Components (1 hour)
11. **Read `src/components/PostCard.jsx`** -- Props, conditional rendering, API calls
12. **Read `src/components/CommentSection.jsx`** -- Nested data, multiple API calls
13. **Read `src/components/Navbar.jsx`** -- Navigation, logout

### Stage 6: Study Remaining Pages (45 minutes)
14. **Read `src/pages/Profile.jsx`** -- URL params, edit mode, follow/unfollow
15. **Read `src/pages/Explore.jsx`** -- Search/filter, rendering user cards
16. **Read `src/components/UserCard.jsx`** -- Follow button logic

### Stage 7: Study Styling (30 minutes)
17. **Read the .css files** -- See how components are styled

---

## 9. File-by-File Detailed Explanation

### `src/pages/Login.jsx`

| Line/Section | What It Does |
|-------------|-------------|
| `const [username, setUsername] = useState('')` | Creates a variable `username` that starts as empty string. When user types, `setUsername` updates it |
| `const { login } = useAuth()` | Gets the `login` function from AuthContext |
| `const navigate = useNavigate()` | Gets the navigation function from React Router |
| `e.preventDefault()` | Stops the form from refreshing the page (default HTML behavior) |
| `API.post('/auth/login', { username, password })` | Sends login request to backend |
| `login(res.data.token, ...)` | Saves login info to context + localStorage |
| `navigate('/')` | Redirects to home page after successful login |
| `{error && <div>...</div>}` | Shows error message ONLY if error is not empty |
| `onChange={(e) => setUsername(e.target.value)}` | Updates username state every time user types a character |

### `src/pages/Home.jsx`

| Line/Section | What It Does |
|-------------|-------------|
| `const [posts, setPosts] = useState([])` | Stores the list of posts (starts empty) |
| `useEffect(() => { fetchFeed() }, [])` | Calls fetchFeed() once when page loads |
| `API.get('/posts')` | Gets news feed from backend |
| `setPosts(res.data)` | Stores the received posts in state |
| `posts.map(post => <PostCard .../>)` | Loops through posts array and creates a PostCard for each |
| `key={post.id}` | Required by React to track which items changed (performance) |
| `onPostCreated` / `onDelete` / `onUpdate` | Callback functions passed to children to update the posts list |

### `src/components/PostCard.jsx`

| Line/Section | What It Does |
|-------------|-------------|
| `({ post, onDelete, onUpdate })` | Receives post data and callback functions from parent |
| `post.likes?.includes(user?.userId)` | Checks if current user already liked this post |
| `API.post(\`/posts/${post.id}/like\`)` | Sends like/unlike request to backend |
| `{isOwner && <button>X</button>}` | Shows delete button ONLY if you wrote this post |
| `{showComments && <CommentSection />}` | Shows comments ONLY when you click the comment button |
| `formatDate()` | Converts a date to "5m ago", "2h ago", etc. |

### `src/components/CommentSection.jsx`

| Line/Section | What It Does |
|-------------|-------------|
| `useEffect with [postId]` | Reloads comments if postId changes |
| `API.get(\`/posts/${postId}/comments\`)` | Fetches all comments for this post |
| `setComments([...comments, res.data])` | Adds new comment to the end of the list |
| `comments.filter(c => c.id !== commentId)` | Removes a comment from the list (after delete) |

### `src/components/Navbar.jsx`

| Line/Section | What It Does |
|-------------|-------------|
| `<Link to="/">Home</Link>` | Clickable link that navigates without page reload |
| `useNavigate()` | Programmatic navigation (used for logout redirect) |
| `logout()` | Clears user data from context and localStorage |

---

## 10. Common Questions

### Q: Why do files end in .jsx instead of .js?
**A:** `.jsx` tells us this file contains JSX (HTML inside JavaScript). Both `.js` and `.jsx` work the same in React. We use `.jsx` for components and `.js` for non-component files like axios.js and AuthContext.js.

### Q: What is the `node_modules` folder?
**A:** It contains ALL the libraries your project depends on (React, Axios, etc.) plus THEIR dependencies. It can be hundreds of megabytes. Never edit it. Never commit it to git. `npm install` recreates it from package.json.

### Q: Why do we use `const` instead of `let` or `var`?
**A:** `const` means the variable reference can't be reassigned. In React, we use `setState` to update values instead of reassigning them, so `const` is the correct choice.

### Q: What does `async/await` do?
**A:** API calls take time (network round-trip). `async/await` lets us write code that "waits" for the response before continuing, without freezing the page.

### Q: What is the `key` prop in `.map()`?
**A:** When React renders a list, it needs a unique `key` on each item so it can efficiently update only the items that changed. We use `post.id` or `comment.id`.

### Q: Why does the page not fully reload when I click links?
**A:** React Router intercepts link clicks and swaps components in JavaScript instead of asking the server for a new HTML page. This makes navigation instant.

### Q: How do I add a new page?
**A:**
1. Create `src/pages/NewPage.jsx` with a component
2. Add a route in `App.js`: `<Route path="/newpage" element={<NewPage />} />`
3. Add a `<Link to="/newpage">` somewhere in the Navbar

### Q: How do I add a new API call?
**A:**
1. Import API: `import API from '../api/axios'`
2. Call it: `const res = await API.get('/your-endpoint')`
3. The JWT token is automatically attached by the interceptor
