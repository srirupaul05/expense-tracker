"use client";
import AlertBanner from "./AlertBanner";
import { TxRow, mergeTx } from "./History";
import { addDays, balanceBefore, fmt, inRange, sumAmount } from "../lib/utils";

export default function HomeView({
  expenses,
  incomes,
  alert,
  alertCount,
  onDismiss,
  onSeeAll,
}) {
  const now = new Date();
  const balance = balanceBefore(expenses, incomes, addDays(now, 1));
  const ms = new Date(now.getFullYear(), now.getMonth(), 1);
  const me = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthIncome = sumAmount(incomes.filter((e) => inRange(e, ms, me)));
  const monthExpense = sumAmount(expenses.filter((e) => inRange(e, ms, me)));
  const monthName = now.toLocaleString("en-IN", { month: "long" });

  const all = mergeTx(expenses, incomes);
  const recent = all.slice(0, alert ? 3 : 5);

  return (
    <div className="view">
      <section className="hero">
        <p className="hero-label">Total balance</p>
        <p className="hero-amount">{fmt(balance)}</p>
        <div className="hero-row">
          <div>
            <small>Earned in {monthName}</small>
            <b>{fmt(monthIncome)}</b>
          </div>
          <div>
            <small>Spent in {monthName}</small>
            <b>{fmt(monthExpense)}</b>
          </div>
        </div>
      </section>

      {alert && (
        <AlertBanner alert={alert} count={alertCount} onDismiss={onDismiss} />
      )}

      <section className="glass card">
        <div className="section-head">
          <h3>Recent</h3>
          {all.length > recent.length && (
            <button className="link" onClick={onSeeAll}>
              See all
            </button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="muted" style={{ padding: "10px 0" }}>
            Nothing yet. Tap the + button to add your first entry.
          </p>
        ) : (
          recent.map((item) => (
            <TxRow key={`${item.kind}-${item.id}`} item={item} showDate />
          ))
        )}
      </section>
    </div>
  );
}
