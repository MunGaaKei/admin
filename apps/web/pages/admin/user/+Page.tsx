import { Button, Checkbox, Datagrid, Form, Input, Message, Modal, Tag } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useMemo, useState } from "react";
import { request } from "../../../src/api/client.js";
import type { ApiResponse } from "../../../src/types.js";
import { tryto } from "../../../src/utils/index.js";

interface Role {
    id: number;
    name: string;
    code: string;
}

interface User {
    id: number;
    username: string;
    nickname: string;
    roles: Role[];
}

export default function PermissionsPage() {
    const { t } = useLingui();
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const form = Form.useForm();

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

    const handleEdit = useCallback(
        (user: User) => {
            setEditingUser(user);
            form.set({ nickname: user.nickname, roleCodes: user.roles.map((r) => r.code) });
            setModalVisible(true);
        },
        [form],
    );

    const handleSave = useCallback(async () => {
        if (!editingUser) return false;

        const values = form.get();
        const { error } = await tryto(
            request(`users/${editingUser.id}`, {
                method: "put",
                json: { nickname: values.nickname, roleCodes: values.roleCodes },
            }),
        );

        if (error) {
            Message.error(error.message);
            return false;
        }

        Message.success(t`更新成功`);
        setModalVisible(false);
        loadUsers();
    }, [editingUser, form, loadUsers, t]);

    const roleOptions = useMemo(() => roles.map((r) => ({ label: r.name, value: r.code })), [roles]);

    const columns = useMemo(
        () => [
            { id: "id", title: t`ID`, width: 80 },
            { id: "username", title: t`用户名` },
            { id: "nickname", title: t`昵称` },
            {
                id: "roles",
                title: t`角色`,
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
                width: 100,
                render: (_: any, data: any) => {
                    const user = data as User;
                    return (
                        <Button size="small" className="bg-blue" onClick={() => handleEdit(user)}>{t`管理`}</Button>
                    );
                },
            },
        ],
        [t, handleEdit],
    );

    return (
        <>
            <header className="flex pd-12">
                <h3>{t`用户管理`}</h3>
            </header>

            <Datagrid data={users} columns={columns as any} className="flex-1 mg-12" rowKey="id" border resizable />

            <Modal
                visible={modalVisible}
                backdropClosable={false}
                onVisibleChange={(v) => {
                    setModalVisible(v);
                    if (!v) setEditingUser(null);
                }}
                title={t`用户管理`}
                width={520}
                onOk={handleSave}
            >
                <Form form={form} labelWidth="6em" labelInline labelRight className="px-12">
                    <Form.Field name="nickname">
                        <Input label={t`昵称`} />
                    </Form.Field>

                    <Form.Field name="roleCodes">
                        <Checkbox label={t`角色`} options={roleOptions} optionInline />
                    </Form.Field>
                </Form>
            </Modal>
        </>
    );
}
