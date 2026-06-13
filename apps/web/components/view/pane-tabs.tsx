import { Tabs } from "@ioca/react";
import { useEffect, useState, type ComponentType } from "react";
import { useLingui } from "@lingui/react";
import type { MessageDescriptor } from "@lingui/core";
import { useViewStore, type TabItem } from "../../src/store/view.js";
import css from "./view.module.css";

function resolveTitle(title: string | MessageDescriptor, _: (msg: MessageDescriptor) => string): string {
    return typeof title === "string" ? title : _(title);
}

function DynamicContent({ load }: { load: () => Promise<{ default: ComponentType<any> }> }) {
    const [Component, setComponent] = useState<ComponentType<any> | null>(null);
    useEffect(() => {
        let cancelled = false;
        load().then((mod) => {
            if (!cancelled) setComponent(() => mod.default);
        });
        return () => {
            cancelled = true;
        };
    }, [load]);
    if (!Component) return null;
    return <Component />;
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
        content: <DynamicContent key={`${t.id}-${reloadCounter[t.id] ?? 0}`} load={t.content} />,
        closable: true,
    }));

    return <Tabs className={css.tabs} type="pane" tabs={tabItems} active={activeTabId} onTabChange={handleTabChange} onClose={(key) => closeTab(viewId, key)} />;
}
