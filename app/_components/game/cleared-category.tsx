import { getWordColor } from "@/app/_utils";
import { Category } from "@/app/_types";
import { useTranslations } from "next-intl";

export default function ClearedCategory(props: { category: Category }) {
  const t = useTranslations("HomePage");
  const level = props.category.level;
  const bgColor = getWordColor(level);

  const concatItems = props.category.items.join(", ");

  return (
    <div
      className={`flex flex-col items-center col-span-4 py-4 rounded-md ${bgColor}`}
    >
      <h1 className="text-black font-bold text-md md:text-lg">
        {props.category.category}
      </h1>
      <h2 className="text-black text-sm md:text-md text-center mx-2">
        {t("categoryItems", { items: concatItems })}
      </h2>
    </div>
  );
}