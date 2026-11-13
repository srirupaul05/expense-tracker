"use client";
import { useState } from "react";
import { CATEGORIES, INCOME_TYPES, todayStr } from "../lib/utils";
import { Icon } from "./Icons";

export default function AddSheet({
  prefs,
  onAddExpense,
  onAddIncome,
  onClose,
}) {
  const [mode, setMode] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(prefs?.lastCategory || "food");
  const [incomeType, setIncomeType] = useState(
    prefs?.lastIncomeType || "pocket",
  );
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayStr());

  const options = mode === "expense" ? CATEGORIES : INCOME_TYPES;
  const selected = mode === "expense" ? category : incomeType;
  const select = (id) =>
    mode === "expense" ? setCategory(id) : setIncomeType(id);

  function submit(e) {
    e.preventDefault();
    const a = parseFloat(amount);
    if (!a || a <= 0) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    if (mode === "expense") {
      onAddExpense({ id, amount: a, category, note: note.trim(), date });
    } else {
      onAddIncome({ id, amount: a, type: incomeType, note: note.trim(), date });
    }
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
          <h3>New entry</h3>
          <button
            type="button"
            className="iconbtn"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <div className="seg">
          <button
            type="button"
            className={mode === "expense" ? "active" : ""}
            onClick={() => setMode("expense")}
          >
            Expense
          </button>
          <button
            type="button"
            className={mode === "income" ? "active" : ""}
            onClick={() => setMode("income")}
          >
            Income
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
            autoFocus
            required
          />
        </div>

        <div className="cat-row">
          {options.map((c) => (
            <button
              type="button"
              key={c.id}
              className={"chip" + (selected === c.id ? " active" : "")}
              onClick={() => select(c.id)}
            >
              <Icon name={c.icon} size={16} />
              {c.label}
            </button>
          ))}
        </div>

        <input
          className="text"
          placeholder={
            mode === "expense"
              ? "Reason (e.g. lunch with friends)"
              : "Source (e.g. birthday gift)"
          }
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
          {mode === "expense" ? "Add expense" : "Add income"}
        </button>
      </form>
    </div>
  );
}
