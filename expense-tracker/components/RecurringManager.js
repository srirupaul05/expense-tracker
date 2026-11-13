"use client";
import { useState } from "react";
import { CATEGORIES, catOf, fmt, parseDate, todayStr } from "../lib/utils";

function describe(r) {
  const d = parseDate(r.start);
  if (r.freq === "weekly") {
    return `Every ${d.toLocaleDateString("en-IN", { weekday: "long" })}`;
  }
  return `Every month on day ${d.getDate()}`;
}

export default function RecurringManager({ recurring, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("bills");
  const [note, setNote] = useState("");
  const [freq, setFreq] = useState("monthly");
  const [start, setStart] = useState(todayStr());

  function submit(e) {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount: a,
      category,
      note: note.trim(),
      freq,
      start,
    });
    setAmount("");
    setNote("");
    setStart(todayStr());
    setOpen(false);
  }

  return (
    <div className="card">
      <h2>🔁 Recurring expenses</h2>
      <p className="hint">
        Rent, subscriptions and other regular payments are added for you
        automatically.
      </p>

      {recurring.length === 0 && !open && (
        <p className="muted">No recurring expenses yet.</p>
      )}

      {recurring.map((r) => (
        <div className="row" key={r.id}>
          <span className="emoji">{catOf(r.category).emoji}</span>
          <div className="grow">
            <div>{r.note || catOf(r.category).label}</div>
            <small className="muted">{describe(r)}</small>
          </div>
          <b className="neg">{fmt(r.amount)}</b>
          <button
            className="del"
            aria-label="Delete"
            onClick={() => onDelete(r.id)}
          >
            ✕
          </button>
        </div>
      ))}

      {!open && (
        <div style={{ marginTop: 12 }}>
          <button className="ghost" onClick={() => setOpen(true)}>
            + Add recurring expense
          </button>
        </div>
      )}

      {open && (
        <form onSubmit={submit} style={{ marginTop: 12 }}>
          <div className="amount-row">
            <span>₹</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="chips">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c.id}
                className={"chip" + (category === c.id ? " active" : "")}
                onClick={() => setCategory(c.id)}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>

          <input
            className="text"
            placeholder="Reason (e.g. room rent, Netflix)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={80}
          />

          <div className="tabs">
            <button
              type="button"
              className={freq === "monthly" ? "active" : ""}
              onClick={() => setFreq("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={freq === "weekly" ? "active" : ""}
              onClick={() => setFreq("weekly")}
            >
              Weekly
            </button>
          </div>

          <p className="hint">
            Starts on (the first entry is added on this date):
          </p>
          <input
            className="text"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />

          <button className="primary" type="submit">
            Save recurring expense
          </button>
          <button
            type="button"
            className="link"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
