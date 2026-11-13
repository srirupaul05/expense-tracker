"use client";
import { fmt } from "../lib/utils";

export default function AlertBanner({ alert, count = 1, onDismiss }) {
  return (
    <div className="glass card alert">
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
          <b className="neg">{fmt(alert.summary.total)}</b>
        </div>
        <div>
          <small>Balance</small>
          <b>{fmt(alert.balance)}</b>
        </div>
      </div>

      {alert.top && <p className="muted small">Spent on: {alert.top}</p>}
      {count > 1 && (
        <p className="muted small" style={{ marginTop: 4 }}>
          {count - 1} more {count - 1 === 1 ? "report" : "reports"} waiting
        </p>
      )}
    </div>
  );
}
