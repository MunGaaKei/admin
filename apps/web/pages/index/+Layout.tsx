import { type ReactNode } from "react";
import { Aside } from "../../components/aside";
import { View } from "../../components/view";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="absolute inset-0 flex">
            <Aside />

            <main className="flex-1">
                <View />

                {children}
            </main>
        </div>
    );
}
