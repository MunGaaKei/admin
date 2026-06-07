import { i18n } from "@lingui/core";
import type { Messages } from "@lingui/core";

import { messages as zhCNMessages } from "../locales/zh-CN/messages";

const catalogs: Record<string, () => Promise<{ messages: Messages }>> = {
  "zh-CN": () => Promise.resolve({ messages: zhCNMessages }),
  "en-US": () => import("../locales/en-US/messages"),
};

export async function dynamicActivate(locale: string): Promise<void> {
  const loadMessages = catalogs[locale];
  if (!loadMessages) {
    console.error(`Unknown locale "${locale}". Falling back to zh-CN.`);
    i18n.activate("zh-CN");
    return;
  }

  const { messages } = await loadMessages();
  i18n.load(locale, messages);
  i18n.activate(locale);
}

i18n.load("zh-CN", zhCNMessages);
i18n.activate("zh-CN");

export { i18n };
