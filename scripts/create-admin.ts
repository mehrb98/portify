// Creates the admin account, or resets its password if it already exists.
// Usage: npm run create-admin -- "a long password"   (email comes from ADMIN_EMAIL)
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.argv[2];
  if (!email) throw new Error("Set ADMIN_EMAIL first.");
  if (!password || password.length < 10) throw new Error('Pass a password of at least 10 characters: npm run create-admin -- "..."');

  // Same database and password hashing as the app, but with sign-up allowed for this one call.
  const setup = betterAuth({ database: prismaAdapter(db, { provider: "postgresql" }), emailAndPassword: { enabled: true, minPasswordLength: 10 } });

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    const profile = await db.profile.findUnique({ where: { id: 1 } });
    await setup.api.signUpEmail({ body: { email, password, name: profile?.name ?? "Admin" } });
    console.log(`Created the admin account for ${email}.`);
    return;
  }
  const ctx = await setup.$context;
  const hash = await ctx.password.hash(password);
  const updated = await db.account.updateMany({ where: { userId: user.id, providerId: "credential" }, data: { password: hash } });
  if (!updated.count) {
    await db.account.create({ data: { id: crypto.randomUUID(), accountId: user.id, providerId: "credential", userId: user.id, password: hash } });
  }
  await db.session.deleteMany({ where: { userId: user.id } });
  console.log(`Reset the password for ${email} and signed out its sessions.`);
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
