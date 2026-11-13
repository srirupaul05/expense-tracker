"use client";
import { fmt } from "../lib/utils";

export default function AlertBanner({ alert, onDismiss }) {
  const s = alert.summary;
  return (
    <div className="card alert">
      <div className="alert-head">
        <strong>{alert.title}</strong>
        <button className="link" onClick={() => onDismiss(alert.id)}>
          Dismiss
        </button>
      </div>

      <div className="stats">
        <div>
          <small>Earned</small>
          <b className="pos">{fmt(alert.income)}</b>
        </div>
        <div>
          <small>Spent</small>
          <b className="neg">{fmt(s.total)}</b>
        </div>
        <div>
          <small>Balance</small>
          <b>{fmt(alert.balance)}</b>
        </div>
      </div>

      <ul className="breakdown">
        {s.items.map((i) => (
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
