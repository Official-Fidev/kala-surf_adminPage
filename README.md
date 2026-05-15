# Cloudbeds Add-on Manager

An admin dashboard to manage which Cloudbeds add-on items are displayed on a booking website.

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-blue?logo=nodedotjs)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

This application provides an administrative interface to control the visibility and presentation of add-on services and products fetched from the Cloudbeds hospitality platform. It allows an administrator to override default settings, upload custom images, and manage which items appear on a public-facing booking website.

![Dashboard Screenshot](/docs/screenshot.png)

## Features

- **Selective Visibility:** Toggle add-ons to be active or inactive. Only active items are exposed via the public API.
- **Custom Imagery:** Upload and manage a custom image for each add-on, overriding any default from Cloudbeds.
- **Display Order:** [PLACEHOLDER: Feature for re-ordering items is implemented in the UI but backend logic needs to be completed.]
- **Secure Admin Area:** The management dashboard is protected via JWT authentication.
- **Public API:** A read-only public API endpoint serves the curated list of active add-ons for consumption by any booking website frontend.
- **Resilient Fallback:** In case of Cloudbeds API downtime, the system can serve a stale, cached list of add-ons from a local JSON file.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js**: Version 20 or higher.
- **PostgreSQL**: Version 14 or higher.
- **Cloudbeds Account**: An active account with API access enabled.
- **Git**: For cloning the repository.

## Getting Started

Follow the instructions for your operating system to get the development environment running.

<!-- TABS -->
<details>
<summary>macOS (Homebrew)</summary>

1.  **Clone the repository:**
    ```bash
    git clone [PLACEHOLDER: Git repository URL]
    cd admin-kala-surf
    ```

2.  **Install PostgreSQL:**
    ```bash
    brew install postgresql@16
    brew services start postgresql@16
    ```

3.  **Create a database and user:**
    ```bash
    psql postgres
    ```
    ```sql
    -- Run these commands inside the psql shell
    CREATE DATABASE cloudbeds_addons;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE cloudbeds_addons TO myuser;
    \q
    ```

4.  **Install project dependencies:**
    ```bash
    npm install
    ```

5.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the values, especially `DATABASE_URL`, `JWT_SECRET`, and your Cloudbeds credentials. See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed instructions.

6.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

7.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

</details>

<details>
<summary>Windows (WSL2)</summary>

> [!NOTE]
> These instructions should be run inside your WSL2 Linux distribution (e.g., Ubuntu).

1.  **Clone the repository:**
    ```bash
    git clone [PLACEHOLDER: Git repository URL]
    cd admin-kala-surf
    ```

2.  **Install PostgreSQL (on Ubuntu/Debian):**
    ```bash
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    sudo service postgresql start
    ```

3.  **Create a database and user:**
    ```bash
    sudo -u postgres psql
    ```
    ```sql
    -- Run these commands inside the psql shell
    CREATE DATABASE cloudbeds_addons;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE cloudbeds_addons TO myuser;
    \q
    ```

4.  **Install project dependencies:**
    ```bash
    npm install
    ```

5.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the values, especially `DATABASE_URL`, `JWT_SECRET`, and your Cloudbeds credentials. See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed instructions.

6.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

7.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

</details>

<details>
<summary>Linux (Debian/Ubuntu)</summary>

1.  **Clone the repository:**
    ```bash
    git clone [PLACEHOLDER: Git repository URL]
    cd admin-kala-surf
    ```

2.  **Install PostgreSQL:**
    ```bash
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```

3.  **Create a database and user:**
    ```bash
    sudo -u postgres psql
    ```
    ```sql
    -- Run these commands inside the psql shell
    CREATE DATABASE cloudbeds_addons;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE cloudbeds_addons TO myuser;
    \q
    ```

4.  **Install project dependencies:**
    ```bash
    npm install
    ```

5.  **Set up environment variables:**
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in the values, especially `DATABASE_URL`, `JWT_SECRET`, and your Cloudbeds credentials. See [ENVIRONMENT.md](docs/ENVIRONMENT.md) for detailed instructions.

6.  **Run database migrations:**
    ```bash
    npx prisma migrate dev
    ```

7.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

</details>
<!-- END TABS -->

---

> ### ⚠️ Cross-Platform Gotchas
>
> > [!WARNING]
> > **Line Endings (CRLF vs. LF):** Windows and Unix-like systems use different line endings. Git can sometimes cause issues by auto-converting them. We strongly recommend adding a `.gitattributes` file to the root of the project to enforce consistent line endings:
> > ```
> > * text=auto eol=lf
> > ```
>
> > [!TIP]
> > **Environment Variable Syntax:** When setting environment variables for a single command, syntax differs.
> > - **PowerShell (Windows):** `$env:NODE_ENV="development"; npm run dev`
> > - **bash/zsh (macOS/Linux):** `NODE_ENV=development npm run dev`

## Project Structure

The project follows a standard Next.js App Router structure. Key files and directories are outlined below.

```
/
├── app/
│   ├── (admin)/              # Protected admin routes
│   │   ├── layout.tsx
│   │   └── page.tsx          # Main dashboard UI
│   ├── api/                  # API route handlers
│   │   ├── addons/
│   │   │   ├── [id]/
│   │   │   │   ├── image/
│   │   │   │   └── toggle/
│   │   │   └── route.ts      # GET /api/addons
│   │   └── auth/
│   │       ├── login/
│   │       └── logout/
│   ├── login/                # Admin login page
│   └── layout.tsx            # Root layout
├── data/
│   └── addons.json           # Fallback data if Cloudbeds API is down
├── docs/
│   ├── API.md                # This file
│   └── ENVIRONMENT.md        # Env variable documentation
├── lib/
│   ├── auth.ts               # Authentication logic (JWT)
│   ├── cloudbeds.ts          # Cloudbeds API client
│   ├── data.ts               # High-level data access layer
│   └── prisma.ts             # Prisma client initialization
├── prisma/
│   └── schema.prisma         # Database schema definition
├── public/
│   └── uploads/              # Directory for user-uploaded images
├── .env.example              # Template for environment variables
└── next.config.ts            # Next.js configuration
```

## Further Documentation

- **API Reference:** For detailed information on the available API endpoints, see [docs/API.md](docs/API.md).
- **Environment Variables:** For a deep-dive on configuring the application, see [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).
