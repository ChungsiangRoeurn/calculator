import { useState, useEffect } from "react";

/**
 * Reads the real viewport height from Telegram WebApp API (if available),
 * falls back to window.innerHeight on regular browsers.
 *
 * Also derives a responsive button height that fills the available grid space
 * regardless of whether the app is running in Telegram Desktop, Mobile, or browser.
 *
 * Usage:
 *   const { vh, btnHeight } = useTelegramViewport();
 */
export function useTelegramViewport() {
  const getVh = () =>
    window.Telegram?.WebApp?.viewportStableHeight || window.innerHeight;

  const [vh, setVh] = useState(getVh);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Tell Telegram to expand to full available height
      tg.ready();
      tg.expand();

      const onViewportChanged = () =>
        setVh(tg.viewportStableHeight || window.innerHeight);

      tg.onEvent("viewportChanged", onViewportChanged);
      return () => tg.offEvent("viewportChanged", onViewportChanged);
    }

    // Fallback for plain browser
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Derive button height ────────────────────────────────────────────────────
  // Layout breakdown:
  //   display area  ≈ 28% of viewport (min 150px)
  //   separator     = 1px
  //   grid padding  = top 20 + bottom 48 = 68px
  //   row gaps      = 4 gaps × 14px     = 56px
  //   rows          = 5
  const displayHeight = Math.max(150, vh * 0.28);
  const gridPadding   = 68;
  const rowGaps       = 4 * 14;
  const availableForRows = vh - displayHeight - 1 - gridPadding - rowGaps;
  const btnHeight = Math.max(44, Math.min(72, availableForRows / 5));

  return { vh, btnHeight };
}