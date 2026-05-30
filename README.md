# TalentFlow — AI-Powered Job Board

A modern, full-stack job board platform built with React and Spring Boot. TalentFlow connects job seekers with recruiters through smart search, one-click applications, and role-based dashboards.

![TalentFlow Hero](./docs/screenshots/hero.png)
![Job Listings](./docs/screenshots/jobs.png)
![Recruiter Dashboard](./docs/screenshots/recruiter-dashboard.png)

## Features

### Job Seekers
- Search and filter jobs by keyword, location, type, and experience
- Save jobs and track application status
- Profile management with resume URL
- Application history and notifications

### Recruiters
- Post, edit, and delete job listings
- Manage companies and applicants
- Update application status (Pending → Interview → Offered)
- Dashboard analytics

### Admins
- Platform-wide statistics
- User management (view/delete users)

### Platform
- JWT authentication with role-based access (User, Recruiter, Admin)
- Forgot password flow
- Dark/light mode
- Responsive glassmorphism UI with Framer Motion animations
- RESTful API with Spring Security

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Shadcn-style UI, Framer Motion, Axios, React Router |
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, JWT, Lombok, Maven |
| Database | MySQL 8 |
| CI/CD | GitHub Actions |
| Deployment | Vercel (frontend), Render/Railway (backend) |

## Project Structure

```
Globalco_Task/
├── frontend/          # React + Vite application
├── backend/           # Spring Boot REST API
├── database/          # MySQL schema
├── .github/workflows/ # CI/CD pipeline
└── README.md
```

## Prerequisites

- Node.js 20+
- Java 17+ (Java 21 supported)
- Docker Desktop (optional, for MySQL)
- MySQL 8+ (or use Docker Compose)

## Quick Start (Recommended)

```powershell
# 1. Start MySQL
docker compose up -d mysql

# 2. Start backend (uses included Maven wrapper)
cd backend
.\mvnw.cmd spring-boot:run

# 3. Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

Or run everything with: `.\scripts\start-dev.ps1`

### Demo Accounts (auto-seeded on first run)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@talentflow.com | admin123 |
| Recruiter | recruiter@talentflow.com | recruiter123 |
| Job Seeker | user@talentflow.com | user123 |

## Installation

### 1. Database Setup

**Option A — Docker:**
```bash
docker compose up -d mysql
```

**Option B — Local MySQL:**
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend Setup

```bash
cd backend
# Windows: .\mvnw.cmd   |   Linux/Mac: ./mvnw
.\mvnw.cmd spring-boot:run
```

The API runs at `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/jobboard` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `root` |
| `JWT_SECRET` | Base64-encoded secret (min 32 bytes) | dev default |
| `JWT_EXPIRATION_MS` | Token expiry in ms | `86400000` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |
| `PORT` | Server port | `8080` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080/api` |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Search jobs (public) |
| GET | `/api/jobs/{id}` | Get job details |
| GET | `/api/jobs/{id}/related` | Related jobs |
| POST | `/api/jobs/{id}/save` | Save job (auth) |
| DELETE | `/api/jobs/{id}/save` | Unsave job (auth) |
| GET | `/api/jobs/saved` | Saved jobs (auth) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply to job |
| GET | `/api/applications/me` | My applications |

### Recruiter
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recruiter/dashboard` | Recruiter stats |
| POST | `/api/recruiter/companies` | Create company |
| GET | `/api/recruiter/companies` | List companies |
| POST | `/api/recruiter/jobs` | Post job |
| GET | `/api/recruiter/jobs` | My jobs |
| PUT | `/api/recruiter/jobs/{id}` | Update job |
| DELETE | `/api/recruiter/jobs/{id}` | Delete job |
| GET | `/api/recruiter/applications` | All applications |
| PATCH | `/api/recruiter/applications/{id}/status` | Update status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | List users |
| DELETE | `/api/admin/users/{id}` | Delete user |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get profile |
| PUT | `/api/users/me` | Update profile |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/{id}/read` | Mark as read |

## Deployment

### Frontend → Vercel

1. Import the `frontend` directory in Vercel
2. Set `VITE_API_URL` to your production API URL
3. Deploy (auto via GitHub Actions on push to `main`)

**GitHub Secrets required:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_URL`

### Backend → Render

1. Connect repo and use `render.yaml` or Docker
2. Set environment variables from `backend/.env.example`
3. Attach MySQL database and update `DB_URL`

### Backend → Railway

1. Deploy from GitHub with root directory `backend`
2. Add MySQL plugin
3. Configure env vars

### Database → MySQL

Use PlanetScale, Railway MySQL, or Render PostgreSQL-compatible MySQL hosting. Run `database/schema.sql` to initialize tables.

## Screenshots

> Place screenshots in `docs/screenshots/`:
> - `hero.png` — Landing page
> - `jobs.png` — Job listings
> - `recruiter-dashboard.png` — Recruiter dashboard

## License

MIT
