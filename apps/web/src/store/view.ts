import type { ComponentType } from "react";
import { create } from "zustand";
import { menus } from "../../config/menu.js";

export interface TabItem {
    id: string;
    title: string;
    menuIndex: number;
    content: () => Promise<{ default: ComponentType<any> }>;
}

export interface ViewPane {
    id: string;
    tabs: TabItem[];
    activeTabId: string | null;
}

interface ViewState {
    views: ViewPane[];
    activeViewId: string | null;
}

interface ViewActions {
    addTab: (menuKey: string, options?: { split?: boolean }) => void;
    closeTab: (viewId: string, tabId: string) => void;
    setActiveTab: (viewId: string, tabId: string) => void;
    setActiveView: (viewId: string) => void;
    splitView: (tabId: string) => void;
}

let _id = 0;
function nextId() {
    return `view-${++_id}`;
}

export const useViewStore = create<ViewState & ViewActions>()((set, get) => ({
    views: [],
    activeViewId: null,

    addTab: (menuKey, options = {}) => {
        const menuIndex = menus.findIndex((m) => m.key === menuKey);
        if (menuIndex === -1) return;
        const menu = menus[menuIndex];

        const state = get();
        let targetViewId = state.activeViewId;

        if (options.split && state.views.length === 1) {
            const id = nextId();
            targetViewId = id;
            set({ views: [...state.views, { id, tabs: [], activeTabId: null }], activeViewId: id });
        }

        const state2 = get();
        if (!targetViewId || !state2.views.some((v) => v.id === targetViewId)) {
            const id = nextId();
            const tab = { id: menuKey, title: menu.title, menuIndex, content: menu.content };
            set({ views: [...state2.views, { id, tabs: [tab], activeTabId: menuKey }], activeViewId: id });
            return;
        }

        const view = state2.views.find((v) => v.id === targetViewId)!;
        const existing = view.tabs.find((t) => t.id === menuKey);
        if (existing) {
            get().closeTab(targetViewId, menuKey);
            setTimeout(() => {
                const s = get();
                const v = s.views.find((v) => v.id === targetViewId);
                const tab = { id: menuKey, title: menu.title, menuIndex, content: menu.content };
                if (!v) {
                    const id = nextId();
                    set({ views: [...s.views, { id, tabs: [tab], activeTabId: menuKey }], activeViewId: id });
                    return;
                }
                set({
                    activeViewId: targetViewId,
                    views: s.views.map((v) => (v.id === targetViewId ? { ...v, tabs: [...v.tabs, tab], activeTabId: menuKey } : v)),
                });
            }, 0);
            return;
        }

        const tab = { id: menuKey, title: menu.title, menuIndex, content: menu.content };
        set({
            activeViewId: targetViewId,
            views: state2.views.map((v) => (v.id === targetViewId ? { ...v, tabs: [...v.tabs, tab], activeTabId: menuKey } : v)),
        });
    },

    closeTab: (viewId, tabId) => {
        console.log(viewId, tabId);
        const state = get();
        const view = state.views.find((v) => v.id === viewId);
        if (!view) return;

        const newTabs = view.tabs.filter((t) => t.id !== tabId);
        if (newTabs.length === view.tabs.length) return;

        let newActiveTabId = view.activeTabId;
        if (view.activeTabId === tabId) {
            const tabIndex = view.tabs.findIndex((t) => t.id === tabId);
            newActiveTabId = newTabs.length > 0 ? newTabs[Math.min(tabIndex, newTabs.length - 1)].id : null;
        }

        if (newTabs.length === 0) {
            const newViews = state.views.filter((v) => v.id !== viewId);
            set({ views: newViews, activeViewId: newViews[0]?.id ?? null });
            return;
        }

        set({
            activeViewId: viewId,
            views: state.views.map((v) => (v.id === viewId ? { ...v, tabs: newTabs, activeTabId: newActiveTabId } : v)),
        });
    },

    setActiveTab: (viewId, tabId) => {
        set((state) => ({
            activeViewId: viewId,
            views: state.views.map((v) => (v.id === viewId ? { ...v, activeTabId: tabId } : v)),
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
            views: [...state.views, { id, tabs: [{ ...tab }], activeTabId: tabId }],
            activeViewId: id,
        });
    },
}));
