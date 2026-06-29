import { Tag, Tree } from "@ioca/react";
import { useLingui } from "@lingui/react";
import type { MessageDescriptor } from "@lingui/core";
import { memo } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { adminMenus, menus, type MenuItem } from "../../config/menu.js";
import { useAuth } from "../../src/store/auth";
import { useViewStore } from "../../src/store/view.js";
import css from "./index.module.css";

export const Menu = memo(() => {
    const openTab = useViewStore((s) => s.openTab);
    const { _ } = useLingui();
    const pageContext = usePageContext();
    const isError = !!(pageContext as any).is404 || !!(pageContext as any).abortStatusCode;
    const selected = useViewStore((s) => {
        if (!s.activeViewId) return "";
        const view = s.views.find((v) => v.id === s.activeViewId);
        return view?.activeTabId ?? "";
    });

    const user = useAuth((s) => s.user);
    const permissions = user?.permissions ?? [];

    function translateMenu(items: MenuItem[]): any {
        return items
            .filter((m) => !m.hidden && (!m.auth || permissions.includes(m.auth)))
            .map((m) => ({
                ...m,
                title: _(m.title as MessageDescriptor),
                children: m.children ? translateMenu(m.children) : undefined,
            }));
    }
    const translatedMenus = translateMenu(menus);

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
                        if (!item.key) return;
                        if (isError) {
                            navigate(`/?tab=${item.key}`);
                        } else if (item.href) {
                            navigate(item.href);
                        } else {
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
