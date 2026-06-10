import { msg } from "@lingui/core/macro";

export const menus = [
    {
        key: "setting",
        title: msg`设置`,
        content: () => import("../tabs/setting"),
    },
    {
        key: "profile",
        title: msg`个人资料`,
        content: () => import("../tabs/profile"),
        auth: "user:edit",
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
