"use client";
import { catOf, fmt, incomeOf, parseDate } from "../lib/utils";

export default function History({
  expenses,
  incomes,
  onDeleteExpense,
  onDeleteIncome,
}) {
  const all = [
    ...expenses.map((e) => ({ ...e, kind: "expense" })),
    ...incomes.map((i) => ({ ...i, kind: "income" })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, 100);

  const groups = {};
  for (const e of all) (groups[e.date] ||= []).push(e);

  return (
    <div className="card">
      <h2>History</h2>
      {all.length === 0 && (
        <p className="muted">
          Nothing yet. Add your first expense or income above.
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
          {list.map((e) => {
            const isIncome = e.kind === "income";
            const meta = isIncome ? incomeOf(e.type) : catOf(e.category);
            return (
              <div className="row" key={`${e.kind}-${e.id}`}>
                <span className="emoji">{meta.emoji}</span>
                <div className="grow">
                  <div>{e.note || meta.label}</div>
                  <small className="muted">
                    {meta.label}
                    {e.auto ? " · 🔁 recurring" : ""}
                  </small>
                </div>
                <b className={isIncome ? "pos" : "neg"}>
                  {isIncome ? "+" : "−"}
                  {fmt(e.amount)}
                </b>
                <button
                  className="del"
                  aria-label="Delete"
                  onClick={() =>
                    isIncome ? onDeleteIncome(e.id) : onDeleteExpense(e.id)
                  }
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
