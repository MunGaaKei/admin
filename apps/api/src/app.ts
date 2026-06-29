import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth.js";
import permissions from "./routes/permissions.js";
import roles from "./routes/roles.js";
import users from "./routes/users.js";

export const app = new Hono();

const root = (c: Context) => c.text("ioca admin api serves");

const allowedOrigins = [
    "https://ioca-admin.vercel.app",
    "https://*.vercel.app",
];

app.use(
    "*",
    cors({
        origin: (origin) => {
            if (!origin) return "*";
            if (allowedOrigins.includes(origin)) return origin;
            return "";
        },
        credentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    }),
);

app.get("/", root);
app.get("/test", (c) => c.text("test ok"));
app.get("/api/test", (c) => c.text("api test ok"));

app.route("/api/auth", auth);
app.route("/api/roles", roles);
app.route("/api/permissions", permissions);
app.route("/api/users", users);
