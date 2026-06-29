import { Button, Datagrid, Pagination, Tag } from "@ioca/react";
import { IColumn } from "@ioca/react/components/datagrid/type";
import { useLingui } from "@lingui/react/macro";
import type { Task } from "@web/mocks/types";
import { useEffect, useMemo, useState } from "react";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

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

const tagColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "pink",
    "purple",
    "orange",
    "aqua",
    "grey",
    "brown",
    "warning",
    "success",
    "error",
];

const PAGE_SIZE = 30;

export default function Task() {
    const { t } = useLingui();
    const [data, setData] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

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
                width: 260,
                render: (value: Task["tags"]) =>
                    value.map((tag) => {
                        const idx = tag
                            .split("")
                            .reduce((s, c) => s + c.charCodeAt(0), 0);
                        const color = tagColors[idx % tagColors.length];
                        return (
                            <Tag key={tag} className={`bg-${color}`}>
                                {tag}
                            </Tag>
                        );
                    }),
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

    const pageData = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return data.slice(start, start + PAGE_SIZE);
    }, [data, page]);

    useEffect(() => {
        (async () => {
            await delay(1200);
            const r = await fetch("/tasks.json");
            const res = (await r.json()) as { data: Task[]; message: string };
            setData(res.data);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [data.length]);

    const handlePageChange = async (p: number) => {
        setLoading(true);
        await delay(1200);
        setPage(p);
        setLoading(false);
    };

    return (
        <div className="flex flex-1 flex-column pd-12 overflow-auto h-100">
            <Datagrid
                data={pageData}
                columns={columns}
                className="flex-1"
                resizable
                loading={loading}
                border
                striped
                rowKey="id"
                cellEllipsis
            />

            <Pagination
                page={page}
                total={data.length}
                size={PAGE_SIZE}
                prev={null}
                next={null}
                onChange={handlePageChange}
                className="mt-12"
            />
        </div>
    );
}
