import { Button, Datagrid, Message, Popconfirm, Tag } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { request } from "@web/api/client.js";
import { tryto } from "@web/utils/index.js";
import { useCallback, useMemo } from "react";
import type { Role } from "../types.js";

interface RoleTableProps {
    roles: Role[];
    onEdit: (role: Role) => void;
    onDelete: () => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
    const { t } = useLingui();

    const handleDelete = useCallback(
        async (role: Role) => {
            const { error } = await tryto(request(`roles/${role.id}`, { method: "delete" }));
            if (error) {
                Message.error(error.message);
                return;
            }
            Message.success(t`删除成功`);
            onDelete();
        },
        [onDelete, t],
    );

    const columns = useMemo(
        () => [
            { id: "name", title: t`角色名称` },
            { id: "code", title: t`角色代码` },
            { id: "description", title: t`描述`, width: 240 },
            {
                id: "permissionCodes",
                title: t`权限`,
                render: (value: string[]) => (
                    <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
                        {value?.map((code) => (
                            <Tag key={code}>{code}</Tag>
                        ))}
                    </div>
                ),
            },
            {
                id: "actions",
                title: t`操作`,
                width: 120,
                render: (_: any, data: any) => {
                    const role = data as Role;
                    return (
                        <div className="flex gap-8">
                            <Button size="small" className="bg-blue" onClick={() => onEdit(role)}>{t`编辑`}</Button>
                            <Popconfirm content={t`确定要删除该角色吗？`} okButtonProps={{ className: "bg-error" }} onOk={() => handleDelete(role)}>
                                <Button className="bg-error" size="small">{t`删除`}</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ],
        [t, onEdit, handleDelete],
    );

    return <Datagrid data={roles} columns={columns as any} className="flex-1" rowKey="id" border resizable />;
}
