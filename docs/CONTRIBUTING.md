# Contributing

We welcome contributions from the community! Please follow these guidelines to ensure a smooth development process.

## Development Process

### Branching

Create a new branch for every new feature or bug fix. Use the following naming convention:

-   **Features:** `feature/short-description` (e.g., `feature/reorder-addons`)
-   **Bug Fixes:** `fix/short-description` (e.g., `fix/toggle-api-error`)
-   **Chores/Refactoring:** `chore/short-description` (e.g., `chore/refactor-auth-lib`)

### Commits

Please follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for your commit messages. This helps us automate versioning and generate changelogs.

-   **Examples:**
    -   `feat: add image removal endpoint`
    -   `fix: resolve issue where active status was not updating`
    -   `docs: update API reference for addons endpoint`
    -   `refactor: switch to data-state attributes for toggle component`

## Local Database Management

### Prisma Studio

Prisma Studio is a powerful GUI for viewing and editing your local database. It's great for debugging.

To launch it, run:
```bash
npx prisma studio
```

### Resetting the Database

If you need to completely wipe your local database and start fresh, you can use the `migrate reset` command. This will drop the database, re-create it, and re-apply all migrations.

> [!WARNING]
> This command will permanently delete all data in your local development database.

```bash
npx prisma migrate reset
```

## Pull Request (PR) Checklist

Before submitting a Pull Request, please ensure you have completed the following:

-   [ ] Your code follows the project's coding style.
-   [ ] You have run `npm run lint` and fixed any reported issues.
-   [ ] If you added or changed the database schema, you have created a new Prisma migration (`npx prisma migrate dev --name your-change-name`).
-   [ ] If you added new environment variables, you have updated `.env.example` and `docs/ENVIRONMENT.md`.
-   [ ] You have confirmed that no files from your `public/uploads` directory are included in the commit.
-   [ ] Your branch is up-to-date with the `main` branch.
