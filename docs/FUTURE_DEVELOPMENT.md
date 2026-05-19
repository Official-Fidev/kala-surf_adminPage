# Future Development & Technical Debt

This document outlines key areas for improvement, technical debt to address, and recommendations for scaling the Kala Surf Admin application for production use.

## 1. Image Storage Strategy (Pending)

**Current State:**
Uploaded images for add-ons are saved directly to the local filesystem at `public/uploads/` (see `app/api/addons/[id]/image/route.ts`).

**Risk:**
- **Ephemeral Storage:** If this application is deployed to a serverless platform (e.g., Vercel, Netlify) or a Docker container without persistent volumes, the `public/uploads` directory will be wiped out upon every redeployment or container restart.
- **Scalability:** Storing files locally on a single server makes it difficult to scale horizontally or use CDNs effectively.

**Recommendation:**
- Migrate to a **Cloud Storage** provider such as AWS S3, Cloudinary, Vercel Blob, or Supabase Storage.
- Update the image upload API to stream files directly to the cloud provider and store the resulting URL in PostgreSQL instead of a local path.

---

## ✅ Recently Resolved / Implemented

The following technical debt items have been recently addressed and are now part of the active codebase:

### 1. Authentication Security (Password Hashing)
- **Resolved:** The application now uses `bcryptjs` to securely hash and verify passwords in `app/api/auth/login/route.ts`. The `.env` file now expects `ADMIN_PASSWORD_HASH` instead of a plaintext password.

### 2. Payload Validation
- **Resolved:** `zod` has been integrated into the login API endpoint to enforce strict schema validation on incoming request payloads, preventing malformed data from causing runtime errors.

### 3. Cloudbeds API Rate Limiting & Caching
- **Resolved:** Implemented Next.js data caching (`next: { revalidate: 900 }`) in `lib/cloudbeds.ts`. The Cloudbeds API response is now cached for 15 minutes to prevent rate limiting and improve frontend performance during high traffic.

### 4. Image Compression & Optimization
- **Resolved:** Integrated `sharp` into the image upload pipeline. Uploaded images are automatically resized (max width 800px) and converted to highly optimized `.webp` format (80% quality) before being saved to the local disk.

---

> **Note:** The pending Image Storage Strategy upgrade is not a critical blocker if the MVP is hosted on a secure, persistent VPS. However, it is an essential upgrade if the hosting architecture shifts to serverless.
