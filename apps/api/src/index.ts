import auth from "#api/routes/auth.js";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.route("/api/auth", auth);

serve(app, (info) => {
    console.log(`API running on http://localhost:${info.port}`);
});
