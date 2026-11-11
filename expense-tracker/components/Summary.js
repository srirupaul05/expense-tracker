"use client";
import { useState } from "react";
import { addDays, fmt, inRange, summarize, weekStart } from "../lib/utils";

export default function Summary({ expenses }) {
  const [tab, setTab] = useState("week");
  const now = new Date();

  let start, end, label;
  if (tab === "week") {
    start = weekStart(now);
    end = addDays(start, 7);
    label = "This week (Mon–Sun)";
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    label = now.toLocaleString("en-IN", { month: "long", year: "numeric" });
  }

  const s = summarize(expenses.filter((e) => inRange(e, start, end)));
  const max = s.items[0]?.amount || 1;

  return (
    <div className="card">
      <div className="tabs">
        <button
          className={tab === "week" ? "active" : ""}
          onClick={() => setTab("week")}
        >
          Week
        </button>
        <button
          className={tab === "month" ? "active" : ""}
          onClick={() => setTab("month")}
        >
          Month
        </button>
      </div>
      <p className="muted">{label}</p>
      <p className="big">{fmt(s.total)}</p>
      <p className="muted">
        {s.count} expense{s.count === 1 ? "" : "s"}
      </p>

      {s.items.length === 0 && <p className="muted">Nothing spent yet. 🎉</p>}
      {s.items.map((i) => (
        <div className="bar-row" key={i.id}>
          <div className="bar-top">
            <span>
              {i.emoji} {i.label}
            </span>
            <b>{fmt(i.amount)}</b>
          </div>
          <div className="bar">
            <div style={{ width: `${(i.amount / max) * 100}%` }} />
          </div>
          {i.notes.length > 0 && (
            <small className="muted">{i.notes.slice(0, 4).join(" · ")}</small>
          )}
        </div>
      ))}
    </div>
  );
}
