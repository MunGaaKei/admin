import ky, { type Options, isHTTPError } from "ky";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const api = ky.create({
  prefix: API_BASE,
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

async function request<T>(
  url: string,
  options?: Options,
): Promise<T> {
  return api(url, options).json<T>();
}

export { api, request };
export type { Options };
