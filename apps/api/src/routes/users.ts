import { Hono } from "hono";
import { prisma } from "../db.js";

const users = new Hono();

users.get("/", async (c) => {
    const data = await prisma.user.findMany({
        include: {
            roles: {
                include: { role: true },
            },
        },
    });

    const usersData = data.map((u) => ({
        id: u.id,
        username: u.username,
        nickname: u.nickname,
        roles: u.roles.map((ur) => ({
            id: ur.role.id,
            name: ur.role.name,
            code: ur.role.code,
        })),
    }));

    return c.json({ data: usersData, message: "ok" });
});

users.put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json<{ nickname?: string; roleCodes?: string[] }>();

    if (body.nickname !== undefined) {
        await prisma.user.update({ where: { id }, data: { nickname: body.nickname } });
    }

    if (body.roleCodes !== undefined) {
        const roles = await prisma.role.findMany({ where: { code: { in: body.roleCodes } } });
        const roleIds = roles.map((r) => r.id);

        await prisma.userRole.deleteMany({ where: { userId: id } });
        if (roleIds.length) {
            await prisma.userRole.createMany({
                data: roleIds.map((roleId) => ({ userId: id, roleId })),
            });
        }
    }

    return c.json({ data: null, message: "更新成功" });
});

export default users;
