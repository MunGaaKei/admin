import { Hono } from "hono";
import { prisma } from "../db.js";

const roles = new Hono();

roles.get("/", async (c) => {
    const data = await prisma.role.findMany({
        include: {
            permissions: {
                include: { permission: true },
            },
        },
    });

    const rolesData = data.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        description: r.description,
        permissionIds: r.permissions.map((rp) => rp.permission.id),
        permissionCodes: r.permissions.map((rp) => rp.permission.code),
    }));

    return c.json({ data: rolesData, message: "ok" });
});

roles.post("/", async (c) => {
    const body = await c.req.json<{ name: string; code: string; description?: string; permissionIds?: number[] }>();

    const role = await prisma.role.create({
        data: {
            name: body.name,
            code: body.code,
            description: body.description,
        },
    });

    if (body.permissionIds?.length) {
        await prisma.rolePermission.createMany({
            data: body.permissionIds.map((permissionId) => ({
                roleId: role.id,
                permissionId,
            })),
        });
    }

    return c.json({ data: role, message: "创建成功" });
});

roles.put("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const body = await c.req.json<{ name?: string; code?: string; description?: string; permissionIds?: number[] }>();

    const role = await prisma.role.update({
        where: { id },
        data: {
            ...(body.name !== undefined && { name: body.name }),
            ...(body.code !== undefined && { code: body.code }),
            ...(body.description !== undefined && { description: body.description }),
        },
    });

    if (body.permissionIds !== undefined) {
        await prisma.rolePermission.deleteMany({ where: { roleId: id } });
        if (body.permissionIds.length) {
            await prisma.rolePermission.createMany({
                data: body.permissionIds.map((permissionId) => ({
                    roleId: id,
                    permissionId,
                })),
            });
        }
    }

    return c.json({ data: role, message: "更新成功" });
});

roles.delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));

    await prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await prisma.userRole.deleteMany({ where: { roleId: id } });
    await prisma.role.delete({ where: { id } });

    return c.json({ data: null, message: "删除成功" });
});

export default roles;
