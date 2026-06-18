import { useEffect, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { useViewStore } from "../../src/store/view.js";

export default function Page() {
    const { urlPathname, is404, abortStatusCode } = usePageContext();
    const code = is404 ? 404 : (abortStatusCode ?? 500);
    const [showInline, setShowInline] = useState(true);

    useEffect(() => {
        if (urlPathname.startsWith("/admin")) {
            setShowInline(true);
            return;
        }

        const { views } = useViewStore.getState();
        if (!views.some((v) => v.tabs.some((t) => t.id === "error" || t.error))) {
            useViewStore.getState().openTab("error", { errorCode: code });
        }
        setShowInline(false);
    }, []);

    if (!showInline) return null;

    return (
        <div className="flex flex-1 h-100">
            <h2 className="mg-auto" style={{ fontSize: 60 }}>
                {code}
            </h2>
        </div>
    );
}
