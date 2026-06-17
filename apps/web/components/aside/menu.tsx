import { Tag, Tree } from "@ioca/react";
import { useLingui } from "@lingui/react";
import { memo } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { adminMenus, menus, type MenuItem } from "../../config/menu.js";
import { useAuth } from "../../src/store/auth";
import { useViewStore } from "../../src/store/view.js";
import css from "./index.module.css";

export const Menu = memo(() => {
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

    function translateMenu(items: MenuItem[]): any {
        return items.map((m) => ({
            ...m,
            title: _(m.title),
            children: m.children ? translateMenu(m.children) : undefined,
        }));
    }
    const translatedMenus = translateMenu(visibleMenus);

    return (
        <div className={css.menuContainer}>
            <menu className={css.menu}>
                <Tree
                    data={translatedMenus}
                    selected={selected}
                    style={{ width: "100%" }}
                    renderExtra={(item) => {
                        if (item.key !== "task") return;
                        return (
                            <Tag className="bg-3" size="small">
                                <b>1</b>
                            </Tag>
                        );
                    }}
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

export const AdminMenu = memo(() => {
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
