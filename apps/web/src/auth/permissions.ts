import { useAuth } from "../store/auth";

export function hasPermission(code: string): boolean {
  const permissions = useAuth.getState().user?.permissions;
  return permissions?.includes(code) ?? false;
}
