import { Hono } from "hono";
import { prisma } from "../db.js";

const permissions = new Hono();

permissions.get("/", async (c) => {
    const data = await prisma.permission.findMany();
    return c.json({ data, message: "ok" });
});

export default permissions;
