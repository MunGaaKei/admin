import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const config: Config = {
    title: "@ioca/admin",
    extends: vikeReact,
    ssr: false,
    prerender: true,
};

export default config;
