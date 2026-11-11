"use client";
import { fmt } from "../lib/utils";

export default function AlertBanner({ alert, onDismiss }) {
  return (
    <div className="card alert">
      <div className="alert-head">
        <strong>{alert.title}</strong>
        <button className="link" onClick={() => onDismiss(alert.id)}>
          Dismiss
        </button>
      </div>
      <p className="big">{fmt(alert.summary.total)}</p>
      <ul className="breakdown">
        {alert.summary.items.map((i) => (
          <li key={i.id}>
            <span>
              {i.emoji} {i.label}
            </span>
            <b>{fmt(i.amount)}</b>
            {i.notes.length > 0 && <em>{i.notes.slice(0, 3).join(", ")}</em>}
          </li>
        ))}
      </ul>
    </div>
  );
}
