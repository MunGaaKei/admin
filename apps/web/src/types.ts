export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
}

export interface LoginParams {
  username: string;
  password: string;
}
