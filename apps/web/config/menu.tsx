export const menus = [
    {
        key: "setting",
        title: "设置",
        content: () => import("../tabs/setting"),
    },
    {
        key: "profile",
        title: "个人资料",
        content: () => import("../tabs/profile"),
        auth: "user:edit",
    },
];
