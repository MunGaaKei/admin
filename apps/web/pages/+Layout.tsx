import { useTheme } from "@ioca/react";
import { I18nProvider } from "@lingui/react";
import { type ReactNode, useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { Aside } from "../components/aside";
import { View } from "../components/view";
import { dynamicActivate, i18n } from "../src/i18n";
import { useAuth } from "../src/store/auth";
import { useSettingStore } from "../src/store/setting";

function AdminGuard({ children }: { children: ReactNode }) {
    const user = useAuth((s) => s.user);
    const permissions = user?.permissions ?? [];

    useEffect(() => {
        if (!user) return;
        if (import.meta.env.VITE_ADMIN_ENABLE !== "true") {
            navigate("/?tab=error-display&errorCode=404");
        } else if (!permissions.includes("admin") && !permissions.includes("*")) {
            navigate("/?tab=error-display&errorCode=401");
        }
    }, [user]);

    if (!user) return null;
    if (import.meta.env.VITE_ADMIN_ENABLE !== "true") return null;
    if (!permissions.includes("admin") && !permissions.includes("*")) return null;
    return <>{children}</>;
}

export default function RootLayout({ children }: { children: ReactNode }) {
    const { urlPathname } = usePageContext();
    const locale = useSettingStore((s) => s.locale);
    useTheme();

    useEffect(() => {
        dynamicActivate(locale);
    }, [locale]);

    if (urlPathname === "/login") {
        return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
    }

    const mode = urlPathname.startsWith("/admin") ? "admin" : "main";

    return (
        <I18nProvider i18n={i18n}>
            <div className="absolute inset-0 flex">
                <Aside mode={mode} />

                {urlPathname.startsWith("/admin") ? (
                    <AdminGuard>
                        <main className="flex-1">{children}</main>
                    </AdminGuard>
                ) : (
                    <main className="flex-1">
                        <View />

                        {children}
                    </main>
                )}
            </div>
        </I18nProvider>
    );
}
