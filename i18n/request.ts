import { getRequestConfig } from "next-intl/server";

// @ts-ignore
export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  return {
    // do this to make next-intl not emmit any warnings
    locale,
    messages: { locale: locale! },
  };
});
