"use client";
import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import RecurringManager from "../components/RecurringManager";
import Summary from "../components/Summary";
import History from "../components/History";
import AlertBanner from "../components/AlertBanner";
import { loadData, saveData } from "../lib/storage";
import {
  addDays,
  applyRecurring,
  balanceBefore,
  buildAlerts,
  fmt,
  inRange,
  notify,
  sumAmount,
} from "../lib/utils";

export default function Home() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [perm, setPerm] = useState("granted");
  const [addTab, setAddTab] = useState("expense");

  // Load saved data and create any recurring expenses that are due
  useEffect(() => {
    setData(applyRecurring(loadData()));
    if (typeof Notification !== "undefined") setPerm(Notification.permission);
  }, []);

  // Save on every change
  useEffect(() => {
    if (data) saveData(data);
  }, [data]);

  // Build weekly/monthly alerts and send a phone notification once per alert
  useEffect(() => {
    if (!data) return;
    const list = buildAlerts(data.expenses, data.incomes).filter(
      (a) => !data.meta.dismissed.includes(a.id),
    );
    setAlerts(list);
    const fresh = list.filter((a) => !data.meta.notified.includes(a.id));
    if (fresh.length) {
      fresh.forEach((a) => notify(a.title, a.body));
      setData((d) => ({
        ...d,
        meta: {
          ...d.meta,
          notified: [...d.meta.notified, ...fresh.map((a) => a.id)],
        },
      }));
    }
  }, [data?.expenses, data?.incomes, data?.meta.dismissed]);

  const commit = (fn) => setData((d) => applyRecurring(fn(d)));

  const addExpense = (e) =>
    commit((d) => ({ ...d, expenses: [e, ...d.expenses] }));
  const deleteExpense = (id) =>
    commit((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));

  const addIncome = (i) =>
    commit((d) => ({ ...d, incomes: [i, ...d.incomes] }));
  const deleteIncome = (id) =>
    commit((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }));

  const addRecurring = (r) =>
    commit((d) => ({ ...d, recurring: [r, ...d.recurring] }));
  const deleteRecurring = (id) =>
    commit((d) => ({
      ...d,
      recurring: d.recurring.filter((r) => r.id !== id),
    }));

  const dismiss = (id) =>
    setData((d) => ({
      ...d,
      meta: { ...d.meta, dismissed: [...d.meta.dismissed, id] },
    }));

  async function enableNotifications() {
    const p = await Notification.requestPermission();
    setPerm(p);
  }

  if (!data) return null;

  const now = new Date();
  const balance = balanceBefore(data.expenses, data.incomes, addDays(now, 1));
  const ms = new Date(now.getFullYear(), now.getMonth(), 1);
  const me = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthIncome = sumAmount(data.incomes.filter((e) => inRange(e, ms, me)));
  const monthExpense = sumAmount(
    data.expenses.filter((e) => inRange(e, ms, me)),
  );
  const monthName = now.toLocaleString("en-IN", { month: "long" });

  return (
    <main className="app">
      <h1 className="app-title">💸 Spendly</h1>

      <div className="hero">
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
      </div>

      {perm === "default" && (
        <div className="card">
          <p style={{ margin: "0 0 10px" }}>
            Get your weekly and monthly reports as phone notifications.
          </p>
          <button className="primary" onClick={enableNotifications}>
            Turn on notifications
          </button>
        </div>
      )}

      {alerts.map((a) => (
        <AlertBanner key={a.id} alert={a} onDismiss={dismiss} />
      ))}

      <div className="tabs">
        <button
          className={addTab === "expense" ? "active" : ""}
          onClick={() => setAddTab("expense")}
        >
          − Expense
        </button>
        <button
          className={addTab === "income" ? "active" : ""}
          onClick={() => setAddTab("income")}
        >
          + Income
        </button>
      </div>
      {addTab === "expense" ? (
        <ExpenseForm onAdd={addExpense} />
      ) : (
        <IncomeForm onAdd={addIncome} />
      )}

      <Summary expenses={data.expenses} incomes={data.incomes} />
      <RecurringManager
        recurring={data.recurring}
        onAdd={addRecurring}
        onDelete={deleteRecurring}
      />
      <History
        expenses={data.expenses}
        incomes={data.incomes}
        onDeleteExpense={deleteExpense}
        onDeleteIncome={deleteIncome}
      />
    </main>
  );
}
