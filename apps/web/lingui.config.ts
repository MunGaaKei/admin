import { defineConfig } from "@lingui/cli";
import type { LinguiConfig } from "@lingui/conf";
import { formatter } from "@lingui/format-po";

const config: LinguiConfig = defineConfig({
  sourceLocale: "zh-CN",
  locales: ["zh-CN", "en-US"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src", "components", "config", "tabs", "pages"],
    },
  ],
  format: formatter({ lineNumbers: false }),
  compileNamespace: "es",
});

export default config;
