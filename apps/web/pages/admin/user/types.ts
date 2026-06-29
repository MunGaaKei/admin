export interface User {
    id: number;
    username: string;
    nickname: string;
    roles: Role[];
}

export interface Role {
    id: number;
    name: string;
    code: string;
}
