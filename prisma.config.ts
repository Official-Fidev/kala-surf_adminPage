// prisma.config.ts — Prisma 7 configuration file.
// Prisma 7 breaking change: datasource URL now lives here instead of schema.prisma.
// Docs: https://pris.ly/d/config-datasource

// Prisma CLI doesn't know about .env.local (that's a Next.js thing).
// Load it explicitly so DATABASE_URL is available when running migrate commands.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // Next.js env file (highest priority)
dotenv.config();                        // .env fallback

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

