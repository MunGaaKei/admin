import { Button, Datagrid, Tag } from "@ioca/react";
import { IColumn } from "@ioca/react/components/datagrid/type";
import { useLingui } from "@lingui/react/macro";
import { ready$ } from "@web/mocks/browser";
import type { Task } from "@web/mocks/types";
import { useEffect, useMemo, useState } from "react";

const statusColor: Record<Task["status"], string> = {
    Todo: "bg-grey-0",
    "In Progress": "bg-blue-0 blue",
    Review: "bg-warning-0 warning",
    Done: "bg-success black",
};

const priorityColor: Record<Task["priority"], string> = {
    P0: "red",
    P1: "orange",
    P2: "blue",
    P3: "",
};

export default function Task() {
    const { t } = useLingui();
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const columns = useMemo<IColumn[]>(
        () => [
            { id: "id", title: "ID", fixed: "left", width: 100 },
            { id: "title", title: t`标题`, width: 200 },
            {
                id: "status",
                title: t`状态`,
                justify: "center",
                width: 100,
                render: (value: Task["status"]) => {
                    return (
                        <Tag round className={statusColor[value]}>
                            {value}
                        </Tag>
                    );
                },
            },
            {
                id: "priority",
                title: t`优先级`,
                render: (value: Task["priority"]) => (
                    <b className={priorityColor[value]}>{value}</b>
                ),
            },
            {
                id: "assignee",
                title: t`负责人`,
                render: (_, data: any) => <span>{data.assignee.name}</span>,
            },
            { id: "project", title: t`项目`, width: "140px" },
            {
                id: "tags",
                title: t`标签`,
                width: 200,
                render: (value: Task["tags"]) =>
                    value.map((tag) => <Tag key={tag}>{tag}</Tag>),
            },
            {
                id: "dueDate",
                title: t`截止日期`,
                width: 120,
                render: (value: Task["dueDate"]) =>
                    new Date(value).toLocaleDateString("zh-CN"),
            },
            {
                id: "createdAt",
                title: t`创建时间`,
                width: 120,
                render: (value: Task["createdAt"]) =>
                    new Date(value).toLocaleDateString("zh-CN"),
            },
            {
                id: "action",
                title: t`操作`,
                width: 60,
                fixed: "right",
                justify: "center",
                render: () => {
                    return <Button size="small">{t`查看`}</Button>;
                },
            },
        ],
        [t],
    );

    useEffect(() => {
        ready$
            .then(() =>
                fetch("/mock/tasks")
                    .then(
                        (r) =>
                            r.json() as Promise<{
                                data: Task[];
                                message: string;
                            }>,
                    )
                    .then((res) => setData(res.data)),
            )
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="flex flex-1 flex-column pd-12 h-100">
            <Datagrid
                data={data}
                columns={columns}
                className="flex-1"
                resizable
                loading={loading}
                border
                striped
                rowKey="id"
                cellEllipsis
            />
        </div>
    );
}
