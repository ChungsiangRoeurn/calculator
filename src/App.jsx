import { useState, useCallback, useEffect } from "react";

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";

const OP_SYMBOLS = { "/": "÷", "*": "×", "-": "−", "+": "+" };

const BUTTONS = [
  { label: "AC", type: "fn", action: "clear" },
  { label: "+/−", type: "fn", action: "negate" },
  { label: "%", type: "fn", action: "percent" },
  { label: "÷", type: "op", action: "/" },
  { label: "7", type: "num", action: "7" },
  { label: "8", type: "num", action: "8" },
  { label: "9", type: "num", action: "9" },
  { label: "×", type: "op", action: "*" },
  { label: "4", type: "num", action: "4" },
  { label: "5", type: "num", action: "5" },
  { label: "6", type: "num", action: "6" },
  { label: "−", type: "op", action: "-" },
  { label: "1", type: "num", action: "1" },
  { label: "2", type: "num", action: "2" },
  { label: "3", type: "num", action: "3" },
  { label: "+", type: "op", action: "+" },
  { label: "0", type: "num", action: "0", wide: true },
  { label: ".", type: "num", action: "." },
  { label: "=", type: "eq", action: "=" },
];

function compute(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? null : a / b;
    default:
      return b;
  }
}

function fmt(n) {
  if (n === null || isNaN(n) || !isFinite(n)) return "Error";
  const s = parseFloat(n.toPrecision(12)).toString();
  if (s.includes("e")) return s;
  const [int, dec] = s.split(".");
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${intFmt}.${dec}` : intFmt;
}

/* ─── Press-scale hook ─── */
function usePress() {
  const [pressed, setPressed] = useState(false);
  return {
    pressed,
    handlers: {
      onPointerDown: () => setPressed(true),
      onPointerUp: () => setPressed(false),
      onPointerLeave: () => setPressed(false),
    },
  };
}

/* ─── Backspace SVG icon ─── */
function BackspaceIcon({ size = 22, color = "#c9a86c" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 3H7C6.27 3 5.6 3.35 5.18 3.88L1.5 8.5C1.18 8.9 1 9.44 1 10V14C1 14.56 1.18 15.1 1.5 15.5L5.18 20.12C5.6 20.65 6.27 21 7 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 9L12 14M12 9L17 14"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Individual Calc Button ─── */
function CalcButton({ btn, activeOp, onClick }) {
  const { pressed, handlers } = usePress();
  const isActive = btn.type === "op" && activeOp === btn.action;

  const base = {
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize:
      btn.type === "op" || btn.type === "eq" ? 26 : btn.type === "fn" ? 15 : 22,
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: btn.wide ? "flex-start" : "center",
    paddingLeft: btn.wide ? 32 : 0,
    borderRadius: btn.wide ? 36 : 24,
    border: "none",
    cursor: "pointer",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    transition:
      "transform 120ms cubic-bezier(.34,1.56,.64,1), box-shadow 120ms ease",
    transform: pressed ? "scale(0.88)" : "scale(1)",
    position: "relative",
    overflow: "hidden",
    gridColumn: btn.wide ? "span 2" : undefined,
  };

  if (btn.type === "num") {
    Object.assign(base, {
      background: "linear-gradient(145deg, #242436, #1c1c2e)",
      color: "#eeeeff",
      boxShadow: pressed
        ? "inset 0 2px 6px rgba(0,0,0,0.5)"
        : "0 4px 0 #0e0e1a, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
    });
  } else if (btn.type === "fn") {
    Object.assign(base, {
      background: "linear-gradient(145deg, #1e1e32, #181828)",
      color: "#94a3b8",
      boxShadow: pressed
        ? "inset 0 2px 6px rgba(0,0,0,0.5)"
        : "0 3px 0 #0c0c18, 0 5px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
    });
  } else if (btn.type === "op") {
    Object.assign(base, {
      background: isActive
        ? "linear-gradient(145deg, #e8a94a, #c9832a)"
        : "linear-gradient(145deg, #2a2240, #201a34)",
      color: isActive ? "#fff8ee" : "#c9a86c",
      boxShadow: pressed
        ? "inset 0 2px 8px rgba(0,0,0,0.5)"
        : isActive
          ? "0 4px 0 #7a4a10, 0 6px 24px rgba(201,131,42,0.45), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 4px 0 #0e0a1e, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,108,0.1)",
    });
  } else {
    Object.assign(base, {
      background: pressed
        ? "linear-gradient(145deg, #d4943a, #b57020)"
        : "linear-gradient(145deg, #f0a83c, #d4843c)",
      color: "#1a0e00",
      fontWeight: 700,
      boxShadow: pressed
        ? "inset 0 2px 8px rgba(0,0,0,0.3)"
        : "0 5px 0 #7a4210, 0 8px 28px rgba(240,168,60,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
    });
  }

  return (
    <button style={base} {...handlers} onClick={onClick}>
      {btn.label}
    </button>
  );
}

/* ─── Backspace Button ─── */
function BackspaceButton({ onClick }) {
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
        transition:
          "transform 120ms cubic-bezier(.34,1.56,.64,1), opacity 120ms ease",
        opacity: pressed ? 0.6 : 1,
      }}
    >
      <BackspaceIcon size={26} color="#c9a86c" />
    </button>
  );
}

/* ─── Main App ─── */
export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [firstVal, setFirstVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitNext, setWaitNext] = useState(false);
  const [history, setHistory] = useState("");
  const [activeOp, setActiveOp] = useState(null);
  const [isError, setIsError] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (!document.querySelector("#calc-fonts")) {
      const l = document.createElement("link");
      l.id = "calc-fonts";
      l.rel = "stylesheet";
      l.href = FONT_LINK;
      document.head.appendChild(l);
    }
  }, []);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  };

  /* ── Backspace handler ── */
  const handleBackspace = useCallback(() => {
    if (isError) {
      setDisplay("0");
      setIsError(false);
      return;
    }
    if (waitNext) return; // don't delete after operator pressed
    if (
      display.length <= 1 ||
      (display.length === 2 && display.startsWith("-"))
    ) {
      setDisplay("0");
    } else {
      const next = display.slice(0, -1);
      setDisplay(next.endsWith(",") ? next.slice(0, -1) : next);
    }
  }, [display, isError, waitNext]);

  const handleInput = useCallback(
    (action, type) => {
      setIsError(false);

      if (type === "fn") {
        if (action === "clear") {
          setDisplay("0");
          setFirstVal(null);
          setOperator(null);
          setWaitNext(false);
          setHistory("");
          setActiveOp(null);
        } else if (action === "negate") {
          const v = parseFloat(display.replace(/,/g, ""));
          if (!isNaN(v)) setDisplay(fmt(-v));
        } else if (action === "percent") {
          const v = parseFloat(display.replace(/,/g, ""));
          if (!isNaN(v)) {
            const result = firstVal !== null ? (firstVal * v) / 100 : v / 100;
            setDisplay(fmt(result));
          }
        }
        return;
      }

      if (type === "op") {
        const cur = parseFloat(display.replace(/,/g, ""));
        if (firstVal !== null && !waitNext && operator) {
          const res = compute(firstVal, cur, operator);
          if (res === null) {
            setDisplay("Error");
            setIsError(true);
            return;
          }
          setDisplay(fmt(res));
          setHistory(`${fmt(res)} ${OP_SYMBOLS[action]}`);
          setFirstVal(res);
        } else {
          setFirstVal(cur);
          setHistory(`${fmt(cur)} ${OP_SYMBOLS[action]}`);
        }
        setOperator(action);
        setActiveOp(action);
        setWaitNext(true);
        return;
      }

      if (action === "=") {
        if (operator && firstVal !== null) {
          const cur = parseFloat(display.replace(/,/g, ""));
          const h = `${fmt(firstVal)} ${OP_SYMBOLS[operator]} ${fmt(cur)} =`;
          const res = compute(firstVal, cur, operator);
          triggerFlash();
          if (res === null) {
            setDisplay("Error");
            setIsError(true);
            setHistory(h);
            setFirstVal(null);
            setOperator(null);
            setActiveOp(null);
            setWaitNext(false);
            return;
          }
          setDisplay(fmt(res));
          setHistory(h);
          setFirstVal(null);
          setOperator(null);
          setActiveOp(null);
          setWaitNext(false);
        }
        return;
      }

      if (waitNext) {
        setDisplay(action === "." ? "0." : action);
        setWaitNext(false);
        setActiveOp(null);
      } else {
        if (action === ".") {
          if (!display.includes(".")) setDisplay(display + ".");
        } else if (action === "0") {
          if (display !== "0") setDisplay(display + "0");
        } else {
          setDisplay(display === "0" ? action : display + action);
        }
      }
    },
    [display, firstVal, operator, waitNext],
  );

  const rawLen = display.replace(/[,. -]/g, "").length;
  const numSize = rawLen > 11 ? 34 : rawLen > 8 ? 44 : rawLen > 5 ? 54 : 64;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at 30% 20%, #1a1030 0%, #0c0a14 60%, #080810 100%)",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* ── Phone shell ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 390,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(175deg, #13111f 0%, #0d0b18 50%, #0a0914 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ambient glow */}
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

        {/* ── Display area ── */}
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
          {/* backspace button — top right of display */}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 16,
            }}
          >
            <BackspaceButton onClick={handleBackspace} />
          </div>

          {/* operator badge — top left */}
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

          {/* history */}
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

          {/* main number */}
          <div
            style={{
              textAlign: "right",
              fontFamily: "'Space Mono', monospace",
              fontSize: numSize,
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

        {/* separator */}
        <div
          style={{
            margin: "0 20px",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(201,168,108,0.14), transparent)",
          }}
        />

        {/* ── Button grid ── */}
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
              onClick={() => handleInput(btn.action, btn.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
