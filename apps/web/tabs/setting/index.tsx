import { Select } from "@ioca/react";
import { useSettingStore } from "../../src/store/setting";

export default function Setting() {
    const locale = useSettingStore((s) => s.locale);
    const setLocale = useSettingStore((s) => s.setLocale);

    return (
        <>
            <h2 className="pd-12">设置</h2>

            <div className="pd-12 flex flex-column gap-12" style={{ width: 400 }}>
                <Select
                    label="语言"
                    labelInline
                    style={{ width: 160 }}
                    options={[
                        { label: "中文", value: "zh-CN" },
                        { label: "English", value: "en-US" },
                    ]}
                    value={locale}
                    onChange={(val) => setLocale(val)}
                />
            </div>
        </>
    );
}
