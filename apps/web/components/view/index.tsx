import { Resizable } from "@ioca/react";
import { useEffect } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useViewStore } from "../../src/store/view.js";
import { ViewPane } from "./pane.js";
import css from "./view.module.css";

export function View() {
    const views = useViewStore((s) => s.views);
    const activeViewId = useViewStore((s) => s.activeViewId);
    const openTab = useViewStore((s) => s.openTab);
    const pageContext = usePageContext();

    const tabParam = pageContext.urlParsed?.search?.tab;
    useEffect(() => {
        if (tabParam && typeof tabParam === "string") {
            openTab(tabParam);
        }
    }, [tabParam]);

    useEffect(() => {
        const activeView = views.find((v) => v.id === activeViewId);
        const tabId = activeView?.activeTabId;
        const url = new URL(window.location.href);
        if (tabId) {
            url.searchParams.set("tab", tabId);
        } else {
            url.searchParams.delete("tab");
        }
        window.history.replaceState(null, "", url.pathname + url.search);
    }, [views, activeViewId]);

    if (views.length === 0) {
        return <div className={css.view} />;
    }

    if (views.length === 1) {
        return (
            <div className={css.view}>
                <ViewPane viewId={views[0].id} />
            </div>
        );
    }

    return (
        <div className={css.view}>
            <Resizable height="100%" other={<ViewPane viewId={views[0].id} />} size="50%" minSize="20%" maxSize="80%">
                <ViewPane viewId={views[1].id} />
            </Resizable>
        </div>
    );
}
