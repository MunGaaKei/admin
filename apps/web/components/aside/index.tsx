import { Button, Dropdown, Tree } from "@ioca/react";
import { useLingui } from "@lingui/react";
import { useLingui as useLinguiMacro } from "@lingui/react/macro";
import { hasPermission } from "@web/auth/permissions.js";
import clsx from "clsx";
import { Cog, DoorOpen, Monitor, MonitorCog, MoreHorizontal, PanelLeft } from "lucide-react";
import { memo } from "react";
import { navigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { menus, adminMenus } from "../../config/menu.js";
import { request } from "../../src/api/client.js";
import { useAuth } from "../../src/store/auth";
import { useSettingStore } from "../../src/store/setting";
import { useViewStore } from "../../src/store/view.js";
import { tryto } from "../../src/utils/index.js";
import css from "./index.module.css";

const Menu = memo(() => {
    const openTab = useViewStore((s) => s.openTab);
    const { _ } = useLingui();
    const selected = useViewStore((s) => {
        if (!s.activeViewId) return "";
        const view = s.views.find((v) => v.id === s.activeViewId);
        return view?.activeTabId ?? "";
    });

    const user = useAuth((s) => s.user);
    const permissions = user?.permissions ?? [];

    const visibleMenus = menus.filter((m) => !m.auth || permissions.includes(m.auth));
    const translatedMenus = visibleMenus.map((m) => ({
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

const AdminMenu = memo(() => {
    const { _ } = useLingui();
    const { urlPathname } = usePageContext();
    const selected = urlPathname.startsWith("/admin") ? urlPathname.replace("/admin", "") || "/" : "";

    const items = adminMenus.map((m) => ({
        key: m.key,
        title: _(m.title),
        as: "a" as const,
        href: `/admin${m.key}`,
    }));

    return (
        <div className={css.menuContainer}>
            <menu className={css.menu}>
                <Tree data={items} selected={selected} style={{ width: "100%" }} />
            </menu>
        </div>
    );
});

interface AsideProps {
    mode?: "main" | "admin";
}

export function Aside({ mode = "main" }: AsideProps) {
    const sidebarCollapsed = useSettingStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useSettingStore((s) => s.toggleSidebar);
    const user = useAuth((s) => s.user);
    const logout = useAuth((s) => s.logout);
    const { t } = useLinguiMacro();
    const openTab = useViewStore((s) => s.openTab);

    const isAdmin = mode === "admin";

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

            {isAdmin ? <AdminMenu /> : <Menu />}

            <footer className={css.footer}>
                {!sidebarCollapsed && <a className={css.nickname}>{user?.nickname}</a>}

                {hasPermission("admin") && (
                    <Button flat square href={isAdmin ? "/" : "/admin"}>
                        {isAdmin ? <Monitor size={20} /> : <MonitorCog size={20} />}
                    </Button>
                )}

                <Dropdown
                    width={120}
                    content={
                        <>
                            {!isAdmin && (
                                <Dropdown.Item type="option" onClick={() => openTab("setting")}>
                                    <span>{t`设置`}</span>
                                    <Cog size={16} />
                                </Dropdown.Item>
                            )}

                            <Dropdown.Item type="option" className="error" onClick={handleLogout}>
                                <span>{t`退出`}</span>
                                <DoorOpen size={16} />
                            </Dropdown.Item>
                        </>
                    }
                >
                    <Button flat square>
                        <MoreHorizontal size={20} />
                    </Button>
                </Dropdown>
            </footer>
        </aside>
    );
}
