import { Divider, List } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { Columns2, RotateCw, SquareX } from "lucide-react";
import { useViewStore } from "../../src/store/view.js";

export function ContextMenuContent({ viewId, tabId, onClose }: { viewId: string; tabId: string; onClose: () => void }) {
    const { t } = useLingui();

    const handleCloseOthers = () => {
        const v = useViewStore.getState().views.find((x) => x.id === viewId);
        if (!v) return;
        const { closeTab } = useViewStore.getState();
        v.tabs.filter((t) => t.id !== tabId).forEach((t) => closeTab(viewId, t.id));
        onClose();
    };

    const handleRefresh = () => {
        useViewStore.getState().reloadTab(viewId, tabId);
        onClose();
    };

    const handleSplitScreen = () => {
        const state = useViewStore.getState();
        const views = state.views;
        const { setActiveTab, setActiveView, splitView, openTab } = state;
        if (views.length >= 2) {
            const otherView = views.find((v) => v.id !== viewId);
            if (!otherView) return;
            const existing = otherView.tabs.find((t) => t.id === tabId);
            if (existing) {
                if (otherView.activeTabId !== tabId) setActiveTab(otherView.id, tabId);
                setActiveView(otherView.id);
            } else {
                setActiveView(otherView.id);
                openTab(tabId);
            }
        } else {
            splitView(tabId);
        }
        onClose();
    };

    return (
        <List type="option">
            <List.Item onClick={handleCloseOthers}>
                {t`关闭其他`} <SquareX size={14} />
            </List.Item>

            <Divider />

            <List.Item onClick={handleRefresh}>
                {t`刷新`} <RotateCw size={14} />
            </List.Item>
            <List.Item onClick={handleSplitScreen}>
                {t`分屏`} <Columns2 size={14} />
            </List.Item>
        </List>
    );
}
