import { usePress } from "../hooks";

/** Returns the style object for a button based on its type, active state, and press state. */
function getButtonStyle(btn, isActive, pressed, btnHeight) {
  // Scale font size proportionally to button height (baseline: 72px)
  const scale = btnHeight / 72;

  const base = {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: Math.round(
      (btn.type === "op" || btn.type === "eq" ? 26 : btn.type === "fn" ? 15 : 22) * scale
    ),
    height: btnHeight,
    display: "flex",
    alignItems: "center",
    justifyContent: btn.wide ? "flex-start" : "center",
    paddingLeft: btn.wide ? Math.round(32 * scale) : 0,
    borderRadius: btn.wide ? btnHeight / 2 : Math.round(24 * scale),
    border: "none",
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    transition: "transform 120ms cubic-bezier(.34,1.56,.64,1), box-shadow 120ms ease",
    transform: pressed ? "scale(0.88)" : "scale(1)",
    position: "relative",
    overflow: "hidden",
    gridColumn: btn.wide ? "span 2" : undefined,
  };

  switch (btn.type) {
    case "num":
      return {
        ...base,
        background: "linear-gradient(145deg, #242436, #1c1c2e)",
        color: "#eeeeff",
        boxShadow: pressed
          ? "inset 0 2px 6px rgba(0,0,0,0.5)"
          : "0 4px 0 #0e0e1a, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
      };

    case "fn":
      return {
        ...base,
        background: "linear-gradient(145deg, #1e1e32, #181828)",
        color: "#94a3b8",
        boxShadow: pressed
          ? "inset 0 2px 6px rgba(0,0,0,0.5)"
          : "0 3px 0 #0c0c18, 0 5px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
      };

    case "op":
      return {
        ...base,
        background: isActive
          ? "linear-gradient(145deg, #e8a94a, #c9832a)"
          : "linear-gradient(145deg, #2a2240, #201a34)",
        color: isActive ? "#fff8ee" : "#c9a86c",
        boxShadow: pressed
          ? "inset 0 2px 8px rgba(0,0,0,0.5)"
          : isActive
            ? "0 4px 0 #7a4a10, 0 6px 24px rgba(201,131,42,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 4px 0 #0e0a1e, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,108,0.1)",
      };

    case "eq":
    default:
      return {
        ...base,
        background: pressed
          ? "linear-gradient(145deg, #d4943a, #b57020)"
          : "linear-gradient(145deg, #f0a83c, #d4843c)",
        color: "#1a0e00",
        fontWeight: 700,
        boxShadow: pressed
          ? "inset 0 2px 8px rgba(0,0,0,0.3)"
          : "0 5px 0 #7a4210, 0 8px 28px rgba(240,168,60,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
      };
  }
}

export default function CalcButton({ btn, activeOp, btnHeight = 72, onClick }) {
  const { pressed, handlers } = usePress();
  const isActive = btn.type === "op" && activeOp === btn.action;

  return (
    <button
      style={getButtonStyle(btn, isActive, pressed, btnHeight)}
      {...handlers}
      onClick={onClick}
    >
      {btn.label}
    </button>
  );
}