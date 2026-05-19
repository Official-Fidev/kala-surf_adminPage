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

## 2. Image Compression & Optimization (Pending)

**Current State:**
Images uploaded via the dashboard are saved in their original format and size directly via `fs.writeFileSync`.

**Risk:**
Uploading 5MB+ images will cause slow loading times on the public booking website, degrading the user experience and SEO.

**Recommendation:**
- Previously, we attempted to integrate **Sharp** to automatically resize and convert uploads to `.webp`. However, the library was removed because the specific VPS used for deployment runs on an older CPU architecture that does not support the AVX instructions (`v2 microarchitecture`) required by Sharp's pre-compiled Linux binaries.
- Once the application is moved to a modern Cloud Server, Vercel, or after Sharp is built from source (`npm rebuild --build-from-source sharp`), the compression logic can be safely re-added.

---

## ✅ Recently Resolved / Implemented

The following technical debt items have been recently addressed and are now part of the active codebase:

### 1. Authentication Security (Password Hashing)
- **Resolved:** The application now uses `bcryptjs` to securely hash and verify passwords in `app/api/auth/login/route.ts`. The `.env` file now expects `ADMIN_PASSWORD_HASH` instead of a plaintext password.

### 2. Payload Validation
- **Resolved:** `zod` has been integrated into the login API endpoint to enforce strict schema validation on incoming request payloads, preventing malformed data from causing runtime errors.

### 3. Cloudbeds API Rate Limiting & Caching
- **Resolved:** Implemented Next.js data caching (`next: { revalidate: 900 }`) in `lib/cloudbeds.ts`. The Cloudbeds API response is now cached for 15 minutes to prevent rate limiting and improve frontend performance during high traffic.



> **Note:** The pending Image Storage Strategy upgrade is not a critical blocker if the MVP is hosted on a secure, persistent VPS. However, it is an essential upgrade if the hosting architecture shifts to serverless.
