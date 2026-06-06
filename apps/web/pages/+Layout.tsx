import { type ReactNode } from "react";
import { Aside } from "../components/aside";

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="absolute inset-0 flex">
            <Aside />

            <main className="flex-1 flex flex-column">{children}</main>
        </div>
    );
}
