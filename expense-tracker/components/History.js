"use client";
import { catOf, fmt, parseDate } from "../lib/utils";

export default function History({ expenses, onDelete }) {
  const sorted = [...expenses]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 100);
  const groups = {};
  for (const e of sorted) (groups[e.date] ||= []).push(e);

  return (
    <div className="card">
      <h2>History</h2>
      {sorted.length === 0 && (
        <p className="muted">No expenses yet. Add your first one above.</p>
      )}
      {Object.entries(groups).map(([date, list]) => (
        <div key={date}>
          <p className="date-head">
            {parseDate(date).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
          {list.map((e) => (
            <div className="row" key={e.id}>
              <span className="emoji">{catOf(e.category).emoji}</span>
              <div className="grow">
                <div>{e.note || catOf(e.category).label}</div>
                <small className="muted">{catOf(e.category).label}</small>
              </div>
              <b>{fmt(e.amount)}</b>
              <button
                className="del"
                aria-label="Delete"
                onClick={() => onDelete(e.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
