import type { PageContextServer } from "vike/types";
import { redirect } from "vike/abort";
import { useAuth } from "../src/store/auth";
import { request } from "../src/api/client.js";
import type { ApiResponse, UserInfo } from "@admin/shared";
import { tryto } from "../src/utils/index.js";

const whitelist = ["/login", "/"];

export { guard };

async function guard(pageContext: PageContextServer) {
  const pathname = new URL(pageContext.urlOriginal, "http://localhost").pathname;
  if (whitelist.includes(pathname)) return;

  // Client side: verify with the API via cookie, then refresh store
  const { error, data } = await tryto(
    request<ApiResponse<{ user: UserInfo }>>("auth/verify"),
  );
  if (error) {
    useAuth.getState().logout();
    throw redirect("/login");
  }

  // Refresh user info in persisted store
  useAuth.setState({ user: data.data.user as any });
}
