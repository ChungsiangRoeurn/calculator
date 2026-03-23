import { useState, useCallback } from "react";
import { compute, fmt } from "./utils";
import { OP_SYMBOLS } from "./constants";

/**
 * Tracks pointer press state for button press-scale animations.
 */
export function usePress() {
  const [pressed, setPressed] = useState(false);
  return {
    pressed,
    handlers: {
      onPointerDown:  () => setPressed(true),
      onPointerUp:    () => setPressed(false),
      onPointerLeave: () => setPressed(false),
    },
  };
}

/**
 * Core calculator state machine.
 * Exposes display value, history, active operator, error/flash flags,
 * and handlers for button input and backspace.
 */
export function useCalculator() {
  const [display,  setDisplay]  = useState("0");
  const [firstVal, setFirstVal] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitNext, setWaitNext] = useState(false);
  const [history,  setHistory]  = useState("");
  const [activeOp, setActiveOp] = useState(null);
  const [isError,  setIsError]  = useState(false);
  const [flash,    setFlash]    = useState(false);

  const triggerFlash = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  };

  const handleBackspace = useCallback(() => {
    if (isError) { setDisplay("0"); setIsError(false); return; }
    if (waitNext) return;

    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      const next = display.slice(0, -1);
      setDisplay(next.endsWith(",") ? next.slice(0, -1) : next);
    }
  }, [display, isError, waitNext]);

  const handleInput = useCallback((action, type) => {
    setIsError(false);

    // ── Function keys (AC, +/−, %) ──────────────────────────────────────────
    if (type === "fn") {
      if (action === "clear") {
        setDisplay("0"); setFirstVal(null); setOperator(null);
        setWaitNext(false); setHistory(""); setActiveOp(null);
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

    // ── Operator keys (+, −, ×, ÷) ──────────────────────────────────────────
    if (type === "op") {
      const cur = parseFloat(display.replace(/,/g, ""));
      if (firstVal !== null && !waitNext && operator) {
        const res = compute(firstVal, cur, operator);
        if (res === null) { setDisplay("Error"); setIsError(true); return; }
        setDisplay(fmt(res));
        setHistory(`${fmt(res)} ${OP_SYMBOLS[action]}`);
        setFirstVal(res);
      } else {
        setFirstVal(cur);
        setHistory(`${fmt(cur)} ${OP_SYMBOLS[action]}`);
      }
      setOperator(action); setActiveOp(action); setWaitNext(true);
      return;
    }

    // ── Equals ───────────────────────────────────────────────────────────────
    if (action === "=") {
      if (operator && firstVal !== null) {
        const cur = parseFloat(display.replace(/,/g, ""));
        const h   = `${fmt(firstVal)} ${OP_SYMBOLS[operator]} ${fmt(cur)} =`;
        const res = compute(firstVal, cur, operator);
        triggerFlash();
        if (res === null) {
          setDisplay("Error"); setIsError(true); setHistory(h);
          setFirstVal(null); setOperator(null); setActiveOp(null); setWaitNext(false);
          return;
        }
        setDisplay(fmt(res)); setHistory(h);
        setFirstVal(null); setOperator(null); setActiveOp(null); setWaitNext(false);
      }
      return;
    }

    // ── Digit / decimal input ────────────────────────────────────────────────
    if (waitNext) {
      setDisplay(action === "." ? "0." : action);
      setWaitNext(false); setActiveOp(null);
    } else {
      if (action === ".") {
        if (!display.includes(".")) setDisplay(display + ".");
      } else if (action === "0") {
        if (display !== "0") setDisplay(display + "0");
      } else {
        setDisplay(display === "0" ? action : display + action);
      }
    }
  }, [display, firstVal, operator, waitNext]);

  return { display, history, operator, activeOp, isError, flash, handleInput, handleBackspace };
}