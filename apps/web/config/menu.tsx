import { ITreeItem } from "@ioca/react/components/tree/type";
import { msg } from "@lingui/core/macro";
import {
    BookMarked,
    LayoutPanelLeft,
    ListTodo,
    ScrollText,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export interface MenuItem extends Omit<ITreeItem, "title"> {
    key: string;
    title: ReturnType<typeof msg> | ReactNode;
    content?: () => Promise<{ default: ComponentType<any> }>;
    children?: MenuItem[];
    auth?: string;
    hidden?: boolean;
}

export const menus: MenuItem[] = [
    {
        key: "dashboard",
        title: msg`仪表盘`,
        icon: <LayoutPanelLeft size={20} fill="var(--color-7)" />,
        content: () => import("../tabs/dashboard"),
    },
    {
        key: "task",
        title: msg`任务`,
        icon: <ListTodo size={20} fill="var(--color-7)" />,
        content: () => import("../tabs/task"),
        keepDOM: true,
        children: [
            {
                key: "file",
                title: msg`文件`,
                icon: <ScrollText size={20} />,
                content: () => import("../tabs/task/files/file"),
            },
        ],
    },
    {
        key: "support",
        title: msg`支持`,
        icon: <BookMarked size={20} />,
        content: () => import("../tabs/support"),
    },
];

export const adminMenus = [
    {
        key: "/",
        title: msg`首页`,
    },
    {
        key: "/user",
        title: msg`用户管理`,
    },
    {
        key: "/roles",
        title: msg`角色管理`,
    },
];
