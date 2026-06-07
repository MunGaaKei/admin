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
