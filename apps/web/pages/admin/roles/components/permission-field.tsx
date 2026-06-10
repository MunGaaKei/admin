import { Button, Input, Message, Modal, Pill, Tag } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { request } from "@web/api/client.js";
import { tryto } from "@web/utils/index.js";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Permission {
    id: number;
    code: string;
    description: string | null;
}

interface PermissionFieldProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

export interface PermissionFieldHandle {
    getMapping(): Record<string, number>;
}

const PermissionField = forwardRef<PermissionFieldHandle, PermissionFieldProps>(({ value = [], onChange }, ref) => {
    const { t } = useLingui();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [draftSelected, setDraftSelected] = useState<string[]>([]);
    const codeToIdRef = useRef<Record<string, number>>({});
    const draftSelectedRef = useRef(draftSelected);
    const onChangeRef = useRef(onChange);
    draftSelectedRef.current = draftSelected;
    onChangeRef.current = onChange;

    useImperativeHandle(ref, () => ({ getMapping: () => codeToIdRef.current }), []);

    const loadPermissions = useCallback(async () => {
        const { data } = await tryto(request<any>("permissions"));
        if (!data) return;
        setPermissions(data.data);
        const mapping: Record<string, number> = {};
        data.data.forEach((p: Permission) => {
            mapping[p.code] = p.id;
        });
        codeToIdRef.current = { ...codeToIdRef.current, ...mapping };
    }, []);

    useEffect(() => {
        loadPermissions();
    }, [loadPermissions]);

    const handleOpenModal = useCallback(() => {
        setDraftSelected([...value]);
        setFilterText("");
        setModalVisible(true);
    }, [value]);

    const handleOk = useCallback(() => {
        onChangeRef.current?.(draftSelectedRef.current);
        setModalVisible(false);
    }, []);

    const handleAdd = useCallback(
        (code: string) => {
            if (!draftSelected.includes(code)) {
                setDraftSelected((prev) => [...prev, code]);
            }
        },
        [draftSelected],
    );

    const ensurePermission = useCallback(
        async (code: string): Promise<boolean> => {
            const existing = permissions.find((p) => p.code === code);
            if (existing) {
                codeToIdRef.current[existing.code] = existing.id;
                return true;
            }

            const { data, error } = await tryto(request<any>("permissions", { method: "post", json: { code } }));
            if (error || !data) {
                Message.error(error?.message ?? t`创建权限失败`);
                return false;
            }
            codeToIdRef.current[data.data.code] = data.data.id;
            setPermissions((prev) => [...prev, data.data]);
            return true;
        },
        [permissions, t],
    );

    const handleOuterPillUpdate = useCallback(
        async (_newValue: any, _oldValue: any, type: "delete" | "create" | "update") => {
            if (type !== "create") return true;
            return ensurePermission(_newValue);
        },
        [ensurePermission],
    );

    const handleMiddlePillUpdate = useCallback(
        async (_newValue: any, _oldValue: any, type: "delete" | "create" | "update") => {
            if (type === "create") {
                const ok = await ensurePermission(_newValue);
                if (ok) handleAdd(_newValue);
                return ok;
            }

            if (type === "delete") {
                const perm = permissions.find((p) => p.code === _oldValue);
                if (!perm) return true;

                const { error } = await tryto(request(`permissions/${perm.id}`, { method: "delete" }));
                if (error) {
                    Message.error(error.message);
                    return false;
                }
                setPermissions((prev) => prev.filter((p) => p.id !== perm.id));
                setDraftSelected((prev) => prev.filter((c) => c !== perm.code));
                return true;
            }

            return true;
        },
        [permissions, handleAdd, ensurePermission],
    );

    const handleAvailablePillUpdate = useCallback(
        async (_newValue: any, _oldValue: any, type: "delete" | "create" | "update") => {
            if (type === "create") {
                const ok = await ensurePermission(_newValue);
                if (ok) handleAdd(_newValue);
                return ok;
            }

            if (type === "delete") {
                const perm = permissions.find((p) => p.code === _oldValue);
                if (!perm) return true;

                const { error } = await tryto(request(`permissions/${perm.id}`, { method: "delete" }));
                if (error) {
                    Message.error(error.message);
                    return false;
                }
                setPermissions((prev) => prev.filter((p) => p.id !== perm.id));
                return true;
            }

            return true;
        },
        [permissions, ensurePermission, handleAdd],
    );

    const filteredAvailable = permissions
        .filter((p) => !draftSelected.includes(p.code))
        .filter((p) => !filterText || p.code.toLowerCase().includes(filterText.toLowerCase()))
        .map((p) => p.code);

    return (
        <>
            <div className="flex gap-4 items-start">
                <Pill label={t`权限`} value={value} onChange={onChange} onUpdate={handleOuterPillUpdate} className="flex-1" />
                <Button size="small" secondary onClick={handleOpenModal}>{t`权限列表`}</Button>
            </div>

            <Modal visible={modalVisible} onVisibleChange={setModalVisible} title={t`权限管理`} width={520} onOk={handleOk} onClose={() => setModalVisible(false)}>
                <div className="flex flex-column gap-12 px-12">
                    <Input placeholder={t`搜索`} value={filterText} onChange={setFilterText} />

                    <Pill
                        label={t`可用权限`}
                        value={filteredAvailable}
                        onChange={() => {}}
                        onUpdate={handleAvailablePillUpdate}
                        renderItem={(ctx) => (
                            <Tag
                                key={ctx.value}
                                className="i-pill"
                                onClick={() => handleAdd(ctx.value)}
                                onClose={(e) => {
                                    e.stopPropagation();
                                    ctx.remove();
                                }}
                            >
                                {ctx.value}
                            </Tag>
                        )}
                    />

                    <Pill label={t`当前角色权限`} value={draftSelected} onChange={setDraftSelected} />
                </div>
            </Modal>
        </>
    );
});

export default PermissionField;
