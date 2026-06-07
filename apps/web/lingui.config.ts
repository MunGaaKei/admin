import { defineConfig } from "@lingui/cli";
import { formatter } from "@lingui/format-po";

export default defineConfig({
  sourceLocale: "zh-CN",
  locales: ["zh-CN", "en-US"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src", "components", "config"],
    },
  ],
  format: formatter({ lineNumbers: false }),
  compileNamespace: "es",
});
