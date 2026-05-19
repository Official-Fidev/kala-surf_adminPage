# Future Development & Technical Debt

This document outlines key areas for improvement, technical debt to address, and recommendations for scaling the Kala Surf Admin application for production use.

## 1. Authentication Security (Password Hashing)

**Current State:**
In `lib/auth.ts` and `app/api/auth/login/route.ts`, the application compares the provided password against a plaintext environment variable (`ADMIN_PASSWORD`).

**Risk:**
Storing and verifying passwords in plaintext is a significant security vulnerability. If the `.env` file is accidentally exposed or server access is compromised, the admin password is immediately readable.

**Recommendation:**
- Implement **Password Hashing**.
- Store a hashed version of the password in the `.env` file.
- Use a library like `bcryptjs` or `argon2` in `app/api/auth/login/route.ts` to compare the incoming password with the stored hash using `bcrypt.compare()`.

## 2. Image Storage Strategy

**Current State:**
Uploaded images for add-ons are saved directly to the local filesystem at `public/uploads/` (see `app/api/addons/[id]/image/route.ts`).

**Risk:**
- **Ephemeral Storage:** If this application is deployed to a serverless platform (e.g., Vercel, Netlify) or a Docker container without persistent volumes, the `public/uploads` directory will be wiped out upon every redeployment or container restart.
- **Scalability:** Storing files locally on a single server makes it difficult to scale horizontally or use CDNs effectively.

**Recommendation:**
- Migrate to a **Cloud Storage** provider such as AWS S3, Cloudinary, Vercel Blob, or Supabase Storage.
- Update the image upload API to stream files directly to the cloud provider and store the resulting URL in PostgreSQL instead of a local path.

## 3. Cloudbeds API Rate Limiting & Caching

**Current State:**
The public `GET /api/addons` endpoint calls `fetchCloudbedsItems()` synchronously upon every request, merging the result with local Postgres overrides.

**Risk:**
- **Rate Limits:** If the main Kala Surf booking website has high traffic, every visitor will trigger a request to the Cloudbeds API. This can quickly exhaust Cloudbeds API rate limits.
- **Performance:** Response times depend entirely on the latency of the Cloudbeds API, which slows down the frontend booking experience.

**Recommendation:**
- Implement **Caching** for the Cloudbeds API response.
- Use Next.js built-in data cache (`next: { revalidate: 3600 }`) to cache responses for a certain period (e.g., 1 hour).
- Alternatively, use an in-memory store like Redis to cache the fetched add-ons and serve them instantly to the frontend.

## 4. Payload Validation

**Current State:**
API endpoints parse incoming data manually without strict schema validation.

**Risk:**
Improperly formatted or malicious data could cause runtime errors or bypass expected application logic.

**Recommendation:**
- Integrate a validation library like **Zod**.
- Define strict schemas for the login payload, image upload data, and toggle actions to ensure data integrity before touching the database or core logic.

## 5. Image Compression & Optimization

**Current State:**
Images uploaded via the dashboard are saved in their original format and size.

**Risk:**
Uploading 5MB+ images will cause slow loading times on the public booking website, degrading the user experience and SEO.

**Recommendation:**
- Use an image processing library like **Sharp** in the upload API route to automatically resize, compress, and convert uploads to modern web formats (e.g., `.webp`) before saving them.
- Ensure the frontend website uses Next.js `<Image>` component for automatic optimization if applicable.

---

> **Note:** The above items are not critical blockers for a basic MVP hosted on a secure, persistent VPS, but they are essential upgrades as the platform grows, traffic increases, or if the hosting architecture shifts to serverless.
