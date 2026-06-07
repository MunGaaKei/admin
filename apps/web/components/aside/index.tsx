import { Button, Dropdown, Tree } from "@ioca/react";
import clsx from "clsx";
import { Cog, DoorOpen, MoreHorizontal, PanelLeft } from "lucide-react";
import { memo } from "react";
import { navigate } from "vike/client/router";
import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { menus } from "../../config/menu.js";
import { request } from "../../src/api/client.js";
import { useAuth } from "../../src/store/auth";
import { useSettingStore } from "../../src/store/setting";
import { tryto } from "../../src/utils/index.js";
import css from "./index.module.css";

import { useViewStore } from "../../src/store/view.js";

const footerSettings = msg`设置`;
const footerLogout = msg`退出`;

const Menu = memo(() => {
    const openTab = useViewStore((s) => s.openTab);
    const { _ } = useLingui();
    const selected = useViewStore((s) => {
        if (!s.activeViewId) return "";
        const view = s.views.find((v) => v.id === s.activeViewId);
        return view?.activeTabId ?? "";
    });

    const translatedMenus = menus.map((m) => ({
        ...m,
        title: _(m.title),
    }));

    return (
        <div className={css.menuContainer}>
            <menu className={css.menu}>
                <Tree
                    data={translatedMenus}
                    selected={selected}
                    style={{ width: "100%" }}
                    onItemClick={(item: any) => {
                        if (item.key) {
                            openTab(item.key);
                        }
                    }}
                />
            </menu>
        </div>
    );
});

export function Aside() {
    const sidebarCollapsed = useSettingStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useSettingStore((s) => s.toggleSidebar);
    const user = useAuth((s) => s.user);
    const logout = useAuth((s) => s.logout);
    const { _ } = useLingui();

    async function handleLogout() {
        await tryto(request("auth/logout", { method: "post" }));
        logout();
        await navigate("/login");
    }

    return (
        <aside className={clsx(css.aside, { [css.collapsed]: sidebarCollapsed })}>
            <header className={css.header}>
                <img src="/logo.png" className={css.logo} />

                <Button flat square className="ml-auto" onClick={toggleSidebar}>
                    <PanelLeft size={20} />
                </Button>
            </header>

            <Menu />

            <footer className={css.footer}>
                {!sidebarCollapsed && <a className={css.nickname}>{user?.nickname}</a>}

                <Dropdown
                    width={120}
                    content={(close) => {
                        return (
                            <>
                                <Dropdown.Item type="option">
                                    <span>{_(footerSettings)}</span>
                                    <Cog size={16} />
                                </Dropdown.Item>

                                <Dropdown.Item type="option" className="error" onClick={handleLogout}>
                                    <span>{_(footerLogout)}</span>
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
