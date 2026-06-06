import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";
import { prisma } from "../db.js";
import { verifyPassword } from "../utils/password.js";
const app = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || "admin-secret";

async function getUserPermissions(userId: number) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });

  const roles = userRoles.map((ur) => ur.role.code);
  const permissions = [
    ...new Set(userRoles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.code))),
  ];

  return { roles, permissions };
}

app.post("/login", async (c) => {
  const { username, password } = await c.req.json<{
    username: string;
    password: string;
  }>();

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !verifyPassword(password, user.password)) {
    return c.json({ message: "Invalid username or password" }, 401);
  }

  const token = await sign({ sub: user.id, username: user.username }, JWT_SECRET, "HS256");

  setCookie(c, "token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
    maxAge: 86400 * 7,
  });

  const { roles, permissions } = await getUserPermissions(user.id);

  return c.json({
    data: { token, user: { id: user.id, username: user.username, nickname: user.nickname, roles, permissions } },
    message: "ok",
  });
});

app.get("/verify", async (c) => {
  let token: string | undefined;

  const auth = c.req.header("Authorization");
  if (auth?.startsWith("Bearer ")) {
    token = auth.slice(7);
  } else {
    token = c.req.header("Cookie")?.split("; ").find((p) => p.startsWith("token="))?.slice(6);
  }

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  try {
    const payload = await verify(token, JWT_SECRET, "HS256");
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as number },
    });
    if (!user) {
      return c.json({ message: "User not found" }, 401);
    }

    const { roles, permissions } = await getUserPermissions(user.id);

    return c.json({
      data: { user: { id: user.id, username: user.username, nickname: user.nickname, roles, permissions } },
      message: "ok",
    });
  } catch {
    return c.json({ message: "Invalid token" }, 401);
  }
});

app.post("/logout", (c) => {
  setCookie(c, "token", "", { maxAge: 0, path: "/" });
  return c.json({ data: null, message: "ok" });
});

export default app;
