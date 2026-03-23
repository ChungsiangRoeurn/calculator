/**
 * Performs arithmetic between two numbers.
 * Returns null on division by zero.
 */
export function compute(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? null : a / b;
    default:  return b;
  }
}

/**
 * Formats a number for display — adds thousands commas,
 * preserves decimals, handles scientific notation and errors.
 */
export function fmt(n) {
  if (n === null || isNaN(n) || !isFinite(n)) return "Error";

  const s = parseFloat(n.toPrecision(12)).toString();
  if (s.includes("e")) return s;

  const [int, dec] = s.split(".");
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec !== undefined ? `${intFmt}.${dec}` : intFmt;
}

/**
 * Returns the responsive font size for the display number
 * based on how many raw digits are currently shown.
 */
export function getDisplayFontSize(display) {
  const rawLen = display.replace(/[,. -]/g, "").length;
  if (rawLen > 11) return 34;
  if (rawLen > 8)  return 44;
  if (rawLen > 5)  return 54;
  return 64;
}