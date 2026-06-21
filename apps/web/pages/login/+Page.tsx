import { Button, Flex, Form, Input, Message } from "@ioca/react";
import { useLingui } from "@lingui/react/macro";
import { RectangleEllipsis, SquareUserRound } from "lucide-react";
import { useState } from "react";
import { navigate } from "vike/client/router";
import { useAuth } from "../../src/store/auth";
import type { LoginParams } from "../../src/types.js";
import { tryto } from "../../src/utils/index.js";
import css from "./index.module.css";

export default function Page() {
    const form = Form.useForm();
    const login = useAuth((s) => s.login);
    const [loading, setLoading] = useState(false);
    const { t } = useLingui();

    const handleLogin = async () => {
        const data = await form.validate();

        if (!data) {
            return;
        }

        setLoading(true);

        const { error } = await tryto(login(data as LoginParams));
        if (error) {
            Message.error(error.message);
        } else {
            await navigate("/");
        }
        setLoading(false);
    };

    return (
        <Form
            form={form}
            rules={{
                username: true,
                password: true,
            }}
            initialValues={{
                username: "admin",
                password: "admin",
            }}
            width={280}
            className={css.form}
            onEnter={handleLogin}
        >
            <Flex align="center" gap={8} justify="space-between">
                <h2 className={css.title}>ADMIN</h2>

                <img src="/logo.png" className={css.logo} />
            </Flex>

            <Form.Field name="username">
                <Input
                    prepend={<SquareUserRound className="ml-8" size={20} />}
                    border
                />
            </Form.Field>

            <Form.Field name="password">
                <Input
                    prepend={<RectangleEllipsis className="ml-8" size={20} />}
                    type="password"
                    border
                />
            </Form.Field>

            <Button onClick={handleLogin} loading={loading}>
                {t`登陆`}
            </Button>
        </Form>
    );
}
