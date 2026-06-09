import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
    return <div className="absolute inset-0 h-100vh flex items-center justify-center">{children}</div>;
}
