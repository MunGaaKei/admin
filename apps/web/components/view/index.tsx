import { useEffect } from "react";
import { Resizable } from "@ioca/react";
import { usePageContext } from "vike-react/usePageContext";
import { useViewStore } from "../../src/store/view.js";
import { ViewPane } from "./pane.js";
import css from "./view.module.css";

export function View() {
    const views = useViewStore((s) => s.views);
    const openTab = useViewStore((s) => s.openTab);
    const pageContext = usePageContext();

    // Route detection: open tab from URL query param
    const tabParam = pageContext.urlParsed?.search?.tab;
    useEffect(() => {
        if (tabParam && typeof tabParam === "string") {
            openTab(tabParam);
        }
    }, [tabParam]);

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
            <Resizable
                height="100%"
                other={<ViewPane viewId={views[0].id} />}
                size="50%"
                minSize="20%"
                maxSize="80%"
            >
                <ViewPane viewId={views[1].id} />
            </Resizable>
        </div>
    );
}
