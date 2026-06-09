import { useAuth } from "@web/store/auth";

export default function Profile() {
    const user = useAuth((s) => s.user);

    return <h3 className="pd-12">Hello {user?.nickname}</h3>;
}
