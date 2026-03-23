import { BUTTONS } from "../constants";
import CalcButton from "./CalcButton";

export default function ButtonGrid({ activeOp, onInput, btnHeight }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
        padding: "20px 18px 48px",
      }}
    >
      {BUTTONS.map((btn) => (
        <CalcButton
          key={btn.label}
          btn={btn}
          activeOp={activeOp}
          btnHeight={btnHeight}
          onClick={() => onInput(btn.action, btn.type)}
        />
      ))}
    </div>
  );
}