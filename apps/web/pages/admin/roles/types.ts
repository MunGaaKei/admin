export interface Role {
    id: number;
    name: string;
    code: string;
    description: string | null;
    permissionIds: number[];
    permissionCodes: string[];
}
