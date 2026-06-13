import { msg } from "@lingui/core/macro";
import { Gauge, Telescope } from "lucide-react";

export const menus = [
    {
        key: "dashboard",
        title: msg`仪表盘`,
        icon: <Gauge size={20} />,
        content: () => import("../tabs/dashboard"),
    },
    {
        key: "explore",
        title: msg`探索`,
        icon: <Telescope size={20} />,
        content: () => import("../tabs/explore"),
    },
];

export const adminMenus = [
    {
        key: "/user",
        title: msg`用户管理`,
    },
    {
        key: "/roles",
        title: msg`角色管理`,
    },
];
