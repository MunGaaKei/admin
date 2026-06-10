import { Hono } from "hono";
import { prisma } from "../db.js";

const permissions = new Hono();

permissions.get("/", async (c) => {
    const data = await prisma.permission.findMany();
    return c.json({ data, message: "ok" });
});

permissions.post("/", async (c) => {
    const { code } = await c.req.json<{ code: string }>();
    const data = await prisma.permission.upsert({
        where: { code },
        update: {},
        create: { code },
    });
    return c.json({ data, message: "ok" });
});

permissions.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await prisma.permission.delete({ where: { id } });
    return c.json({ data: null, message: "ok" });
});

export default permissions;
