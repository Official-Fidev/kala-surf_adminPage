# Environment Variable Configuration

This document provides a detailed reference for all environment variables used by the Cloudbeds Add-on Manager.

## Variable Reference

| Variable              | Required | Default            | Description                                                                                                   |
| :-------------------- | :------- | :----------------- | :------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`        | Yes      | -                  | Full connection string for the PostgreSQL database.                                                           |
| `JWT_SECRET`          | Yes      | -                  | A long, random string for signing authentication tokens. **Must be kept secret.**                             |
| `CLOUDBEDS_API_KEY`   | Yes      | -                  | Your API key for the Cloudbeds API.                                                                           |
| `CLOUDBEDS_PROPERTY_ID`| Yes      | -                  | The ID of your property in Cloudbeds.                                                                         |
| `NEXT_PUBLIC_APP_URL` | No       | `http://localhost:3000` | The public base URL of the application, used for generating links.                                              |
| `UPLOAD_DIR`          | No       | `./public/uploads` | The local directory for storing uploaded images. Must be within `public/` to be web-accessible.             |

---

## Detailed Configuration

### Generating a Secure `JWT_SECRET`

Your `JWT_SECRET` should be a cryptographically random string of at least 32 characters. Do not use a common phrase. Here are several ways to generate a secure secret:

-   **OpenSSL (macOS/Linux):**
    ```bash
    openssl rand -base64 32
    ```

-   **Node.js:**
    ```bash
    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    ```

-   **PowerShell (Windows):**
    ```powershell
    $bytes = New-Object byte[] 32
    $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    $rng.GetBytes($bytes)
    [System.Convert]::ToBase64String($bytes)
    ```

### Constructing the `DATABASE_URL`

The format for the connection string is:
`postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>`

-   **`<USER>`:** Your PostgreSQL username (e.g., `myuser`).
-   **`<PASSWORD>`:** Your PostgreSQL password. If it contains special characters (e.g., `@`, `:`, `/`), you **must** URL-encode them.
-   **`<HOST>`:** The database host. For local development, this is typically `localhost`.
-   **`<PORT>`:** The database port. The default for PostgreSQL is `5432`.
-   **`<DATABASE>`:** The name of the database you created (e.g., `cloudbeds_addons`).

**Example for local development:**
`postgresql://myuser:mypassword@localhost:5432/cloudbeds_addons`

### Getting Cloudbeds Credentials

You can obtain your `CLOUDBEDS_API_KEY` and `CLOUDBEDS_PROPERTY_ID` from your Cloudbeds account dashboard.

1.  Log in to your Cloudbeds account.
2.  Navigate to **Manage** (gear icon) > **Apps & Marketplace** > **API**.
3.  [PLACEHOLDER: Add specific instructions or a link to the official Cloudbeds guide for generating API keys.]
4.  Your Property ID can also be found in this section or in your account settings.

### Image Uploads (`UPLOAD_DIR`)

> [!WARNING]
> **Production Storage:** The default configuration saves uploaded images to the local filesystem at `public/uploads`. This is **not suitable for production** environments, especially on platforms with ephemeral filesystems like Vercel, Heroku, or containerized deployments.
>
> For production, you should switch to a cloud-based storage solution like **AWS S3**, **Google Cloud Storage**, or **Cloudflare R2**. This would involve:
> 1.  Installing the appropriate SDK (e.g., `@aws-sdk/client-s3`).
> 2.  Modifying the image upload logic in `/api/addons/[id]/image/route.ts` to upload files to your cloud bucket instead of the local disk.
> 3.  Adding new environment variables for your storage provider (bucket name, access keys, region).

When running locally, ensure the application has write permissions for the `public/uploads` directory. This directory is included in `.gitignore` by default to prevent committed images from bloating the repository.
