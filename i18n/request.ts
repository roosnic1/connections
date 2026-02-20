import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "use-intl";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from "@/i18n/config";

// @ts-ignore
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(ALL_LANGUAGES, requested)
    ? requested
    : DEFAULT_LANGUAGE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
