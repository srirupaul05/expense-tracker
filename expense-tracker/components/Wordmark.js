"use client";
import { useEffect, useState } from "react";

const TEXT = "ꜱᴘᴇɴᴅʟʏ";

export default function Wordmark() {
  const [ok, setOk] = useState(true);

  // If the phone can't draw the small-cap characters, fall back to styled normal text
  useEffect(() => {
    try {
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.font = "32px sans-serif";
      const missing = ctx.measureText("\u{10FFFD}").width;
      const supported = Array.from(TEXT).every(
        (ch) => ctx.measureText(ch).width !== missing,
      );
      setOk(supported);
    } catch {}
  }, []);

  return ok ? (
    <span className="wordmark" aria-label="Spendly">
      {TEXT}
    </span>
  ) : (
    <span className="wordmark fallback">Spendly</span>
  );
}
