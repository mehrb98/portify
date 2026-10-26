import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

// Email and password sign-in for the site owner. Public sign-up is off:
// the one account is created with `npm run create-admin`.
export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 10,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day while in use
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },
  plugins: [nextCookies()], // must stay last
});
