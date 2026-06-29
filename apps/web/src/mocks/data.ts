import type { Task } from "./types";

const names = [
  "张三", "李四", "王五", "赵六", "陈七",
  "刘八", "孙九", "周十", "吴十一", "郑十二",
];

const projects = [
  "用户中心重构", "订单系统升级", "支付平台优化",
  "运营后台开发", "移动端改版",
];

const tagPool = [
  "Frontend", "Backend", "UI", "API", "Auth",
  "Bug", "Feature", "Refactor", "Database", "Performance",
];

const statuses: Task["status"][] = ["Todo", "In Progress", "Review", "Done"];
const priorities: Task["priority"][] = ["P0", "P1", "P2", "P3"];

const taskTemplates = [
  "实现登录功能", "优化列表性能", "修复支付异常",
  "新增导出功能", "重构权限模块", "接入第三方API",
  "完善消息通知", "开发数据看板",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], min: number, max: number): T[] {
  const n = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function pad(n: number): string {
  return String(n).padStart(4, "0");
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const id = `TASK-${pad(i)}`;
    const template = taskTemplates[(i - 1) % taskTemplates.length];
    const assigneeName = names[(i - 1) % names.length];
    const creatorName = names[Math.floor(Math.random() * names.length)];
    const createdAt = randomDate(new Date("2026-06-01"), now);
    const updatedAt = randomDate(createdAt, now);
    const dueAt = randomDate(updatedAt, new Date("2026-07-15"));

    tasks.push({
      id,
      title: `${template}${i > taskTemplates.length ? ` ${Math.ceil(i / taskTemplates.length)}` : ""}`,
      description: `这是第 ${i} 个任务，用于模拟后台任务列表数据。`,
      status: pick(statuses),
      priority: pick(priorities),
      assignee: {
        id: `U${pad(i)}`,
        name: assigneeName,
        avatar: `https://i.pravatar.cc/150?img=${i % 70}`,
      },
      creator: {
        id: `U${pad((i % names.length) + names.length)}`,
        name: creatorName,
      },
      tags: pickN(tagPool, 1, 3),
      project: pick(projects),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      dueDate: dueAt.toISOString(),
    });
  }

  return tasks;
}
