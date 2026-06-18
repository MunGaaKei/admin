import { Tabs } from "@ioca/react";
import { useEffect, useState, type ComponentType } from "react";
import { useLingui } from "@lingui/react";
import type { MessageDescriptor } from "@lingui/core";
import { useAuth } from "../../src/store/auth.js";
import { useViewStore, type TabItem } from "../../src/store/view.js";
import css from "./view.module.css";

function resolveTitle(title: string | MessageDescriptor, _: (msg: MessageDescriptor) => string): string {
    return typeof title === "string" ? title : _(title);
}

function DynamicContent({ load }: { load: () => Promise<{ default: ComponentType<any> }> }) {
    const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
    const [Component, setComponent] = useState<ComponentType<any> | null>(null);
    useEffect(() => {
        let cancelled = false;
        setState("loading");
        setComponent(null);
        load()
            .then((mod) => {
                if (!cancelled) {
                    setComponent(() => mod.default);
                    setState("loaded");
                }
            })
            .catch(() => {
                if (!cancelled) setState("error");
            });
        return () => {
            cancelled = true;
        };
    }, [load]);
    if (state === "loading") {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-text-secondary)",
                }}
            >
                Loading...
            </div>
        );
    }
    if (state === "error") {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 72,
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                }}
            >
                Error
            </div>
        );
    }
    if (!Component) return null;
    return <Component />;
}

function TabContent({ tab, reloadCount }: { tab: TabItem; reloadCount: number }) {
    const user = useAuth((s) => s.user);
    const permissions = user?.permissions ?? [];

    if (tab.auth && !permissions.includes(tab.auth)) {
        return (
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 72,
                    fontWeight: 700,
                    color: "var(--color-text-secondary)",
                }}
            >
                401
            </div>
        );
    }

    return <DynamicContent key={`${tab.id}-${reloadCount}`} load={tab.content} />;
}

export function PaneTabs({ viewId, tabs, activeTabId }: { viewId: string; tabs: TabItem[]; activeTabId?: string }) {
    const { setActiveTab, setActiveView, closeTab, reloadCounter } = useViewStore();
    const { _ } = useLingui();

    const handleTabChange = (to?: string) => {
        if (!to) return;
        setActiveView(viewId);
        setActiveTab(viewId, to);
    };

    const tabItems = tabs.map((t) => ({
        key: t.id,
        title: resolveTitle(t.title, _),
        content: <TabContent tab={t} reloadCount={reloadCounter[t.id] ?? 0} />,
        closable: true,
    }));

    return <Tabs className={css.tabs} type="pane" tabs={tabItems} active={activeTabId} onTabChange={handleTabChange} onClose={(key) => closeTab(viewId, key)} />;
}
