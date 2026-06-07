import { type ReactNode, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n, dynamicActivate } from "../src/i18n";
import { useSettingStore } from "../src/store/setting";
import { Aside } from "../components/aside";
import { View } from "../components/view";

export default function Layout({ children }: { children: ReactNode }) {
    const locale = useSettingStore((s) => s.locale);

    useEffect(() => {
        dynamicActivate(locale);
    }, [locale]);

    return (
        <I18nProvider i18n={i18n}>
            <div className="absolute inset-0 flex">
                <Aside />

                <main className="flex-1">
                    <View />

                    {children}
                </main>
            </div>
        </I18nProvider>
    );
}
