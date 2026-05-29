import type { User } from "@supabase/supabase-js";
import {
  getAuthCallbackUrl,
  getSupabaseClient,
  isAuthConfigured,
} from "../lib/supabase/client";
import {
  refreshQuizHub,
  syncLocalQuizResultsToCloud,
} from "./quiz-progress";

const REDIRECT_KEY = "pyguide_auth_redirect";

function setVisible(id: string, visible: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden", !visible);
}

function setFlexVisible(id: string, visible: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden", !visible);
  el.classList.toggle("flex", visible);
}

function displayName(user: User): string {
  const meta = user.user_metadata ?? {};
  const name = meta.full_name ?? meta.name;
  if (typeof name === "string" && name.trim()) return name.trim();
  if (user.email) return user.email.split("@")[0] ?? "Signed in";
  return "Signed in";
}

function avatarUrl(user: User): string | null {
  const meta = user.user_metadata ?? {};
  const url = meta.avatar_url ?? meta.picture;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

function initials(user: User): string {
  const name = displayName(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function showAuthError(message: string) {
  window.alert(message);
}

export async function signInWithGoogle(): Promise<void> {
  if (!isAuthConfigured()) {
    showAuthError(
      "Sign-up is not configured yet. Add PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.",
    );
    return;
  }

  const btn = document.getElementById("google-signup-btn");
  btn?.setAttribute("disabled", "true");

  try {
    sessionStorage.setItem(REDIRECT_KEY, window.location.pathname + window.location.search);
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });
    if (error) showAuthError(error.message);
  } catch (err) {
    showAuthError(err instanceof Error ? err.message : "Could not start Google sign-up");
  } finally {
    btn?.removeAttribute("disabled");
  }
}

function updateAuthUI(user: User | null) {
  const signedIn = Boolean(user);
  setVisible("google-signup-wrap", !signedIn);
  setFlexVisible("auth-profile-wrap", signedIn);

  if (!user) return;

  const name = displayName(user);
  const nameEl = document.getElementById("auth-profile-name");
  const avatarEl = document.getElementById("auth-profile-avatar") as HTMLImageElement | null;
  const initialsEl = document.getElementById("auth-profile-initials");
  const profileWrap = document.getElementById("auth-profile-wrap");

  if (nameEl) nameEl.textContent = name;
  if (profileWrap) profileWrap.title = user.email ?? name;

  const photo = avatarUrl(user);
  if (photo && avatarEl) {
    avatarEl.src = photo;
    avatarEl.alt = name;
    avatarEl.classList.remove("hidden");
    initialsEl?.classList.add("hidden");
    initialsEl?.classList.remove("flex");
  } else if (initialsEl) {
    initialsEl.textContent = initials(user);
    initialsEl.classList.remove("hidden");
    initialsEl.classList.add("flex");
    avatarEl?.classList.add("hidden");
    if (avatarEl) avatarEl.removeAttribute("src");
  }
}

async function handleAuthSession(user: User | null): Promise<void> {
  updateAuthUI(user);
  if (user) {
    await syncLocalQuizResultsToCloud(user);
  }
  await refreshQuizHub(user);
}

export async function refreshAuthSession(): Promise<void> {
  if (!isAuthConfigured()) {
    updateAuthUI(null);
    await refreshQuizHub(null);
    return;
  }
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  await handleAuthSession(data.session?.user ?? null);
}

let authListenersBound = false;
let authSubscriptionBound = false;

export function initAuth(): void {
  if (typeof document === "undefined") return;

  if (!authListenersBound) {
    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-google-signin]")) {
        event.preventDefault();
        void signInWithGoogle();
      }
    });
    authListenersBound = true;
  }

  if (isAuthConfigured()) {
    if (!authSubscriptionBound) {
      const supabase = getSupabaseClient();
      supabase.auth.onAuthStateChange((_event, session) => {
        void handleAuthSession(session?.user ?? null);
      });
      authSubscriptionBound = true;
    }
    void refreshAuthSession();
  } else {
    updateAuthUI(null);
    void refreshQuizHub(null);
  }
}

export async function completeAuthCallback(): Promise<string> {
  const params = new URLSearchParams(window.location.search);
  const oauthError = params.get("error_description") ?? params.get("error");
  if (oauthError) {
    throw new Error(oauthError);
  }

  if (!isAuthConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const supabase = getSupabaseClient();
  const code = params.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
  } else {
    const { error } = await supabase.auth.getSession();
    if (error) throw error;
  }

  const redirect = sessionStorage.getItem(REDIRECT_KEY) || "/";
  sessionStorage.removeItem(REDIRECT_KEY);
  return redirect.startsWith("/") ? redirect : "/";
}
