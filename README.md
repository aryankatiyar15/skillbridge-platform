# Job Portal — Full‑Stack MERN Application

A production‑ready job marketplace where candidates can browse and apply to jobs, and companies/admins can create and manage job postings and review applicants. Built with a clean React + Vite frontend and a Node.js/Express API backed by MongoDB. File uploads are handled via Cloudinary, and auth is JWT‑based with role‑guarded routes.

> **Why this repo matters:** it shows practical, end‑to‑end product thinking — secure auth, role‑based access, CRUD flows, real‑world UI/UX patterns, and a modular codebase that’s easy to extend.

**Live Deployment:**  
https://skillbridge-1-uwsu.onrender.com/

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Monorepo Structure](#monorepo-structure)
* [Quick Start](#quick-start)
* [Environment Variables](#environment-variables)
* [API Overview](#api-overview)
* [Frontend Highlights](#frontend-highlights)
* [Common Pitfalls & Fixes](#common-pitfalls--fixes)
* [Roadmap](#roadmap)
* [License](#license)

---

## Features

**Candidate side**

* Browse, search, and filter jobs
* View detailed job descriptions
* Create profile and update details
* Apply to jobs and track application status

**Company/Admin side**

* Company onboarding & setup (logo via Cloudinary)
* Create, update, and manage job posts
* Review applicants per job
* Admin‑only protected pages & APIs

**Platform**

* JWT authentication with role‑based authorization
* Modular controllers/models/routes
* Clean state management with Redux Toolkit
* Reusable UI primitives (buttons, dialogs, inputs, tables)
* Toast notifications and friendly UX

---

## Tech Stack

| Layer    | Technology                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Frontend | React (Vite), React Router, Redux Toolkit, Tailwind CSS, shadcn/ui, Sonner |
| Backend  | Node.js, Express.js                                                        |
| Database | MongoDB (Mongoose)                                                         |
| Auth     | JWT (with protected routes & role guards)                                  |
| Uploads  | Multer + Cloudinary (via Data URI)                                         |
| Tooling  | ESLint, PostCSS, Tailwind, Vite                                            |

> The stack above is inferred from the codebase structure and filenames in this repo.

---

## Monorepo Structure

```
.
├── backend
│   ├── controllers
│   │   ├── application.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   └── user.controller.js
│   ├── middlewares
│   │   ├── isAuthenticated.js
│   │   └── mutler.js            # Multer for file uploads (typo kept to match file)
│   ├── models
│   │   ├── application.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   └── user.model.js
│   ├── routes
│   │   ├── application.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   └── user.route.js
│   ├── utils
│   │   ├── cloudinary.js
│   │   ├── datauri.js
│   │   └── db.js
│   ├── index.js
│   ├── package.json
│   └── .gitignore
│
└── frontend
    ├── public
    └── src
        ├── assets/
        ├── components/
        │   ├── admin/
        │   │   ├── AdminJobs.jsx
        │   │   ├── AdminJobsTable.jsx
        │   │   ├── Applicants.jsx
        │   │   ├── ApplicantsTable.jsx
        │   │   ├── Companies.jsx
        │   │   ├── CompaniesTable.jsx
        │   │   ├── CompanyCreate.jsx
        │   │   ├── CompanySetup.jsx
        │   │   └── PostJob.jsx
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Signup.jsx
        │   ├── shared/
        │   │   ├── Footer.jsx
        │   │   └── Navbar.jsx
        │   ├── ui/ (primitives)
        │   │   ├── avatar.jsx, badge.jsx, button.jsx, ...
        │   ├── AppliedJobTable.jsx, Browse.jsx, CategoryCarousel.jsx, FilterCard.jsx,
        │   │   HeroSection.jsx, Home.jsx, Job.jsx, JobDescription.jsx, Jobs.jsx,
        │   │   LatestJobCards.jsx, LatestJobs.jsx, Profile.jsx, UpdateProfileDialog.jsx,
        │   │   ProtectedRoute.jsx
        ├── hooks/
        │   ├── useGetAllAdminJobs.jsx
        │   ├── useGetAllCompanies.jsx
        │   ├── useGetAllJobs.jsx
        │   ├── useGetAppliedJobs.jsx
        │   └── useGetCompanyById.jsx
        ├── lib/utils.js
        ├── redux/
        │   ├── applicationSlice.js
        │   ├── authSlice.js
        │   ├── companySlice.js
        │   └── jobSlice.js
        ├── utils/constant.js
        ├── App.jsx, main.jsx, index.css, App.css
        ├── index.html
        ├── package.json
        ├── tailwind.config.js, postcss.config.js, vite.config.js
        └── .eslintrc.cjs, jsconfig.json
```

---

## Quick Start

### Prerequisites

* **Node.js** ≥ 18 and **npm** ≥ 9
* **MongoDB** (local or Atlas)
* **Cloudinary** account (for media uploads)
* **Git**

### 1) Clone the repository

```bash
git clone https://github.com/aryankatiyar15/Job_Portal.git
cd Job_Portal
```

### 2) Backend setup

```bash
cd backend
npm install
# create .env (see variables below)
npm run dev   # or: npm start
```

The API will start on `http://localhost:8000` (or the `PORT` you set).

### 3) Frontend setup

```bash
cd ../frontend
npm install
# create .env (see variables below)
npm run dev
```

The app will be available on `http://localhost:5173` by default.

> **Tip (Windows CRLF warnings):** If you see line‑ending warnings, you can run `git config core.autocrlf true` once to normalize.

---

## Environment Variables

Create a `.env` file in **backend/** with:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster/<db>?retryWrites=true&w=majority
JWT_SECRET=<a-strong-secret>
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

Create a `.env` file in **frontend/** with:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

> Adjust the base URL to match your backend’s prefix (e.g., `/api/v1`).

---

## API Overview

> The exact routes may vary; the following reflects common REST patterns seen in the codebase.

**Auth & Users** (`/api/v1/users`)

* `POST /register` — create account
* `POST /login` — authenticate and receive JWT
* `GET /me` — current user profile (requires auth)

**Companies** (`/api/v1/companies`)

* `POST /` — create/update company (admin)
* `GET /` — list companies
* `GET /:id` — company by id
* `PUT /:id` — update company (admin)

**Jobs** (`/api/v1/jobs`)

* `GET /` — list & filter jobs
* `POST /` — create job (admin)
* `GET /:id` — job detail
* `PUT /:id` — update job (admin)
* `DELETE /:id` — delete job (admin)

**Applications** (`/api/v1/applications`)

* `POST /` — apply to a job (candidate)
* `GET /me` — my applications (candidate)
* `GET /job/:jobId` — applicants for a job (admin)
* `PATCH /:id/status` — update application status (admin)

**Middleware**

* `isAuthenticated` — verifies JWT and attaches `req.user`
* `multer` — parses multipart/form‑data for uploads

---

## Frontend Highlights

* **Routing & Guards:** `ProtectedRoute.jsx` gates admin‑only screens.
* **State Management:** Redux slices:

  * `authSlice.js`, `companySlice.js`, `jobSlice.js`, `applicationSlice.js`
* **Data Hooks:** Encapsulated fetching in `hooks/` (`useGetAllJobs.jsx`, etc.).
* **UI:** Tailwind + shadcn/ui primitives (buttons, inputs, dialogs, tables, carousel, avatar, badge). Toasts via **Sonner**.
* **Pages/Flows:** Login/Signup → Browse/Filter Jobs → Job Details → Apply → Track Applications; Admin → Company Setup → Post Job → Applicants.

---

## Common Pitfalls & Fixes

* **CORS errors:** Ensure `CORS_ORIGIN` matches your frontend URL (e.g., `http://localhost:5173`).
* **Uploads failing:** Check Cloudinary credentials and that `multer` is used on routes expecting files.
* **JWT missing/expired:** Ensure `Authorization: Bearer <token>` is sent on protected APIs.
* **Mongo connection:** Verify `MONGODB_URI` and that the IP is whitelisted on Atlas.

---

