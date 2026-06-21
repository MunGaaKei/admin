import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export const ready$: Promise<void> = import.meta.env.DEV
  ? worker.start({ onUnhandledRequest: "bypass" }).then(() => {})
  : Promise.resolve();
