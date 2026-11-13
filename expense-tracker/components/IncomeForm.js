"use client";
import { useState } from "react";
import { INCOME_TYPES, todayStr } from "../lib/utils";

export default function IncomeForm({ onAdd }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("pocket");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());

  function submit(e) {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    onAdd({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount: a,
      type,
      note: note.trim(),
      date,
    });
    setAmount("");
    setNote("");
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Add income</h2>
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
        {INCOME_TYPES.map((c) => (
          <button
            type="button"
            key={c.id}
            className={"chip" + (type === c.id ? " active" : "")}
            onClick={() => setType(c.id)}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <input
        className="text"
        placeholder="Source / reason (e.g. birthday gift)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        maxLength={80}
      />
      <input
        className="text"
        type="date"
        value={date}
        max={todayStr()}
        onChange={(e) => setDate(e.target.value)}
      />
      <button className="primary" type="submit">
        Add income
      </button>
    </form>
  );
}
