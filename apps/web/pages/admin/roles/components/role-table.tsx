import { Button, Datagrid, Message, Modal, Tag } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useMemo, useState } from "react";
import { request } from "../../../../src/api/client.js";
import { tryto } from "../../../../src/utils/index.js";
import type { Role } from "../types.js";

interface RoleTableProps {
    roles: Role[];
    onEdit: (role: Role) => void;
    onDelete: () => void;
}

export default function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
    const { t } = useLingui();
    const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

    const handleDelete = useCallback(async () => {
        if (!deleteTarget) return;
        const { error } = await tryto(request(`roles/${deleteTarget.id}`, { method: "delete" }));
        if (error) {
            Message.error(error.message);
            return;
        }
        Message.success(t`删除成功`);
        setDeleteTarget(null);
        onDelete();
    }, [deleteTarget, onDelete, t]);

    const columns = useMemo(
        () => [
            { id: "name", title: t`角色名称` },
            { id: "code", title: t`角色代码` },
            { id: "description", title: t`描述` },
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
                render: (_: any, data: any) => {
                    const role = data as Role;
                    return (
                        <div className="flex gap-8">
                            <Button size="small" className="bg-blue" onClick={() => onEdit(role)}>{t`编辑`}</Button>
                            <Button secondary size="small" onClick={() => setDeleteTarget(role)}>{t`删除`}</Button>
                        </div>
                    );
                },
            },
        ],
        [t, onEdit],
    );

    return (
        <>
            <Datagrid data={roles} columns={columns as any} className="flex-1 mg-12" rowKey="id" border resizable />

            <Modal visible={!!deleteTarget} onVisibleChange={(v) => !v && setDeleteTarget(null)} title={t`确认删除`} onOk={handleDelete}>
                <span>{t`确定要删除该角色吗？`}</span>
            </Modal>
        </>
    );
}
