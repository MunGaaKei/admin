import type { PageContextServer } from "vike/types";
import { redirect } from "vike/abort";
import { useAuth } from "../src/store/auth";
import { request } from "../src/api/client.js";
import type { ApiResponse } from "../src/types.js";
import type { User } from "../src/store/auth.js";
import { tryto } from "../src/utils/index.js";

const whitelist = ["/login", "/"];

export { guard };

async function guard(pageContext: PageContextServer) {
  const pathname = new URL(pageContext.urlOriginal, "http://localhost").pathname;
  if (whitelist.includes(pathname)) return;

  // Client side: verify with the API via cookie, then refresh store
  const { error, data } = await tryto(
    request<ApiResponse<{ user: User }>>("auth/verify"),
  );
  if (error) {
    useAuth.getState().logout();
    throw redirect("/login");
  }

  // Refresh user info in persisted store
  useAuth.setState({ user: data.data.user as any });

  // Check admin permission for /admin routes
  if (pathname.startsWith("/admin")) {
    const permissions = data.data.user.permissions;
    if (!permissions.includes("admin") && !permissions.includes("*")) {
      throw redirect("/");
    }
  }
}
