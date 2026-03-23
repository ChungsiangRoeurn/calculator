import { useEffect } from "react";
import { FONT_LINK } from "./constants";
import { useCalculator } from "./hooks";
import { useTelegramViewport } from "./hooks/useTelegramViewport";
import Display from "./components/Display";
import ButtonGrid from "./components/ButtonGrid";

export default function Calculator() {
  const {
    display, history, operator, activeOp,
    isError, flash,
    handleInput, handleBackspace,
  } = useCalculator();

  // Real viewport height — works correctly in Telegram Desktop, Mobile, and browser
  const { vh, btnHeight } = useTelegramViewport();

  // Inject Google Fonts once
  useEffect(() => {
    if (!document.querySelector("#calc-fonts")) {
      const link = document.createElement("link");
      link.id   = "calc-fonts";
      link.rel  = "stylesheet";
      link.href = FONT_LINK;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      style={{
        // Use exact viewport height — no overflow, no scroll
        height: vh,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 30% 20%, #1a1030 0%, #0c0a14 60%, #080810 100%)",
        fontFamily: "'Outfit', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Phone shell — fills exact height, no overflow */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          height: "100%",         // fills the vh wrapper exactly
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(175deg, #13111f 0%, #0d0b18 50%, #0a0914 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient top glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            width: 280,
            height: 200,
            background:
              "radial-gradient(ellipse, rgba(201,131,42,0.10) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Display
          display={display}
          history={history}
          operator={operator}
          isError={isError}
          flash={flash}
          onBackspace={handleBackspace}
        />

        {/* Separator line */}
        <div
          style={{
            margin: "0 20px",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,108,0.14), transparent)",
          }}
        />

        <ButtonGrid activeOp={activeOp} onInput={handleInput} btnHeight={btnHeight} />
      </div>
    </div>
  );
}