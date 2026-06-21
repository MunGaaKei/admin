import { Flex, Form, Modal, Radio, Select, useTheme } from "@ioca/react";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import { Cog, Moon, Sun, SunMoon } from "lucide-react";
import { fonts } from "../../src/config/fonts";
import { useSettingStore } from "../../src/store/setting";

const themeIcons = {
    "theme-light": { icon: Sun, label: msg`亮色` },
    "theme-dark": { icon: Moon, label: msg`暗色` },
    "theme-auto": { icon: SunMoon, label: msg`自动` },
};

interface SettingModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingModal({ visible, onClose }: SettingModalProps) {
    const locale = useSettingStore((s) => s.locale);
    const setLocale = useSettingStore((s) => s.setLocale);
    const font = useSettingStore((s) => s.font);
    const setFont = useSettingStore((s) => s.setFont);
    const { theme, setTheme } = useTheme();
    const { t } = useLingui();

    return (
        <Modal
            visible={visible}
            backdropClosable
            onVisibleChange={(v) => {
                if (!v) onClose();
            }}
            title={
                <>
                    <Cog size={20} />
                    {t`设置`}
                </>
            }
            width={480}
            footer={null}
        >
            <Form
                labelInline
                labelRight
                labelWidth="6em"
                className="pd-12 pb-24"
                style={{ maxHeight: "60vh", alignContent: "flex-start" }}
            >
                <Radio
                    label={t`主题`}
                    options={["theme-light", "theme-dark", "theme-auto"]}
                    renderItem={(checked, value) => {
                        const theme = themeIcons[value];
                        if (!theme) return null;
                        const { icon: Icon, label } = theme;

                        return (
                            <Flex gap={4} className={checked ? "" : "color-7"}>
                                <Icon
                                    size={20}
                                    fill={
                                        checked
                                            ? "var(--color-7)"
                                            : "transparent"
                                    }
                                />
                                <span>{t(label)}</span>
                            </Flex>
                        );
                    }}
                    type="custom"
                    value={theme}
                    onChange={(val) => setTheme(val)}
                />

                <Select
                    label={t`语言`}
                    options={[
                        { label: "中文", value: "zh-CN" },
                        { label: "English", value: "en-US" },
                    ]}
                    value={locale}
                    onChange={(val) => setLocale(val)}
                />

                <Select
                    label={t`字体`}
                    options={fonts.map((f) => ({ label: f.key, value: f.key }))}
                    value={font}
                    onChange={(val) => setFont(val)}
                />
            </Form>
        </Modal>
    );
}
