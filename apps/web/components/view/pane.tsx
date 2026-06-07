import { List, Tabs } from "@ioca/react";
import { CircleX, Columns2 } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { useViewStore } from "../../src/store/view.js";
import css from "./view.module.css";

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

export function ViewPane({ viewId }: { viewId: string }) {
    const view = useViewStore((s) => s.views.find((v) => v.id === viewId));
    const { setActiveTab, closeTab, setActiveView, splitView, addTab } = useViewStore();
    const tabsRef = useRef<any>(null);
    const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number; tabId: string } | null>(null);

    if (!view) return null;

    const tabs = view.tabs.map((t) => ({
        key: t.id,
        title: t.title,
        content: <DynamicContent load={t.content} />,
        closable: true,
    }));

    useEffect(() => {
        const el = tabsRef.current?.navs?.current;
        if (!el) return;
        const handler = (e: MouseEvent) => {
            const nav = (e.target as HTMLElement).closest(".i-tab-nav");
            if (!nav) {
                setCtxMenu(null);
                return;
            }
            e.preventDefault();
            const navs = tabsRef.current?.navs?.current;
            if (!navs) return;
            const idx = Array.from(navs.querySelectorAll(".i-tab-nav")).indexOf(nav as HTMLElement);
            if (idx === -1) {
                setCtxMenu(null);
                return;
            }
            const v = useViewStore.getState().views.find((x) => x.id === viewId);
            if (!v || idx >= v.tabs.length) {
                setCtxMenu(null);
                return;
            }
            setCtxMenu({ x: e.clientX, y: e.clientY, tabId: v.tabs[idx].id });
        };
        el.addEventListener("contextmenu", handler);
        return () => el.removeEventListener("contextmenu", handler);
    }, [view.tabs.length > 0]);

    useEffect(() => {
        if (!ctxMenu) return;
        const close = () => setCtxMenu(null);
        document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [ctxMenu]);

    return (
        <div className={css.pane}>
            {tabs.length > 0 ? (
                <Tabs
                    ref={tabsRef}
                    className={css.tabs}
                    type="pane"
                    tabs={tabs}
                    active={view.activeTabId ?? undefined}
                    onTabChange={(to) => {
                        if (to) {
                            setActiveView(viewId);
                            setActiveTab(viewId, to);
                        }
                    }}
                    onClose={(key) => {
                        closeTab(viewId, key);
                    }}
                />
            ) : null}

            {ctxMenu && (
                <div className={css.contextMenu} style={{ position: "fixed", left: ctxMenu.x, top: ctxMenu.y, zIndex: 1000 }} onClick={(e) => e.stopPropagation()}>
                    <List type="option">
                        <List.Item
                            onClick={() => {
                                const v = useViewStore.getState().views.find((x) => x.id === viewId);
                                if (!v) {
                                    setCtxMenu(null);
                                    return;
                                }
                                v.tabs.filter((t) => t.id !== ctxMenu.tabId).forEach((t) => closeTab(viewId, t.id));
                                setCtxMenu(null);
                            }}
                        >
                            关闭其他 <CircleX size={20} />
                        </List.Item>
                        <List.Item
                            onClick={() => {
                                setCtxMenu(null);
                                const views = useViewStore.getState().views;
                                if (views.length >= 2) {
                                    const otherView = views.find((v) => v.id !== viewId);
                                    if (!otherView) return;
                                    const existing = otherView.tabs.find((t) => t.id === ctxMenu.tabId);
                                    if (existing) {
                                        if (otherView.activeTabId !== ctxMenu.tabId) {
                                            setActiveTab(otherView.id, ctxMenu.tabId);
                                        }
                                        setActiveView(otherView.id);
                                    } else {
                                        setActiveView(otherView.id);
                                        addTab(ctxMenu.tabId);
                                    }
                                } else {
                                    splitView(ctxMenu.tabId);
                                }
                            }}
                        >
                            分屏 <Columns2 size={20} />
                        </List.Item>
                    </List>
                </div>
            )}
        </div>
    );
}
