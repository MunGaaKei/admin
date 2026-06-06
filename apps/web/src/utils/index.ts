export async function tryto<T>(promise: Promise<T>): Promise<{ error: Error; data: null } | { error: null; data: T }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
}
