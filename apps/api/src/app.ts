import { existsSync, copyFileSync } from "fs";
import auth from "#api/routes/auth.js";
import permissions from "#api/routes/permissions.js";
import roles from "#api/routes/roles.js";
import users from "#api/routes/users.js";
import { Hono } from "hono";
import { cors } from "hono/cors";

// On Vercel /tmp, copy template DB if not exists (first cold start)
const dbUrl = process.env.DATABASE_URL ?? "";
if (dbUrl.startsWith("file:/tmp/")) {
  const dbPath = dbUrl.replace("file:", "");
  if (!existsSync(dbPath)) {
    copyFileSync("./prisma/dev.db", dbPath);
  }
}

export const app = new Hono();

app.use("/api/*", cors({
  origin: process.env.WEB_URL ?? "http://localhost:5173",
  credentials: true,
}));

app.route("/api/auth", auth);
app.route("/api/roles", roles);
app.route("/api/permissions", permissions);
app.route("/api/users", users);
