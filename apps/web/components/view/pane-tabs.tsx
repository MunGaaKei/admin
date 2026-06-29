import { Loading, Tabs } from "@ioca/react";
import type { MessageDescriptor } from "@lingui/core";
import { useLingui } from "@lingui/react";
import {
    useEffect,
    useState,
    type ComponentType,
    type ReactNode,
} from "react";
import { useAuth } from "../../src/store/auth.js";
import { useViewStore, type TabItem } from "../../src/store/view.js";
import css from "./view.module.css";

function resolveTitle(
    title: ReactNode,
    _: (msg: MessageDescriptor) => string,
): string {
    if (typeof title === "string") return title;
    return _(title as unknown as MessageDescriptor);
}

function DynamicContent({
    load,
}: {
    load: () => Promise<{ default: ComponentType<any> }>;
}) {
    const [state, setState] = useState<"loading" | "loaded" | "error">(
        "loading",
    );
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
        return <Loading />;
    }
    if (state === "error") {
        return <h2 className="mg-12 text-center">Error</h2>;
    }

    if (!Component) return null;
    return <Component />;
}

function TabContent({
    tab,
    reloadCount,
}: {
    tab: TabItem;
    reloadCount: number;
}) {
    const user = useAuth((s) => s.user);
    const permissions = user?.permissions ?? [];

    if (tab.auth && !permissions.includes(tab.auth)) {
        return <h2 className="mg-12 text-center">401</h2>;
    }

    return (
        <DynamicContent key={`${tab.id}-${reloadCount}`} load={tab.content} />
    );
}

export function PaneTabs({
    viewId,
    tabs,
    activeTabId,
}: {
    viewId: string;
    tabs: TabItem[];
    activeTabId?: string;
}) {
    const { setActiveTab, setActiveView, closeTab, reloadCounter } =
        useViewStore();
    const { _ } = useLingui();

    const handleTabChange = (to?: string) => {
        if (!to) return;
        setActiveView(viewId);
        setActiveTab(viewId, to);
    };

    const tabItems = tabs.map((t) => ({
        ...t,
        key: t.id,
        title: resolveTitle(t.title, _),
        content: <TabContent tab={t} reloadCount={reloadCounter[t.id] ?? 0} />,
        closable: true,
    }));

    return (
        <Tabs
            className={`${css.tabs} flex flex-column`}
            type="pane"
            tabs={tabItems}
            active={activeTabId}
            onTabChange={handleTabChange}
            onClose={(key) => closeTab(viewId, key)}
        />
    );
}
