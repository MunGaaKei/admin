import { List } from "lucide-react";

export const menus = [
    {
        key: "menu",
        title: "目录",
        icon: <List size={20} />,
        children: [
            {
                key: "setting",
                title: "设置",
                href: "/setting",
            },
            {
                key: "profile",
                title: "个人资料",
                href: "/profile",
                auth: "user:edit",
            },
        ],
    },
];
