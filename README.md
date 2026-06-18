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
3. In Firestore Database, create a database.
4. Publish the security rules in `firebase/firestore.rules`.
5. Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
```

6. Deploy the React app to a free static host such as Cloudflare Pages, Netlify, or Firebase Hosting. Use:

```bash
npm run build
```

Build output directory: `dist`

Set the same `VITE_FIREBASE_API_KEY` and `VITE_FIREBASE_PROJECT_ID` values in the host's environment variables.

## Data

Course content is seeded from `src/data/curriculumSeed.ts`.

Desktop/local mode stores progress in SQLite or browser storage. Hosted mode stores one Firestore document per user at:

```text
users/{userId}/appData/course-1
```

That document contains the user's lesson progress, exercise responses, quiz responses, and final project data. Firestore rules restrict reads and writes so authenticated users can only access documents under their own `userId`.

The Firebase web API key is safe to expose in the web app when Authentication and Firestore security rules are configured correctly. Do not put private service account credentials in this app.
