import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

/** Returns the current session (or null) – safe to call from any server component. */
export async function getSession() {
  // Read the headers OUTSIDE the try/catch: this call is what marks the page as
  // dynamic, and Next.js signals that by throwing – which must not be swallowed.
  const requestHeaders = await headers();

  try {
    return await auth.api.getSession({ headers: requestHeaders });
  } catch {
    // e.g. database not configured yet – behave like "logged out"
    return null;
  }
}

/**
 * Protects a page. Logged-out visitors are sent to /signin,
 * which shows a toast and brings them back to `returnTo` after login.
 */
export async function requireSession(returnTo: string) {
  const session = await getSession();
  if (!session) {
    redirect(`/signin?redirect=${encodeURIComponent(returnTo)}&reason=protected`);
  }
  return session;
}

/** Only allow same-site relative paths as post-login redirect targets. */
export function safeRedirect(target: string | undefined): string {
  return target && target.startsWith("/") && !target.startsWith("//") ? target : "/";
}
