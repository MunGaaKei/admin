import { Datagrid } from "@ioca/react";

export default function Task() {
    return (
        <div className="flex flex-1 flex-column h-100 pd-12">
            <Datagrid data={[]} className="flex-1" />
        </div>
    );
}
