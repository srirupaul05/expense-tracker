"use client";
import { useEffect, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import Summary from "../components/Summary";
import History from "../components/History";
import AlertBanner from "../components/AlertBanner";
import { loadData, saveData } from "../lib/storage";
import { buildAlerts, notify } from "../lib/utils";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [meta, setMeta] = useState({ dismissed: [], notified: [] });
  const [ready, setReady] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [perm, setPerm] = useState("granted");

  // Load saved data
  useEffect(() => {
    const d = loadData();
    setExpenses(d.expenses);
    setMeta(d.meta);
    setReady(true);
    if (typeof Notification !== "undefined") setPerm(Notification.permission);
  }, []);

  // Save on every change
  useEffect(() => {
    if (ready) saveData({ expenses, meta });
  }, [expenses, meta, ready]);

  // Build weekly/monthly alerts and send a phone notification once per alert
  useEffect(() => {
    if (!ready) return;
    const list = buildAlerts(expenses).filter(
      (a) => !meta.dismissed.includes(a.id),
    );
    setAlerts(list);
    const fresh = list.filter((a) => !meta.notified.includes(a.id));
    if (fresh.length) {
      fresh.forEach((a) => notify(a.title, a.body));
      setMeta((m) => ({
        ...m,
        notified: [...m.notified, ...fresh.map((a) => a.id)],
      }));
    }
  }, [ready, expenses, meta.dismissed]);

  const addExpense = (e) => setExpenses((list) => [e, ...list]);
  const deleteExpense = (id) =>
    setExpenses((list) => list.filter((e) => e.id !== id));
  const dismiss = (id) =>
    setMeta((m) => ({ ...m, dismissed: [...m.dismissed, id] }));

  async function enableNotifications() {
    const p = await Notification.requestPermission();
    setPerm(p);
  }

  if (!ready) return null;

  return (
    <main className="app">
      <h1 className="app-title">💸 Spendly</h1>

      {perm === "default" && (
        <div className="card">
          <p style={{ margin: "0 0 10px" }}>
            Get your weekly and monthly spending reports as phone notifications.
          </p>
          <button className="primary" onClick={enableNotifications}>
            Turn on notifications
          </button>
        </div>
      )}

      {alerts.map((a) => (
        <AlertBanner key={a.id} alert={a} onDismiss={dismiss} />
      ))}

      <ExpenseForm onAdd={addExpense} />
      <Summary expenses={expenses} />
      <History expenses={expenses} onDelete={deleteExpense} />
    </main>
  );
}
