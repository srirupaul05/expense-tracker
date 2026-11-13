"use client";
import { Icon } from "./Icons";
import { catOf, fmt, incomeOf, parseDate } from "../lib/utils";

// Expenses and income in one list, newest date first
export function mergeTx(expenses, incomes) {
  return [
    ...expenses.map((e) => ({ ...e, kind: "expense" })),
    ...incomes.map((i) => ({ ...i, kind: "income" })),
  ].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function TxRow({ item, onDelete, showDate }) {
  const income = item.kind === "income";
  const meta = income ? incomeOf(item.type) : catOf(item.category);
  const color = income ? "#4f9a78" : meta.color;
  const dateText = parseDate(item.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="row">
      <span className="avatar" style={{ background: color + "26", color }}>
        <Icon name={meta.icon} size={18} />
      </span>
      <div className="grow">
        <div className="row-title">{item.note || meta.label}</div>
        <small className="muted">
          {meta.label}
          {item.auto ? " · Recurring" : ""}
          {showDate ? ` · ${dateText}` : ""}
        </small>
      </div>
      <b className={income ? "pos" : "neg"}>
        {income ? "+" : "−"}
        {fmt(item.amount)}
      </b>
      {onDelete && (
        <button
          className="iconbtn"
          aria-label="Delete"
          onClick={() => onDelete(item.id)}
        >
          <Icon name="trash" size={18} />
        </button>
      )}
    </div>
  );
}

export default function History({
  expenses,
  incomes,
  onDeleteExpense,
  onDeleteIncome,
}) {
  const all = mergeTx(expenses, incomes).slice(0, 100);
  const groups = {};
  for (const e of all) (groups[e.date] ||= []).push(e);

  return (
    <div className="view">
      <h2 className="view-title">History</h2>
      <section className="glass card">
        {all.length === 0 && (
          <p className="muted">
            Nothing yet. Tap the + button to add your first entry.
          </p>
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
            {list.map((item) => (
              <TxRow
                key={`${item.kind}-${item.id}`}
                item={item}
                onDelete={
                  item.kind === "income" ? onDeleteIncome : onDeleteExpense
                }
              />
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
