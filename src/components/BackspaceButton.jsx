import { usePress } from "../hooks";
import BackspaceIcon from "./BackspaceIcon";

export default function BackspaceButton({ onClick }) {
  const { pressed, handlers } = usePress();

  return (
    <button
      onClick={onClick}
      {...handlers}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        padding: "10px 12px",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: pressed ? "scale(0.82)" : "scale(1)",
        transition: "transform 120ms cubic-bezier(.34,1.56,.64,1), opacity 120ms ease",
        opacity: pressed ? 0.6 : 1,
      }}
    >
      <BackspaceIcon size={26} color="#c9a86c" />
    </button>
  );
}