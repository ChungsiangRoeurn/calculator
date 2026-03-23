import { OP_SYMBOLS } from "../constants";
import { getDisplayFontSize } from "../utils";
import BackspaceButton from "./BackspaceButton";

export default function Display({ display, history, operator, isError, flash, onBackspace }) {
  const fontSize = getDisplayFontSize(display);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "40px 24px 24px",
        minHeight: 200,
        position: "relative",
      }}
    >
      {/* Backspace button — top right */}
      <div style={{ position: "absolute", top: 20, right: 16 }}>
        <BackspaceButton onClick={onBackspace} />
      </div>

      {/* Operator badge — top left */}
      {operator && (
        <div style={{ position: "absolute", top: 28, left: 24 }}>
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 12px",
              borderRadius: 20,
              letterSpacing: "0.08em",
              background: "rgba(201,131,42,0.15)",
              border: "1px solid rgba(201,168,108,0.35)",
              color: "#c9a86c",
            }}
          >
            {OP_SYMBOLS[operator]}
          </span>
        </div>
      )}

      {/* Calculation history */}
      <p
        style={{
          textAlign: "right",
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.04em",
          minHeight: 22,
          marginBottom: 8,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {history}
      </p>

      {/* Main number */}
      <div
        style={{
          textAlign: "right",
          fontFamily: "'Space Mono', monospace",
          fontSize,
          fontWeight: 400,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: isError ? "#f87171" : flash ? "#f0a83c" : "#f5f0ff",
          transition: "font-size 180ms ease, color 150ms ease",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {display}
      </div>
    </div>
  );
}