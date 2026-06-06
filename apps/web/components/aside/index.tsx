import { Button, Dropdown, Tree } from "@ioca/react";
import clsx from "clsx";
import { Cog, DoorOpen, MoreHorizontal, PanelLeft } from "lucide-react";
import { memo, useState } from "react";
import { navigate } from "vike/client/router";
import { menus } from "../../config/menu.js";
import { request } from "../../src/api/client.js";
import { useAuth } from "../../src/store/auth";
import { tryto } from "../../src/utils/index.js";
import css from "./index.module.css";

const Menu = memo(() => {
    const [selected, setSelected] = useState("");

    return (
        <div className={css.menuContainer}>
            <menu className={css.menu}>
                <Tree data={menus} selected={selected} style={{ width: "100%" }} />
            </menu>
        </div>
    );
});

export function Aside() {
    const [collapsed, setCollapsed] = useState(false);
    const user = useAuth((s) => s.user);
    const logout = useAuth((s) => s.logout);

    async function handleLogout() {
        await tryto(request("auth/logout", { method: "post" }));
        logout();
        await navigate("/login");
    }

    return (
        <aside className={clsx(css.aside, { [css.collapsed]: collapsed })}>
            <header className={css.header}>
                <img src="/logo.png" className={css.logo} />

                <Button flat square className="ml-auto" onClick={() => setCollapsed((v) => !v)}>
                    <PanelLeft size={20} />
                </Button>
            </header>

            <Menu />

            <footer className={css.footer}>
                {!collapsed && <a className={css.nickname}>{user?.nickname}</a>}

                <Dropdown
                    width={120}
                    content={(close) => {
                        return (
                            <>
                                <Dropdown.Item type="option" onClick={() => navigate("/setting")}>
                                    <span>设置</span>
                                    <Cog size={16} />
                                </Dropdown.Item>

                                <Dropdown.Item type="option" className="error" onClick={handleLogout}>
                                    <span>退出</span>
                                    <DoorOpen size={16} />
                                </Dropdown.Item>
                            </>
                        );
                    }}
                >
                    <Button flat square className="ml-auto">
                        <MoreHorizontal size={20} />
                    </Button>
                </Dropdown>
            </footer>
        </aside>
    );
}
