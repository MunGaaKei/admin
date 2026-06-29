import { Hono } from "hono";
import { prisma } from "../db.js";
import { hashPassword } from "../utils/password.js";

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

users.post("/", async (c) => {
    const body = await c.req.json<{ username: string; nickname: string; password: string; roleCodes?: string[] }>();

    const password = hashPassword(body.password);
    const user = await prisma.user.create({
        data: {
            username: body.username,
            nickname: body.nickname,
            password,
        },
    });

    if (body.roleCodes?.length) {
        const roles = await prisma.role.findMany({ where: { code: { in: body.roleCodes } } });
        await prisma.userRole.createMany({
            data: roles.map((r) => ({ userId: user.id, roleId: r.id })),
        });
    }

    return c.json({ data: user, message: "创建成功" });
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

users.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    await prisma.user.delete({ where: { id } });

    return c.json({ data: null, message: "删除成功" });
});

export default users;
