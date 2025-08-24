# RateIt — Store Rating Platform

**Short description**

RateIt is a full-stack web application that provides a role-based store rating platform where users can register, browse stores, and submit ratings; store owners can manage their stores and view ratings; and administrators can manage users and stores and see dashboard statistics. The project is built with a Node.js + Express backend (MySQL) and a React (Vite) frontend.

---

## Key features

* Role-based authentication (ADMIN, STORE\_OWNER, USER) using JWT
* Secure password hashing with `bcryptjs`
* CRUD operations for users and stores (admin + store-owner flows)
* Users can submit or update ratings for stores
* Admin dashboard with aggregate stats (stores, users, ratings)
* Store-owner dashboard to view store-specific ratings and stats
* Protected API routes with `protect` and `isAdmin` middlewares
* React frontend with routes for login, signup, user dashboard, store-owner dashboard, admin dashboard, and store details

---

## Tech stack

* Backend: Node.js, Express, MySQL (`mysql2`), JWT (`jsonwebtoken`), `bcryptjs`, `dotenv`
* Frontend: React (Vite), Axios, Tailwind-related packages (configured in package.json), `jwt-decode`
* Dev tooling: nodemon for backend development, Vite for frontend

---

## Repo structure (important files & folders)

```
RateIt-main/
├─ backend/
│  ├─ index.js                      # Entry point for backend server
│  ├─ package.json
│  └─ src/
│     ├─ config/db.js               # MySQL connection pool (uses .env)
│     ├─ controllers/               # Business logic (auth, user, store)
│     ├─ middlewares/authMiddleware.js
│     ├─ routes/                    # Express route definitions
│     └─ utils/jwtHelper.js         # JWT token creation helper
├─ frontend/
│  ├─ package.json
│  └─ src/
│     ├─ main.jsx                   # React entry file
│     ├─ App.jsx                    # Router + protected route wrapper
│     ├─ context/AuthContext.jsx    # Axios instance + login/logout + token
│     ├─ pages/                     # Login, Signup, Admin/User/StoreOwner dashboards, StoreDetails
│     └─ components/                # UI components: Header, forms, tables, stats
└─ RateIt-main.zip (uploaded)
```

---

## API (routes overview)

> Base URL for backend: `http://localhost:5000/api` (default) or set `VITE_API_BASE_URL` / `VITE_API_BASE_URL` in the frontend `.env` to point to your server.

**Authentication**

* `POST /api/auth/register` — Register a new user (`name`, `email`, `address`, `password`, `role`)
* `POST /api/auth/login` — Login (`email`, `password`) -> returns `{ token, user }`

**Users (admin-only & protected)**

* `POST /api/users/createUser` — Admin can create a new user with role (ADMIN/USER/STORE\_OWNER)
* `GET /api/users/` — Admin: get list of all users
* `GET /api/users/:id` — Admin: get a single user by id
* `PUT /api/users/update-password` — Protected: update the currently authenticated user's password

**Stores & Ratings**

* `POST /api/stores/createStoreAdmin` — Admin creates a store
* `GET /api/stores/dashboard-stats` — Admin: high-level platform statistics
* `POST /api/stores/createStoreOwner` — Store owner creates their own store
* `GET /api/stores/my-store` — Store owner: get their store (owner-scoped)
* `GET /api/stores/my-store/:storeId` — Store owner (or protected user): get store details & ratings
* `GET /api/stores/` — Protected: get list of stores (search/filter options exist in frontend)
* `POST /api/stores/:storeId/ratings` — Authenticated user: submit or update rating for `storeId`

**Authentication note**: Protected routes expect an Authorization header like:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Environment variables

**Backend `.env` (create at `backend/.env`)**

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=rateit_db
JWT_SECRET=a_strong_secret_key
```

**Frontend `.env` (frontend/.env already contains a default)**

```
VITE_API_BASE_URL=http://localhost:5000/api
```

> Make sure the backend `PORT` and the frontend `VITE_API_BASE_URL` match your local setup.

---

## Database

This repository does not include an automatic migration script. Below is a recommended minimal MySQL schema to get started. Run these statements in your MySQL server (adjust types as you prefer):

```sql
-- Create database (if not already created)
CREATE DATABASE IF NOT EXISTS rateit_db;
USE rateit_db;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  role ENUM('ADMIN','USER','STORE_OWNER') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table
CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NULL,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  store_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT NOT NULL, -- 1-5
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY user_store_unique (user_id, store_id),
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

This schema mirrors the entities used across the backend and frontend (users, stores, ratings). The repo's controllers expect tables and fields with similar names — if you prefer a migration tool, add `knex`/`sequelize`/`typeorm` or use a SQL file.

---

## Installation & Running (development)

### Backend

```bash
cd RateIt-main/backend
npm install
# create backend/.env (see env section above)
# Ensure your MySQL server is running and DB variables are correct
npm run start
# or use nodemon during development if you have it installed: npx nodemon index.js
```

The backend listens on the `PORT` from `.env` (default 5000). API root is `/api` per `index.js`.

### Frontend

```bash
cd RateIt-main/frontend
npm install
# Ensure frontend/.env points to backend (VITE_API_BASE_URL=http://localhost:5000/api)
npm run dev
```

Open the Vite dev server URL (usually `http://localhost:5173`) in your browser.

---

## How the authentication works (high level)

* Users register via `/api/auth/register` — password is hashed with bcrypt before storing.
* Login returns a JWT (created with a helper function) that encodes a `user` object.
* Frontend saves the token in `localStorage` and configures an Axios instance (`AuthContext.jsx`) to attach the token on subsequent requests.
* Backend `protect` middleware verifies the JWT, extracts `req.user`, and `isAdmin` middleware checks `req.user.role`.

---

## Frontend notes

* `AuthContext.jsx` centralizes the API client (Axios), login/logout, the stored token, and user state.
* `App.jsx` defines protected routes with a `ProtectedRoute` wrapper that checks for presence of `token` and `allowedRoles`.
* Pages included: `LoginPage`, `SignupPage`, `AdminDashboard`, `UserDashboard`, `StoreOwnerDashboard`, `StoreDetails`.
* Components: forms for adding users/stores, data tables, stats cards and sections, header and password update form.

---

## Example requests (curl)

**Register**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","address":"123 Main","password":"P@ssw0rd","role":"USER"}'
```

**Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"P@ssw0rd"}'
```

**Submit Rating** (replace `<TOKEN>` and `<STORE_ID>`)

```bash
curl -X POST http://localhost:5000/api/stores/1/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"rating":5, "comment":"Great!"}'
```

---

## Known gaps / Developer notes (important)

During inspection of the repository I observed the following:

* Several backend controller files contain placeholder ellipses (`...`) or shortened sections. Some handler logic appears trimmed in the shipped files. You should review `backend/src/controllers/*.js` and finish any incomplete logic before deploying.
* There are no database migration scripts in the repository (no SQL/migration automation). I added a recommended SQL schema in this README that you can run manually.
* Tests are not included. Consider adding unit/integration tests (Jest / supertest) for the API.

If you want, I can:

* Generate a SQL migration file for the schema above.
* Expand the incomplete controller logic into full implementations (register/login, rating logic, admin stats) based on how the frontend expects responses.
* Create seed scripts (create an ADMIN user) so you can jump straight into the admin dashboard.

> NOTE: I did not modify repository files — this README documents what I found and provides guidance to run and complete the app.

---

## Next steps / suggested improvements

* Add database migrations & seeders (e.g., `knex` or `sequelize` CLI).
* Harden security: strong `JWT_SECRET`, rate limiting, input validation (e.g., `express-validator`), stricter CORS origin policy in production.
* Add unit/integration tests and CI pipeline.
* Add file-based configuration or Docker Compose for easy environment setup.
* Add pagination and sorting to `GET /api/stores`/`GET /api/users`.

---

## Contribution

If you'd like to contribute improvements, fork the repo, create a branch, and open a PR. Please include clear descriptions for controller changes and any DB migrations.

---

## License

(Choose a license and add a `LICENSE` file. MIT is a common choice.)

---

*If you'd like, I can now:*

* generate SQL migration files and a seed script,
* create a polished `backend/.env.example` and `frontend/.env.example`,
* or convert incomplete controller placeholders into full working code — tell me which of these you want and I'll add it directly to the repo.
