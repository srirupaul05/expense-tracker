"use client";
import { useState } from "react";
import { Icon } from "./Icons";
import { CATEGORIES, catOf, fmt, parseDate, todayStr } from "../lib/utils";

function describe(r) {
  const d = parseDate(r.start);
  if (r.freq === "weekly") {
    return `Every ${d.toLocaleDateString("en-IN", { weekday: "long" })}`;
  }
  return `Every month on day ${d.getDate()}`;
}

function RecurringSheet({ onAdd, onClose }) {
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
    onClose();
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <form
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className="sheet-head">
          <h3>New recurring expense</h3>
          <button
            type="button"
            className="iconbtn"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x" size={22} />
          </button>
        </div>

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

        <div className="cat-row">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c.id}
              className={"chip" + (category === c.id ? " active" : "")}
              onClick={() => setCategory(c.id)}
            >
              <Icon name={c.icon} size={16} />
              {c.label}
            </button>
          ))}
        </div>

        <input
          className="text"
          placeholder="Reason (e.g. room rent, streaming plan)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={80}
        />

        <div className="seg">
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
          Starts on this date. The first entry is added on it.
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
      </form>
    </div>
  );
}

export default function RecurringManager({ recurring, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="glass card">
      <div className="section-head">
        <h3>Recurring expenses</h3>
      </div>
      <p className="hint">
        Rent, subscriptions and other regular payments are added for you
        automatically.
      </p>

      {recurring.map((r) => {
        const c = catOf(r.category);
        return (
          <div className="row" key={r.id}>
            <span
              className="avatar"
              style={{ background: c.color + "26", color: c.color }}
            >
              <Icon name="repeat" size={18} />
            </span>
            <div className="grow">
              <div className="row-title">{r.note || c.label}</div>
              <small className="muted">{describe(r)}</small>
            </div>
            <b className="neg">{fmt(r.amount)}</b>
            <button
              className="iconbtn"
              aria-label="Delete"
              onClick={() => onDelete(r.id)}
            >
              <Icon name="trash" size={18} />
            </button>
          </div>
        );
      })}

      <div style={{ marginTop: recurring.length ? 12 : 4 }}>
        <button className="ghost" onClick={() => setOpen(true)}>
          Add recurring expense
        </button>
      </div>

      {open && <RecurringSheet onAdd={onAdd} onClose={() => setOpen(false)} />}
    </section>
  );
}
