# Operator Academy

Operator Academy is an executive communication learning platform for design leaders. The desktop app stays local-first with SQLite. The hosted web app uses Firebase Authentication and Firestore so each signed-in user sees only their own progress and work.

## Course

**Executive Communication Foundations for Design Leaders**

Unit 1: **Communicating Like an Executive**

Lessons:

1. Lead With the Point
2. Separate Context From Recommendation
3. Make the Business Impact Explicit
4. Frame the Ask
5. Communicate Tradeoffs
6. Final Project: Rewrite a Real Executive Update

Each lesson includes an overview, book-connected reading assignment, video assignment, concept explanation, bad and better examples, guided practice, quiz, real-work application, reflection, and checkpoint.

## Stack

- Tauri
- React
- TypeScript
- SQLite through `@tauri-apps/plugin-sql` for desktop/local mode
- Firebase Authentication + Firestore REST API for hosted web mode
- Tailwind CSS
- Recharts

## Run Locally

```bash
cd /Users/mbedner/Documents/Codex/2026-06-11/operator-academy
npm run tauri:dev
```

If an old terminal cannot find Cargo, run this once first:

```bash
source "$HOME/.cargo/env"
```

For browser-only local development:

```bash
npm run dev
```

## Hosted Web Setup

The app only requires login when Firebase environment variables are present. Without those variables, it continues to use local browser or desktop storage.

1. Create a free Firebase project on the Spark plan.
2. In Firebase Authentication, enable Email/Password sign-in.
3. Optional but recommended: in Firebase Authentication, enable Google sign-in.
4. In Firestore Database, create a database.
5. Publish the security rules in `firebase/firestore.rules`.
6. Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_GOOGLE_CLIENT_ID=your-google-oauth-web-client-id
```

7. Deploy the React app to a free static host such as Cloudflare Pages, Netlify, or Firebase Hosting. Use:

```bash
npm run build
```

Build output directory: `dist`

Set the same `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, and `VITE_GOOGLE_CLIENT_ID` values in the host's environment variables.

## Google Sign-In Setup

To enable the Google button on the sign-in screen:

1. In Firebase Authentication, open **Sign-in method**.
2. Enable **Google** as a provider and choose a support email.
3. Open Google Cloud Console for the same project.
4. Go to **APIs & Services > Credentials**.
5. Create or open a **Web application** OAuth client.
6. Add local and hosted origins under **Authorized JavaScript origins**:

```text
http://localhost
http://localhost:1420
http://localhost:1421
https://your-production-domain.com
```

7. Copy the OAuth web client ID into `VITE_GOOGLE_CLIENT_ID`. It should look like `1234567890-abc.apps.googleusercontent.com`.


## PWA

The hosted web app includes installable PWA metadata:

- `public/manifest.webmanifest`
- `public/service-worker.js`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

On supported browsers, users can install Operator Academy from the browser address bar or browser menu after the Cloudflare deployment is live.

## Data

Course content is seeded from `src/data/curriculumSeed.ts`.

Desktop/local mode stores progress in SQLite or browser storage. Hosted mode stores one Firestore document per user at:

```text
users/{userId}/appData/course-1
```

That document contains the user's lesson progress, exercise responses, quiz responses, and final project data. Firestore rules restrict reads and writes so authenticated users can only access documents under their own `userId`.

The Firebase web API key is safe to expose in the web app when Authentication and Firestore security rules are configured correctly. Do not put private service account credentials in this app.
