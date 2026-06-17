import { type ReactNode, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { useTheme } from "@ioca/react";
import { i18n, dynamicActivate } from "../src/i18n";
import { useSettingStore } from "../src/store/setting";

export default function RootLayout({ children }: { children: ReactNode }) {
    const locale = useSettingStore((s) => s.locale);
    useTheme();

    useEffect(() => {
        dynamicActivate(locale);
    }, [locale]);

    return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
