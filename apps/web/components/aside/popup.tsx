import { Divider, Dropdown } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { Settings, SquareArrowRightExit } from "lucide-react";
import { useAuth } from "../../src/store/auth";

interface UserPopupProps {
    onLogout: () => void;
    onOpenSetting: () => void;
    close: () => void;
}

export function UserPopup({ onLogout, onOpenSetting, close }: UserPopupProps) {
    const user = useAuth((s) => s.user);
    const { t } = useLingui();

    return (
        <>
            <Dropdown.Item
                type="option"
                onClick={() => {
                    close();
                    onOpenSetting();
                }}
            >
                <span>{t`设置`}</span>
                <Settings size={16} />
            </Dropdown.Item>

            <Divider />

            <Dropdown.Item
                type="option"
                className="error"
                onClick={() => {
                    close();
                    onLogout();
                }}
            >
                <span>{t`退出`}</span>
                <SquareArrowRightExit size={16} />
            </Dropdown.Item>
        </>
    );
}
