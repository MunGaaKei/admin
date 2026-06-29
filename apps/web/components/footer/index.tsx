import { Button } from "@ioca/react";
import { Cog, Columns2, RotateCw } from "lucide-react";
import css from "./index.module.css";

export default function Footer() {
    return (
        <footer className={css.footer}>
            <b>user.nickname</b>

            <div className="flex-1"></div>

            <Button flat square size="small">
                <Columns2 size={18} />
            </Button>

            <Button flat square size="small">
                <RotateCw size={18} />
            </Button>

            <Button flat square size="small">
                <Cog size={18} />
            </Button>
        </footer>
    );
}
