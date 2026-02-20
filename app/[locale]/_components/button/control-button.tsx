export default function ControlButton(props: {
  text: string;
  onClick: () => void;
  unclickable?: boolean;
}) {
  const disabled = props.unclickable;

  return (
    <button
      className={`flex-1 border rounded-full font-medium py-3 px-4 text-base transition-opacity
        ${
          disabled
            ? "border-[#99a1af] text-[#4a5565] opacity-50 pointer-events-none"
            : "border-black text-black"
        }`}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
