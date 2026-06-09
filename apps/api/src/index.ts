import auth from "#api/routes/auth.js";
import permissions from "#api/routes/permissions.js";
import roles from "#api/routes/roles.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.route("/api/auth", auth);
app.route("/api/roles", roles);
app.route("/api/permissions", permissions);

serve(app, (info) => {
    console.log(`API running on http://localhost:${info.port}`);
});
