import { Form, Input, Message, Modal, Select } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { request } from "../../../../src/api/client.js";
import { tryto } from "../../../../src/utils/index.js";

interface Permission {
    id: number;
    code: string;
    description: string | null;
}

interface RoleFormModalProps {
    permissions: Permission[];
    onSuccess: () => void;
}

export interface RoleFormModalHandle {
    openAdd(): void;
    openEdit(id: number, data: { name: string; code: string; description: string | null; permissionIds: number[] }): void;
}

const RoleFormModal = forwardRef<RoleFormModalHandle, RoleFormModalProps>(({ permissions, onSuccess }, ref) => {
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
                form.set(data);
                setVisible(true);
            },
        }),
        [form],
    );

    const handleSubmit = useCallback(async () => {
        const values = form.get();
        const { error } = editingId !== null ? await tryto(request(`roles/${editingId}`, { method: "put", json: values })) : await tryto(request("roles", { method: "post", json: values }));

        if (error) {
            Message.error(error.message);
            return false;
        }

        Message.success(editingId !== null ? t`更新成功` : t`创建成功`);
        setVisible(false);
        onSuccess();
    }, [editingId, form, onSuccess, t]);

    return (
        <Modal visible={visible} onVisibleChange={setVisible} title={editingId !== null ? t`编辑角色` : t`添加角色`} width={520} onOk={handleSubmit}>
            <Form form={form} labelWidth="6em" labelInline labelRight className="px-12">
                <Form.Field name="name" required>
                    <Input label={t`角色名称`} />
                </Form.Field>

                <Form.Field name="code" required>
                    <Input label={t`角色代码`} />
                </Form.Field>

                <Form.Field name="description">
                    <Input.Textarea label={t`描述`} autoSize />
                </Form.Field>

                <Form.Field name="permissionIds">
                    <Select label={t`权限`} multiple options={permissions.map((p) => ({ label: p.code, value: p.id }))} />
                </Form.Field>
            </Form>
        </Modal>
    );
});

export default RoleFormModal;
