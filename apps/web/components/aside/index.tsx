import { Button, Dropdown } from "@ioca/react";
import { hasPermission } from "@web/auth/permissions.js";
import clsx from "clsx";
import { Home, MonitorCog, MoreHorizontal, PanelLeft } from "lucide-react";
import { useState } from "react";
import { navigate } from "vike/client/router";
import { request } from "../../src/api/client.js";
import { useAuth } from "../../src/store/auth";
import { useSettingStore } from "../../src/store/setting";
import { tryto } from "../../src/utils/index.js";
import SettingModal from "../setting-modal";
import css from "./index.module.css";
import { AdminMenu, Menu } from "./menu.js";
import { UserPopup } from "./popup.js";

interface AsideProps {
    mode?: "main" | "admin";
}

export function Aside({ mode = "main" }: AsideProps) {
    const sidebarCollapsed = useSettingStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useSettingStore((s) => s.toggleSidebar);
    const user = useAuth((s) => s.user);
    const logout = useAuth((s) => s.logout);

    const nickname = user?.nickname ?? "";
    const initials = /[一-鿿]/.test(nickname)
        ? nickname.charAt(0)
        : nickname.slice(0, 2);

    const isAdmin = mode === "admin";
    const [settingVisible, setSettingVisible] = useState(false);

    async function handleLogout() {
        await tryto(request("auth/logout", { method: "post" }));
        logout();
        await navigate("/login");
    }

    return (
        <>
            <aside
                className={clsx(css.aside, {
                    [css.collapsed]: sidebarCollapsed,
                })}
            >
                <header className={css.header}>
                    <a href="/">
                        <img src="/logo.png" className={css.logo} />
                    </a>

                    <div className="flex-1"></div>

                    {import.meta.env.VITE_ADMIN_ENABLE === "true" &&
                        hasPermission("admin") && (
                            <Button flat square href={isAdmin ? "/" : "/admin"}>
                                {isAdmin ? (
                                    <Home size={20} />
                                ) : (
                                    <MonitorCog size={20} />
                                )}
                            </Button>
                        )}

                    <Button flat square onClick={toggleSidebar}>
                        <PanelLeft size={20} />
                    </Button>
                </header>

                {isAdmin ? <AdminMenu /> : <Menu />}

                <footer className={css.footer}>
                    <Dropdown
                        className={css.popup}
                        position="right"
                        width={132}
                        content={(close) => (
                            <UserPopup
                                close={close}
                                onLogout={handleLogout}
                                onOpenSetting={() => setSettingVisible(true)}
                            />
                        )}
                    >
                        <div className={css.user}>
                            {sidebarCollapsed && (
                                <div className={css.avatar}>{initials}</div>
                            )}

                            {!sidebarCollapsed && (
                                <b className={css.nickname}>{user?.nickname}</b>
                            )}

                            {!sidebarCollapsed && <MoreHorizontal size={20} />}
                        </div>
                    </Dropdown>
                </footer>
            </aside>

            <SettingModal
                visible={settingVisible}
                onClose={() => setSettingVisible(false)}
            />
        </>
    );
}
