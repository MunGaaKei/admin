import { Flex, Form, Radio, Select, useTheme } from "@ioca/react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useSettingStore } from "../../src/store/setting";
import css from "./index.module.css";

const themeIcons = {
    "theme-light": { icon: Sun, label: "亮色" },
    "theme-dark": { icon: Moon, label: "暗色" },
    "theme-auto": { icon: SunMoon, label: "自动" },
};

export default function Setting() {
    const locale = useSettingStore((s) => s.locale);
    const setLocale = useSettingStore((s) => s.setLocale);
    const { theme, setTheme } = useTheme();

    return (
        <>
            <Form className={css.form} labelInline labelRight labelWidth="5em" width={400} gap={16}>
                <Radio
                    label="主题"
                    options={["theme-light", "theme-dark", "theme-auto"]}
                    renderItem={(checked, value) => {
                        const theme = themeIcons[value];
                        if (!theme) return null;
                        const { icon: Icon, label } = theme;

                        return (
                            <Flex gap={4} className={checked ? "" : "color-7"}>
                                <Icon size={20} fill={checked ? "var(--color-3)" : "transparent"} />
                                <span>{label}</span>
                            </Flex>
                        );
                    }}
                    type="custom"
                    value={theme}
                    onChange={(val) => setTheme(val)}
                />

                <Select
                    label="语言"
                    style={{ width: 320 }}
                    options={[
                        { label: "中文", value: "zh-CN" },
                        { label: "English", value: "en-US" },
                    ]}
                    value={locale}
                    onChange={(val) => setLocale(val)}
                />
            </Form>
        </>
    );
}
