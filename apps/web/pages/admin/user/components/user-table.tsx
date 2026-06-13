import { Button, Datagrid, Message, Popconfirm, Tag } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { request } from "@web/api/client.js";
import { tryto } from "@web/utils/index.js";
import { useCallback, useMemo } from "react";
import type { User } from "../types.js";
import { Role } from "../types.js";

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: () => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
    const { t } = useLingui();

    const handleDelete = useCallback(
        async (user: User) => {
            const { error } = await tryto(request(`users/${user.id}`, { method: "delete" }));
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
            { id: "id", title: t`ID` },
            { id: "username", title: t`用户名` },
            { id: "nickname", title: t`昵称` },
            {
                id: "roles",
                title: t`角色`,
                width: 160,
                render: (value: Role[]) => (
                    <div className="flex gap-4 flex-wrap">
                        {value?.map((role) => (
                            <Tag key={role.id}>{role.name}</Tag>
                        ))}
                    </div>
                ),
            },
            {
                id: "actions",
                title: t`操作`,
                width: 120,
                render: (_: any, data: any) => {
                    const user = data as User;
                    return (
                        <div className="flex gap-8">
                            <Button size="small" className="bg-blue" onClick={() => onEdit(user)}>{t`编辑`}</Button>
                            <Popconfirm content={t`确定要删除该用户吗？`} okButtonProps={{ className: "bg-error" }} onOk={() => handleDelete(user)}>
                                <Button size="small" className="bg-error">{t`删除`}</Button>
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ],
        [t, onEdit, handleDelete],
    );

    return <Datagrid data={users} columns={columns as any} className="flex-1" rowKey="id" border resizable />;
}
