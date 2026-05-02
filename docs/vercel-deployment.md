# Vercel Deployment Documentation

This document outlines the requirements and steps for deploying the Grantify frontend to Vercel, ensuring all authentication systems function securely in a production environment.

## 1. Environment Variables
You must configure the following Environment Variables in your Vercel project settings (`Settings > Environment Variables`). These values correspond to your Supabase project.

| Variable Name | Description | Example Value |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://[PROJECT_REF].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project anonymous key | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | The production URL of your Vercel deployment. Required for accurate OAuth redirects. | `https://grantify-v1.vercel.app` |

> [!WARNING]
> Do NOT expose your Supabase `SERVICE_ROLE_KEY` to the frontend. Only the `NEXT_PUBLIC_` keys should be present in Vercel.

## 2. Supabase Configuration

### Authentication Providers
Ensure that in the Supabase Dashboard (`Authentication > Providers`), your OAuth providers (Google, Apple, Azure) are enabled and configured with the correct Client IDs and Secrets.

### Redirect URLs
You **must** whitelist your Vercel deployment URL in Supabase for OAuth callbacks to function properly.
1. Go to Supabase Dashboard.
2. Navigate to `Authentication > URL Configuration`.
3. Under **Site URL**, enter your primary Vercel URL (e.g., `https://grantify.vercel.app`).
4. Under **Redirect URLs**, add all possible deployment URLs:
   - `https://grantify.vercel.app/dashboard`
   - `https://grantify.vercel.app/auth/callback` (If applicable)
   - `http://localhost:3000/dashboard` (For local development)

## 3. Vercel Deployment Steps
1. Connect your GitHub repository to Vercel.
2. Select the `Grantify/frontend` directory as the Root Directory (if it's a monorepo) or leave as default.
3. Vercel will automatically detect the **Next.js** framework.
4. Add the environment variables listed in Section 1.
5. Click **Deploy**.

## 4. Post-Deployment Verification
- Access the production Vercel URL.
- Test the standard Email/Password Signup flow.
- Test the Google OAuth flow to verify that redirects lead back to the `[PROD_URL]/dashboard` instead of localhost.
- Ensure the custom UI notifications (e.g., `AuthAlert`) appear cleanly without breaking the layout.
