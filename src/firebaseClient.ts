type FirebaseSession = {
  idToken: string;
  refreshToken: string;
  expiresAt: number;
  user: FirebaseUser;
};

export type FirebaseUser = {
  id: string;
  email: string;
};

type FirebaseAuthResponse = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
};

type FirebaseRefreshResponse = {
  id_token: string;
  refresh_token: string;
  expires_in: string;
  user_id: string;
};

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
export const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined;
const sessionKey = "operator-academy-firebase-session-v1";
const authBaseUrl = "https://identitytoolkit.googleapis.com/v1";
const refreshBaseUrl = "https://securetoken.googleapis.com/v1";

export const isFirebaseConfigured = Boolean(apiKey && firebaseProjectId);

function authUrl(endpoint: string) {
  if (!apiKey) throw new Error("Firebase API key is not configured.");
  return `${authBaseUrl}/${endpoint}?key=${apiKey}`;
}

function refreshUrl() {
  if (!apiKey) throw new Error("Firebase API key is not configured.");
  return `${refreshBaseUrl}/token?key=${apiKey}`;
}

function toSession(response: FirebaseAuthResponse): FirebaseSession {
  return {
    idToken: response.idToken,
    refreshToken: response.refreshToken,
    expiresAt: Date.now() + Number(response.expiresIn) * 1000,
    user: {
      id: response.localId,
      email: response.email
    }
  };
}

function saveSession(session: FirebaseSession) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

function readSession(): FirebaseSession | null {
  const raw = localStorage.getItem(sessionKey);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as FirebaseSession;
    return session?.idToken && session?.refreshToken && session?.user?.id ? session : null;
  } catch {
    return null;
  }
}

async function parseFirebaseError(response: Response) {
  try {
    const body = await response.json() as { error?: { message?: string } };
    return firebaseErrorMessage(body.error?.message);
  } catch {
    return "Firebase request failed.";
  }
}

function firebaseErrorMessage(message?: string) {
  switch (message) {
    case "EMAIL_EXISTS":
      return "An account already exists for that email.";
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
      return "The email or password is incorrect.";
    case "USER_DISABLED":
      return "This account has been disabled.";
    case "WEAK_PASSWORD : Password should be at least 6 characters":
      return "Password should be at least 6 characters.";
    default:
      return message ? message.replace(/_/g, " ").toLowerCase() : "Firebase request failed.";
  }
}

async function authenticate(endpoint: "accounts:signInWithPassword" | "accounts:signUp", email: string, password: string) {
  const response = await fetch(authUrl(endpoint), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });

  if (!response.ok) throw new Error(await parseFirebaseError(response));

  const session = toSession(await response.json() as FirebaseAuthResponse);
  saveSession(session);
  return session.user;
}

export async function signInWithFirebase(email: string, password: string) {
  return authenticate("accounts:signInWithPassword", email, password);
}

export async function signUpWithFirebase(email: string, password: string) {
  return authenticate("accounts:signUp", email, password);
}

export function signOutOfFirebase() {
  localStorage.removeItem(sessionKey);
}

export async function getStoredFirebaseUser(): Promise<FirebaseUser | null> {
  if (!isFirebaseConfigured) return null;
  const idToken = await getFirebaseIdToken().catch(() => null);
  if (!idToken) return null;
  return readSession()?.user ?? null;
}

export async function getFirebaseIdToken() {
  const session = readSession();
  if (!session) throw new Error("You are not signed in.");

  if (session.expiresAt > Date.now() + 60_000) {
    return session.idToken;
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refreshToken
  });
  const response = await fetch(refreshUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    signOutOfFirebase();
    throw new Error(await parseFirebaseError(response));
  }

  const refreshed = await response.json() as FirebaseRefreshResponse;
  const nextSession: FirebaseSession = {
    idToken: refreshed.id_token,
    refreshToken: refreshed.refresh_token,
    expiresAt: Date.now() + Number(refreshed.expires_in) * 1000,
    user: session.user.id === refreshed.user_id ? session.user : { ...session.user, id: refreshed.user_id }
  };
  saveSession(nextSession);
  return nextSession.idToken;
}
