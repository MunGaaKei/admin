import type { ReactNode } from "react";
import css from "./index.module.css";

export default function Layout({ children }: { children: ReactNode }) {
    return <div className={css.container}>{children}</div>;
}
