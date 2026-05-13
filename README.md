# Kala Surf Admin Dashboard

This is the administrative dashboard for Kala Surf, built with Next.js, Prisma, and PostgreSQL. It integrates directly with the Cloudbeds API to manage add-on items, store custom images, and toggle visibility.

## Prerequisites

Before running this project, make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (running locally or a hosted URL)

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository and install dependencies

```bash
# Clone the repository
git clone https://github.com/Official-Fidev/kala-surf_adminPage.git

# Go into the project directory
cd kala-surf_adminPage

# Install Node modules
npm install
```

### 2. Set up Environment Variables

Create a new file named `.env` in the root of the project. You need to provide your database connection string and API credentials.

```bash
# .env file

# Your PostgreSQL Database connection URL
DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/kala_surf"

# Cloudbeds API Authentication
CLOUDBEDS_API_KEY="your-cloudbeds-api-key-here"
```
*(Note: Replace `YOUR_MAC_USERNAME` with your actual username, or use a hosted database URL if you prefer).*

### 3. Initialize the Database

Make sure your PostgreSQL server is running. Then, sync the Prisma schema to create the required tables in your database:

```bash
# Pushes the schema and creates the `addon_overrides` table
npx prisma db push
```

*(Optional)* If you want to view or edit the database manually, you can open Prisma Studio:
```bash
npx prisma studio
```

### 4. Run the Development Server

Finally, start the Next.js application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
