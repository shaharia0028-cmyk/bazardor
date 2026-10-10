import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { db } from "./mongodb";

const googleId = process.env.GOOGLE_CLIENT_ID;
const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    // After sign-up the user is sent to the sign-in page (assignment requirement).
    autoSignIn: false,
    // Email verification / password reset are intentionally left out.
    requireEmailVerification: false,
  },

  // A provider is only switched on once its keys are present in .env
  socialProviders: {
    ...(googleId && googleSecret ? { google: { clientId: googleId, clientSecret: googleSecret } } : {}),
    ...(githubId && githubSecret ? { github: { clientId: githubId, clientSecret: githubSecret } } : {}),
  },

  // Must be the last plugin: lets server actions / components set cookies.
  plugins: [nextCookies()],
});
