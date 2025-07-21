export default function AdminControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
}) {
  const click = props.unclickable ? "pointer-events-none" : "";
  const textColor = props.unclickable ? "border-stone-500" : "border-black";
  const borderColor = props.unclickable ? "text-stone-500" : "text-black";

  return (
    <button
      disabled={props.unclickable}
      className={`${borderColor} border rounded-full ${textColor} font-medium py-1 px-2 text-sm ${click}`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
