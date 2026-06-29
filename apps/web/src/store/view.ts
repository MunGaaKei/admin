import { type ComponentType, type ReactNode } from "react";
import { create } from "zustand";
import { menus, type MenuItem } from "../../config/menu.js";
import type { ITabItem } from "@ioca/react/components/tabs/type";

export interface TabItem extends ITabItem {
    id: string;
    title: ReactNode;
    content: () => Promise<{ default: ComponentType<any> }>;
    auth?: string;
    error?: boolean;
}

export interface ViewPane {
    id: string;
    tabs: TabItem[];
    activeTabId: string | null;
}

interface ViewState {
    views: ViewPane[];
    activeViewId: string | null;
    reloadCounter: Record<string, number>;
}

interface ViewActions {
    openTab: (
        menuKey: string,
        options?: { split?: boolean; errorCode?: number },
    ) => void;
    closeTab: (viewId: string, tabId: string) => void;
    setActiveTab: (viewId: string, tabId: string) => void;
    setActiveView: (viewId: string) => void;
    splitView: (tabId: string) => void;
    reloadTab: (viewId: string, tabId: string) => void;
}

function findMenu(key: string): MenuItem | undefined {
    for (const m of menus) {
        if (m.key === key) return m;
        if (m.children) {
            const child = m.children.find((c) => c.key === key);
            if (child) return child;
        }
    }
    return undefined;
}

let _id = 0;
function nextId() {
    return `view-${++_id}`;
}

export const useViewStore = create<ViewState & ViewActions>()((set, get) => ({
    views: [],
    activeViewId: null,
    reloadCounter: {},

    openTab: (menuKey, options = {}) => {
        const menu = findMenu(menuKey);
        if (menu && !menu.content) return;

        let errorCodeFromUrl: string | null = null;
        if (!menu && typeof window !== "undefined") {
            const url = new URL(window.location.href);
            errorCodeFromUrl = url.searchParams.get("errorCode");
            if (!errorCodeFromUrl) {
                url.searchParams.set(
                    "errorCode",
                    String(options.errorCode ?? "404"),
                );
                window.history.replaceState(
                    null,
                    "",
                    url.pathname + url.search,
                );
            }
        }

        const tabContent: TabItem["content"] = menu
            ? menu.content!
            : () => import("../../tabs/error");
        const tabTitle: TabItem["title"] = menu
            ? (menu.title as TabItem["title"])
            : String(options.errorCode ?? errorCodeFromUrl ?? "404");
        const tabAuth = menu?.auth;

        const state = get();
        let targetViewId = state.activeViewId;

        if (options.split && state.views.length === 1) {
            const id = nextId();
            targetViewId = id;
            set({
                views: [...state.views, { id, tabs: [], activeTabId: null }],
                activeViewId: id,
            });
        }

        function makeTab(): TabItem {
            const tab: TabItem = {
                id: menuKey,
                title: tabTitle,
                content: tabContent,
                auth: tabAuth,
                keepDOM: menu?.keepDOM,
            };
            if (!menu) tab.error = true;
            return tab;
        }

        const state2 = get();
        if (!targetViewId || !state2.views.some((v) => v.id === targetViewId)) {
            const id = nextId();
            const tab = makeTab();
            set({
                views: [
                    ...state2.views,
                    { id, tabs: [tab], activeTabId: menuKey },
                ],
                activeViewId: id,
            });
            cleanup();
            return;
        }

        const view = state2.views.find((v) => v.id === targetViewId)!;
        const existing = view.tabs.find((t) => t.id === menuKey);
        if (existing) {
            set({
                activeViewId: targetViewId,
                views: state2.views.map((v) =>
                    v.id === targetViewId ? { ...v, activeTabId: menuKey } : v,
                ),
            });
            cleanup();
            return;
        }

        if (state2.views.length > 1) {
            const otherView = state2.views.find(
                (v) =>
                    v.id !== targetViewId &&
                    v.tabs.some((t) => t.id === menuKey),
            );
            if (otherView) {
                set({
                    activeViewId: otherView.id,
                    views: state2.views.map((v) =>
                        v.id === otherView.id
                            ? { ...v, activeTabId: menuKey }
                            : v,
                    ),
                });
                cleanup();
                return;
            }
        }

        const tab = makeTab();
        set({
            activeViewId: targetViewId,
            views: state2.views.map((v) =>
                v.id === targetViewId
                    ? { ...v, tabs: [...v.tabs, tab], activeTabId: menuKey }
                    : v,
            ),
        });
        cleanup();

        function cleanup() {
            if (!menu) return;
            const st = get();
            const hasErrorTab = st.views.some((v) =>
                v.tabs.some((t) => t.error),
            );
            if (!hasErrorTab) return;

            const cleanedViews = st.views
                .map((v) => ({
                    ...v,
                    tabs: v.tabs.filter((t) => !t.error),
                    activeTabId:
                        v.activeTabId &&
                        v.tabs.some((t) => t.id === v.activeTabId && !t.error)
                            ? v.activeTabId
                            : (v.tabs.filter((t) => !t.error)[0]?.id ?? null),
                }))
                .filter((v) => v.tabs.length > 0);

            set({
                views: cleanedViews,
                activeViewId:
                    cleanedViews.length > 0
                        ? (cleanedViews.find((v) => v.id === st.activeViewId)
                              ?.id ?? cleanedViews[0].id)
                        : null,
            });

            if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.delete("errorCode");
                window.history.replaceState(
                    null,
                    "",
                    url.pathname + url.search,
                );
            }
        }
    },

    closeTab: (viewId, tabId) => {
        const state = get();
        const view = state.views.find((v) => v.id === viewId);
        if (!view) return;

        const newTabs = view.tabs.filter((t) => t.id !== tabId);
        if (newTabs.length === view.tabs.length) return;

        let newActiveTabId = view.activeTabId;
        if (view.activeTabId === tabId) {
            const tabIndex = view.tabs.findIndex((t) => t.id === tabId);
            newActiveTabId =
                newTabs.length > 0
                    ? newTabs[Math.min(tabIndex, newTabs.length - 1)].id
                    : null;
        }

        if (newTabs.length === 0) {
            const newViews = state.views.filter((v) => v.id !== viewId);
            set({ views: newViews, activeViewId: newViews[0]?.id ?? null });
            return;
        }

        set({
            activeViewId: viewId,
            views: state.views.map((v) =>
                v.id === viewId
                    ? { ...v, tabs: newTabs, activeTabId: newActiveTabId }
                    : v,
            ),
        });
    },

    setActiveTab: (viewId, tabId) => {
        set((state) => ({
            activeViewId: viewId,
            views: state.views.map((v) =>
                v.id === viewId ? { ...v, activeTabId: tabId } : v,
            ),
        }));
    },

    setActiveView: (viewId) => {
        set({ activeViewId: viewId });
    },

    splitView: (tabId) => {
        const state = get();
        if (state.views.length >= 2) return;

        const activeView = state.views.find((v) => v.id === state.activeViewId);
        if (!activeView) return;

        const tab = activeView.tabs.find((t) => t.id === tabId);
        if (!tab) return;

        const id = nextId();
        set({
            views: [
                ...state.views,
                { id, tabs: [{ ...tab }], activeTabId: tabId },
            ],
            activeViewId: id,
        });
    },

    reloadTab: (viewId, tabId) => {
        const state = get();
        const view = state.views.find((v) => v.id === viewId);
        if (!view || !view.tabs.some((t) => t.id === tabId)) return;
        set({
            activeViewId: viewId,
            views: state.views.map((v) =>
                v.id === viewId ? { ...v, activeTabId: tabId } : v,
            ),
            reloadCounter: {
                ...state.reloadCounter,
                [tabId]: (state.reloadCounter[tabId] ?? 0) + 1,
            },
        });
    },
}));
