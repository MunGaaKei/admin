import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
  locale: string;
  sidebarCollapsed: boolean;
}

interface SettingActions {
  setLocale: (locale: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useSettingStore = create<SettingState & SettingActions>()(
  persist(
    (set) => ({
      locale: "zh-CN",
      sidebarCollapsed: false,

      setLocale: (locale) => set({ locale }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    {
      name: "settings",
      partialize: (state) => ({
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
