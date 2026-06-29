import { Button, Flex } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useRef, useState } from "react";
import { request } from "../../../src/api/client.js";
import type { ApiResponse } from "../../../src/types.js";
import { tryto } from "../../../src/utils/index.js";
import type { RoleFormModalHandle } from "./components/role-form-modal.js";
import RoleFormModal from "./components/role-form-modal.js";
import RoleTable from "./components/role-table.js";
import type { Role } from "./types.js";

interface Permission {
    id: number;
    code: string;
    description: string | null;
}

export default function RolesPage() {
    const { t } = useLingui();
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const formModalRef = useRef<RoleFormModalHandle>(null);

    const loadRoles = useCallback(async () => {
        const { data } = await tryto(request<ApiResponse<Role[]>>("roles"));
        if (data) setRoles(data.data);
    }, []);

    const loadPermissions = useCallback(async () => {
        const { data } = await tryto(request<ApiResponse<Permission[]>>("permissions"));
        if (data) setPermissions(data.data);
    }, []);

    useEffect(() => {
        loadRoles();
        loadPermissions();
    }, [loadRoles, loadPermissions]);

    const handleEdit = useCallback((role: Role) => {
        formModalRef.current?.openEdit(role.id, {
            name: role.name,
            code: role.code,
            description: role.description,
            permissionIds: role.permissionIds,
        });
    }, []);

    return (
        <Flex className="flex-1 flex-column gap-12 pd-12">
            <header className="flex">
                <h3>{t`角色管理`}</h3>

                <Button className="ml-auto" onClick={() => formModalRef.current?.openAdd()}>{t`添加`}</Button>
            </header>

            <RoleTable roles={roles} onEdit={handleEdit} onDelete={loadRoles} />

            <RoleFormModal ref={formModalRef} permissions={permissions} onSuccess={loadRoles} />
        </Flex>
    );
}
