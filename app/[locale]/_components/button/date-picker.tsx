import { ChangeEvent } from "react";

export default function DatePicker(props: {
  date: Date;
  onChange: (date: Date) => void;
  unclickable?: boolean;
}) {
  const click = props.unclickable ? "pointer-events-none" : "";
  const textColor = props.unclickable ? "border-stone-500" : "border-black";
  const borderColor = props.unclickable ? "text-stone-500" : "text-black";

  return (
    <>
      <input
        className={`${borderColor} border ${textColor} font-medium py-1 px-2 text-l ${click}`}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const date = new Date(event.target.value);
          props.onChange(date);
        }}
        disabled={props.unclickable}
        type="date"
        id="start"
        name="trip-start"
        value={`${props.date.getFullYear()}-${String(props.date.getMonth() + 1).padStart(2, "0")}-${String(props.date.getDate()).padStart(2, "0")}`}
      />
    </>
  );
}
