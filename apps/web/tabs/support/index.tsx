import { List } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { SquareArrowOutUpRight } from "lucide-react";

export default function File() {
    const { t } = useLingui();

    return (
        <div className="flex h-100">
            <List className="pd-12 mg-auto" labelWidth={80} gap={12}>
                <h2 className="mb-12 text-center">{t`支持`}</h2>

                <List.Item label={<b>Vike</b>}>
                    <a
                        href="https://vike.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blue flex items-center gap-4"
                    >
                        https://vike.dev/
                        <SquareArrowOutUpRight size={12} />
                    </a>
                </List.Item>

                <List.Item label={<b>@ioca/react</b>}>
                    <a
                        href="https://ioca-react.vercel.app/docs/install"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blue flex items-center gap-4"
                    >
                        https://ioca-react.vercel.app/docs/install
                        <SquareArrowOutUpRight size={12} />
                    </a>
                </List.Item>

                <List.Item label={<b>lucide</b>}>
                    <a
                        href="https://lucide.dev/icons/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blue flex items-center gap-4"
                    >
                        https://lucide.dev/icons/
                        <SquareArrowOutUpRight size={12} />
                    </a>
                </List.Item>

                <List.Item label={<b>lingui</b>}>
                    <a
                        href="https://lingui.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blue flex items-center gap-4"
                    >
                        https://lingui.dev/
                        <SquareArrowOutUpRight size={12} />
                    </a>
                </List.Item>
            </List>
        </div>
    );
}
