import { prisma } from "../src/db.js";
import { hashPassword } from "../src/utils/password.js";

async function main() {
    const permissions = await Promise.all(
        [
            { code: "user:edit", description: "编辑用户" },
            { code: "user:delete", description: "删除用户" },
            { code: "role:edit", description: "编辑角色权限" },
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

    // assign all permissions to admin role
    for (const p of permissions) {
        await prisma.rolePermission.upsert({
            where: { roleId_permissionId: { roleId: adminRole.id, permissionId: p.id } },
            update: {},
            create: { roleId: adminRole.id, permissionId: p.id },
        });
    }

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: { nickname: "管理员" },
        create: {
            username: "admin",
            nickname: "管理员",
            password: hashPassword("admin"),
        },
    });

    // assign admin role to admin user
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } },
        update: {},
        create: { userId: admin.id, roleId: adminRole.id },
    });

    console.log("Seed done: admin/admin (admin role, all permissions)");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
