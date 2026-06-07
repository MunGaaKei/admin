import { Popup } from "@ioca/react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useState } from "react";
import { useViewStore } from "../../src/store/view.js";
import { ContextMenuContent } from "./pane-context-menu.js";
import { PaneTabs } from "./pane-tabs.js";
import css from "./view.module.css";

export function ViewPane({ viewId }: { viewId: string }) {
    const [contextTabId, setContextTabId] = useState<string | null>(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const view = useViewStore((s) => s.views.find((v) => v.id === viewId));
    const setActiveView = useViewStore((s) => s.setActiveView);

    useEffect(() => {
        if (contextMenuVisible) setContextMenuVisible(false);
    }, [contextMenuVisible]);

    const handleContextMenuMatch = (e: ReactMouseEvent) => {
        const nav = (e.target as HTMLElement).closest(".i-tab-nav") as HTMLElement | null;
        if (!nav) return false;

        const index = Array.from(nav.parentElement!.querySelectorAll(".i-tab-nav")).indexOf(nav);
        if (index === -1) return false;

        const v = useViewStore.getState().views.find((x) => x.id === viewId);
        if (!v?.tabs[index]) return false;

        setContextTabId(v.tabs[index].id);
        return true;
    };

    if (!view) return null;

    return (
        <Popup
            trigger="contextmenu"
            visible={contextMenuVisible}
            match={handleContextMenuMatch}
            className={css.contextMenu}
            content={contextTabId ? <ContextMenuContent viewId={viewId} tabId={contextTabId} onClose={() => { setContextTabId(null); setContextMenuVisible(true); }} /> : null}
        >
            <div className={css.pane} onClick={() => setActiveView(viewId)}>{view.tabs.length > 0 && <PaneTabs viewId={viewId} tabs={view.tabs} activeTabId={view.activeTabId ?? undefined} />}</div>
        </Popup>
    );
}
