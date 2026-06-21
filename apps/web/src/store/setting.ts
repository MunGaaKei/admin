import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingState {
  locale: string;
  sidebarCollapsed: boolean;
  font: string;
}

interface SettingActions {
  setLocale: (locale: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setFont: (font: string) => void;
}

export const useSettingStore = create<SettingState & SettingActions>()(
  persist(
    (set) => ({
      locale: "zh-CN",
      sidebarCollapsed: false,
      font: "system",

      setLocale: (locale) => set({ locale }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setFont: (font) => set({ font }),
    }),
    {
      name: "settings",
      partialize: (state) => ({
        locale: state.locale,
        sidebarCollapsed: state.sidebarCollapsed,
        font: state.font,
      }),
    },
  ),
);
