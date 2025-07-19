import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "use-intl";
import { ALL_LANGUAGES, DEFAULT_LANGUAGE } from "@/tolgee/shared";

// @ts-ignore
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(ALL_LANGUAGES, requested)
    ? requested
    : DEFAULT_LANGUAGE;

  return {
    // do this to make next-intl not emmit any warnings
    locale,
    //messages: { locale: locale! },
  };
});
