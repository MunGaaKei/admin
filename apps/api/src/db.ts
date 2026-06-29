import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const dbUrl = process.env.DATABASE_URL ?? "";
if (dbUrl.startsWith("file:/tmp/")) {
    const dbPath = dbUrl.replace("file:", "");
    if (!existsSync(dbPath)) {
        const dir = dirname(fileURLToPath(import.meta.url));
        const template = [
            resolve(dir, "..", "prisma/dev.db"),       // src/ -> prisma/
            resolve(dir, "prisma/dev.db"),              // flat dir
            resolve(dir, "..", "..", "prisma/dev.db"), // deeper nesting
        ].find(existsSync);
        if (template) {
            copyFileSync(template, dbPath);
        }
    }
}

const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

export const prisma = new PrismaClient({ adapter });
