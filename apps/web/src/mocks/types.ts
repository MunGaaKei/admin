export interface TaskUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "Todo" | "In Progress" | "Review" | "Done";
  priority: "P0" | "P1" | "P2" | "P3";
  assignee: TaskUser;
  creator: TaskUser;
  tags: string[];
  project: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
}
