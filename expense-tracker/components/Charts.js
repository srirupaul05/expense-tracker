"use client";
import { fmt } from "../lib/utils";

export function DonutChart({ items, total }) {
  const R = 42;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <svg
      viewBox="0 0 120 120"
      className="donut"
      role="img"
      aria-label="Spending by category"
    >
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="rgba(244,167,190,0.25)"
        strokeWidth="16"
      />
      {items.map((i) => {
        const len = (i.amount / total) * C;
        const el = (
          <circle
            key={i.id}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={i.color}
            strokeWidth="16"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
          />
        );
        offset += len;
        return el;
      })}
      <text x="60" y="57" textAnchor="middle" className="donut-label">
        Spent
      </text>
      <text x="60" y="71" textAnchor="middle" className="donut-total">
        {fmt(total)}
      </text>
    </svg>
  );
}

export function Legend({ items }) {
  return (
    <ul className="legend">
      {items.map((i) => (
        <li key={i.id}>
          <span className="dot" style={{ background: i.color }} />
          <span className="name">{i.label}</span>
          <b>{fmt(i.amount)}</b>
          {i.notes.length > 0 && <em>{i.notes.slice(0, 4).join(", ")}</em>}
        </li>
      ))}
    </ul>
  );
}

export function TrendChart({ series, mode }) {
  const max = Math.max(...series.map((s) => s.amount), 1);
  const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="trend">
      {series.map((s, idx) => {
        const label =
          mode === "week"
            ? weekLabels[idx]
            : idx === 0 || (idx + 1) % 5 === 0
              ? String(idx + 1)
              : "";
        const pct = Math.max((s.amount / max) * 100, 4);
        return (
          <div
            className="trend-col"
            key={idx}
            title={`${s.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}: ${fmt(s.amount)}`}
          >
            <div className="trend-bar-wrap">
              <div
                className={"trend-bar" + (s.amount ? "" : " zero")}
                style={{ height: s.amount ? `${pct}%` : "2px" }}
              />
            </div>
            <span className="trend-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
