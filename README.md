# Smart Bookmark App

A realtime bookmark manager built with **Next.js 16, React 19, Supabase, and TailwindCSS**, allowing users to securely authenticate with Google and manage bookmarks with instant synchronization across multiple tabs and devices.

This project was developed as part of a fullstack engineering screening task.

---

# Live Demo

Live URL: https://syncmarks.vercel.app/
GitHub Repo: https://github.com/vedchaudhari/smart-bookmark-app

---


# Assignment Requirements (Completed)

The application satisfies all required functionality:

* Google OAuth authentication (Supabase Auth)
* Add bookmarks (URL + title)
* Delete bookmarks
* Private bookmarks per user using Row Level Security
* Realtime updates across tabs and devices
* Production deployment on Vercel

---

# Tech Stack

Frontend:

* Next.js 16 (App Router)
* React 19
* TypeScript (Strict mode)
* TailwindCSS v4

Backend (Managed):

* Supabase Auth (Google OAuth)
* Supabase PostgreSQL Database
* Supabase Realtime

Deployment:

* Vercel

---

# Architecture Overview

This application uses a modern backend-as-a-service architecture where Supabase provides authentication, database, and realtime functionality.

Flow:

User → Next.js frontend → Supabase Auth → Supabase Database → Supabase Realtime → Frontend UI update

Supabase internally manages WebSocket connections for realtime updates.

---

# Project Structure

```
app/
├── auth/callback/       # OAuth callback handler
├── dashboard/           # Protected bookmark dashboard
├── login/               # Login page
├── layout.tsx           # Root layout
├── page.tsx             # Landing page

components/
├── BookmarkForm.tsx
├── BookmarkList.tsx
├── AuthButton.tsx

context/
├── BookmarkContext.tsx  # Global bookmark state

lib/supabase/
├── server.ts            # Server-side Supabase client
├── client.ts            # Browser-side Supabase client

middleware.ts            # Session management middleware
```

---

# Authentication Flow

Authentication is implemented using Supabase Auth with Google OAuth.

Flow:

1. User clicks "Sign in with Google"
2. Supabase redirects user to Google OAuth
3. Google authenticates user
4. Google redirects back to Supabase callback
5. Supabase exchanges code for session
6. User redirected to dashboard
7. Session stored in secure cookies

Middleware automatically refreshes sessions.

Protected routes verify authentication before rendering.

---

# Database Schema

Table: bookmarks

Columns:

* id (uuid, primary key)
* user_id (uuid, foreign key)
* title (text)
* url (text)
* created_at (timestamp)

Row Level Security ensures users can only access their own bookmarks.

Policies:

```
auth.uid() = user_id
```

---

# Realtime Implementation

Supabase Realtime enables instant synchronization across devices.

Frontend subscribes to database changes:

```
supabase
.channel("bookmarks")
.on("postgres_changes", {
  event: "*",
  schema: "public",
  table: "bookmarks"
}, fetchBookmarks)
.subscribe()
```

When any bookmark is added or deleted:

Supabase Database → Supabase Realtime → All connected clients → UI updates instantly

No refresh required.

This works across:

* Multiple tabs
* Different browsers
* Different devices
* Same account across devices

---

# Problems Encountered and Solutions

This section describes real engineering challenges faced during development.

---

## Problem 1: Realtime updates were not working initially

Symptom:

Bookmarks were successfully inserted but did not appear instantly. Manual refresh was required.

Root Cause:

The bookmarks table was not added to the supabase_realtime publication.

Supabase only emits realtime events for tables included in realtime publications.

Solution:

Enabled realtime publication:

Supabase Dashboard → Database → Publications → supabase_realtime → Enabled bookmarks table

Result:

Realtime synchronization worked instantly across all tabs and devices.

---

## Problem 2: Google OAuth required manual configuration

Symptom:

Supabase required Client ID and Client Secret to enable Google login.

Root Cause:

Google OAuth credentials were not configured in Google Cloud Console.

Solution:

Created OAuth credentials in Google Cloud Console.

Added Supabase callback URL:

```
https://PROJECT_ID.supabase.co/auth/v1/callback
```

Configured Client ID and Client Secret in Supabase.

Result:

Google authentication worked successfully.

---

## Problem 3: Frontend did not update automatically after database changes

Symptom:

Database had realtime enabled, but UI did not update.

Root Cause:

Frontend must explicitly subscribe to realtime events.

Solution:

Implemented realtime subscription using Supabase client.

```
supabase.channel().on().subscribe()
```

Result:

UI updates instantly when database changes.

---

## Problem 4: Session handling and protected routes

Symptom:

Dashboard needed protection from unauthenticated access.

Solution:

Implemented authentication checks using Supabase client and middleware.

Unauthenticated users redirected to login.

Result:

Secure route protection.

---

# State Management

Bookmark state is managed using React Context:

BookmarkProvider shares state across components.

This avoids prop drilling and ensures UI consistency.

---

# Environment Variables

Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

---

# Running Locally

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Deployment

Deployed on Vercel.

Steps:

1. Push code to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy

---

# Realtime Behavior Verification

Tested successfully across:

* Multiple browser tabs
* Incognito mode
* Different devices
* Same account across devices

Changes reflect instantly without refresh.

---

# Future Improvements

* Edit bookmarks
* Search functionality
* Bookmark categories
* Bookmark sharing
* Offline support

---

# Conclusion

This project demonstrates:

* Secure authentication using OAuth
* Realtime frontend synchronization
* Modern fullstack architecture
* Database security using Row Level Security
* Production-ready deployment

Supabase Realtime ensures instant data synchronization across all connected clients.
