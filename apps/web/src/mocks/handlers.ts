import { http, HttpResponse, delay } from "msw";
import { generateTasks } from "./data";

const tasks = generateTasks(50);

export const handlers = [
  http.get("/mock/tasks", async () => {
    await delay(300);
    return HttpResponse.json({
      data: tasks,
      message: "ok",
    });
  }),
];
