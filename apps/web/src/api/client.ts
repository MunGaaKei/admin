import ky, { type Options, isHTTPError } from "ky";

const RAW = import.meta.env.VITE_API_BASE_URL ?? "";
const IS_EXTERNAL = RAW.startsWith("http") || (RAW && !RAW.startsWith("/"));

function resolveUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (IS_EXTERNAL) {
    const base = RAW.startsWith("http") ? RAW : `https://${RAW}`;
    return `${base}/api${p}`;
  }
  return `${RAW || "/api"}${p}`;
}

const api = ky.create({
  hooks: {
    beforeError: [
      (state) => {
        const { error } = state;
        if (isHTTPError(error) && error.data) {
          const data = error.data as { message?: string };
          if (data.message) {
            error.message = data.message;
          }
        }
        return error;
      },
    ],
  },
});

async function request<T>(url: string, options?: Options): Promise<T> {
  return api(resolveUrl(url), options).json<T>();
}

export { api, request };
export type { Options };
