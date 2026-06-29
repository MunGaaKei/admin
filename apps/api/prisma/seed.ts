import { prisma } from "../src/db.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
    const permissions = await Promise.all(
        [
            { code: "*", description: "拥有所有权限" },
            { code: "admin", description: "访问管理后台" },
            { code: "role:edit", description: "编辑角色" },
        ].map((p) =>
            prisma.permission.upsert({
                where: { code: p.code },
                update: {},
                create: p,
            }),
        ),
    );

    const adminRole = await prisma.role.upsert({
        where: { code: "admin" },
        update: {},
        create: {
            name: "管理员",
            code: "admin",
            description: "超级管理员，拥有所有权限",
        },
    });

    await prisma.role.upsert({
        where: { code: "user" },
        update: {},
        create: {
            name: "普通用户",
            code: "user",
            description: "基础用户，拥有有限权限",
        },
    });

    // admin role only gets * permission
    await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
    const starPermission = permissions.find((p) => p.code === "*")!;
    await prisma.rolePermission.create({
        data: { roleId: adminRole.id, permissionId: starPermission.id },
    });

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: { nickname: "Administrator" },
        create: {
            username: "admin",
            nickname: "Administrator",
            password: hashPassword("admin"),
        },
    });

    // assign admin role to admin user
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
        update: {},
        create: { userId: admin.id, roleId: adminRole.id },
    });

    const iann = await prisma.user.upsert({
        where: { username: "iann" },
        update: { nickname: "Iann" },
        create: {
            username: "iann",
            nickname: "Iann",
            password: hashPassword("iann"),
        },
    });

    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: iann.id, roleId: adminRole.id } },
        update: {},
        create: { userId: iann.id, roleId: adminRole.id },
    });

    console.log("Seed done: admin/admin, iann/iann (admin role, * permission)");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
