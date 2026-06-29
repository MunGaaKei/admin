import { useAuth } from "../store/auth";

export function hasPermission(code: string): boolean {
  const permissions = useAuth.getState().user?.permissions;
  if (!permissions) return false;
  if (permissions.includes("*")) return true;
  return permissions.includes(code);
}
