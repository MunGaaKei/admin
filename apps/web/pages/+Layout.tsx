import { Tabs } from "@ioca/react";
import { RefTabs } from "@ioca/react/components/tabs/type";
import { useRef, type ReactNode } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Aside } from "../components/aside";

export default function Layout({ children }: { children: ReactNode }) {
    const pageContext = usePageContext();
    const tabRef = useRef<RefTabs>(null);

    console.log(pageContext);

    return (
        <div className="absolute inset-0 flex">
            <Aside />
            <main className="flex-1 flex flex-column">
                <Tabs ref={tabRef} tabs={["aaaa", "bbbb"]} type="pane" />

                {children}
            </main>
        </div>
    );
}
