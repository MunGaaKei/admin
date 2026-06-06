export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  roles: string[];
  permissions: string[];
}
