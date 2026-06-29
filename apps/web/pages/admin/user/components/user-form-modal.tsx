import { Checkbox, Form, Input, Message, Modal } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { request } from "@web/api/client.js";
import { tryto } from "@web/utils/index.js";
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";
import type { Role } from "../types.js";

interface UserFormModalProps {
    roles: Role[];
    onSuccess: () => void;
}

export interface UserFormModalHandle {
    openAdd(): void;
    openEdit(id: number, data: { nickname: string; roleCodes: string[] }): void;
}

const UserFormModal = forwardRef<UserFormModalHandle, UserFormModalProps>(({ roles, onSuccess }, ref) => {
    const { t } = useLingui();
    const [visible, setVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const form = Form.useForm();

    useImperativeHandle(
        ref,
        () => ({
            openAdd() {
                setEditingId(null);
                form.clear();
                setVisible(true);
            },
            openEdit(_id, data) {
                setEditingId(_id);
                form.set({ nickname: data.nickname, roleCodes: data.roleCodes });
                setVisible(true);
            },
        }),
        [form],
    );

    const handleSubmit = useCallback(async () => {
        const values = await form.validate();

        if (!values) return false;

        const { error } =
            editingId !== null
                ? await tryto(request(`users/${editingId}`, { method: "put", json: { nickname: values.nickname, roleCodes: values.roleCodes } }))
                : await tryto(request("users", { method: "post", json: { username: values.username, nickname: values.nickname, password: values.password, roleCodes: values.roleCodes } }));

        if (error) {
            Message.error(error.message);
            return false;
        }

        Message.success(editingId !== null ? t`更新成功` : t`添加成功`);
        setVisible(false);
        onSuccess();
    }, [editingId, form, onSuccess, t]);

    const roleOptions = useMemo(() => roles.map((r) => ({ label: r.name, value: r.code })), [roles]);

    return (
        <Modal visible={visible} backdropClosable={false} onVisibleChange={setVisible} title={editingId !== null ? t`用户管理` : t`添加用户`} width={520} onOk={handleSubmit}>
            <Form
                form={form}
                labelWidth="6em"
                labelInline
                labelRight
                className="px-12"
                rules={{
                    username: true,
                    nickname: true,
                    password: true,
                }}
            >
                {editingId === null && (
                    <Form.Field name="username" required>
                        <Input label={t`用户名`} />
                    </Form.Field>
                )}

                <Form.Field name="nickname" required>
                    <Input label={t`昵称`} />
                </Form.Field>

                {editingId === null && (
                    <Form.Field name="password" required>
                        <Input type="password" label={t`密码`} />
                    </Form.Field>
                )}

                <Form.Field name="roleCodes">
                    <Checkbox label={t`角色`} options={roleOptions} type="button" />
                </Form.Field>
            </Form>
        </Modal>
    );
});

export default UserFormModal;
