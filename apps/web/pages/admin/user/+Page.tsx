import { Button, Flex } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "../../../src/api/client.js";
import type { ApiResponse } from "../../../src/types.js";
import { tryto } from "../../../src/utils/index.js";
import type { UserFormModalHandle } from "./components/user-form-modal.js";
import UserFormModal from "./components/user-form-modal.js";
import UserTable from "./components/user-table.js";
import type { User, Role } from "./types.js";

export default function PermissionsPage() {
    const { t } = useLingui();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const formModalRef = useRef<UserFormModalHandle>(null);

    const loadUsers = useCallback(async () => {
        const { data } = await tryto(request<ApiResponse<User[]>>("users"));
        if (data) setUsers(data.data);
    }, []);

    const loadRoles = useCallback(async () => {
        const { data } = await tryto(request<ApiResponse<Role[]>>("roles"));
        if (data) setRoles(data.data);
    }, []);

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, [loadUsers, loadRoles]);

    const handleEdit = useCallback((user: User) => {
        formModalRef.current?.openEdit(user.id, {
            nickname: user.nickname,
            roleCodes: user.roles.map((r) => r.code),
        });
    }, []);

    return (
        <Flex className="flex-1 flex-column gap-12 pd-12">
            <header className="flex">
                <h3>{t`用户管理`}</h3>

                <Button className="ml-auto" onClick={() => formModalRef.current?.openAdd()}>{t`添加`}</Button>
            </header>

            <UserTable users={users} onEdit={handleEdit} onDelete={loadUsers} />

            <UserFormModal ref={formModalRef} roles={roles} onSuccess={loadUsers} />
        </Flex>
    );
}
