export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
}) {
  const disabled = props.unclickable;

  return (
    <button
      className={`flex-1 border rounded-full font-medium py-3 px-2 md:px-4 text-sm md:text-base whitespace-nowrap transition-opacity
        ${
          disabled
            ? "border-[#99a1af] text-[#4a5565] opacity-50 pointer-events-none"
            : "border-black text-black"
        }`}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
