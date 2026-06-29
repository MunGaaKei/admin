import { app } from "../src/app.js";

export async function fetch(request: Request) {
  return app.fetch(request);
}
