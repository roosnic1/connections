import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-2xl font-semibold text-black">
        {t("notFound_title")}
      </h2>
      <p className="text-gray-500">{t("notFound_description")}</p>
    </div>
  );
}
