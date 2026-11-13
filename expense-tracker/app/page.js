"use client";
import { useEffect, useState } from "react";
import Wordmark from "../components/Wordmark";
import TabBar from "../components/TabBar";
import AddSheet from "../components/AddSheet";
import HomeView from "../components/HomeView";
import Summary from "../components/Summary";
import History from "../components/History";
import MoreView from "../components/MoreView";
import { loadData, saveData } from "../lib/storage";
import { applyRecurring, buildAlerts, notify } from "../lib/utils";

export default function App() {
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [perm, setPerm] = useState("default");
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState(null);

  // Load saved data and create any recurring expenses that are due
  useEffect(() => {
    setData(applyRecurring(loadData()));
    setPerm(
      typeof Notification === "undefined"
        ? "unsupported"
        : Notification.permission,
    );
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

  // Hide the toast after a few seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const commit = (fn) => setData((d) => applyRecurring(fn(d)));

  const addExpense = (e) => {
    commit((d) => ({
      ...d,
      expenses: [e, ...d.expenses],
      prefs: { ...d.prefs, lastCategory: e.category },
    }));
    setToast({
      message: "Expense added",
      undo: () =>
        commit((d) => ({
          ...d,
          expenses: d.expenses.filter((x) => x.id !== e.id),
        })),
    });
  };

  const addIncome = (i) => {
    commit((d) => ({
      ...d,
      incomes: [i, ...d.incomes],
      prefs: { ...d.prefs, lastIncomeType: i.type },
    }));
    setToast({
      message: "Income added",
      undo: () =>
        commit((d) => ({
          ...d,
          incomes: d.incomes.filter((x) => x.id !== i.id),
        })),
    });
  };

  const deleteExpense = (id) => {
    const item = data.expenses.find((e) => e.id === id);
    if (!item) return;
    commit((d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }));
    setToast({
      message: "Expense deleted",
      undo: () => commit((d) => ({ ...d, expenses: [item, ...d.expenses] })),
    });
  };

  const deleteIncome = (id) => {
    const item = data.incomes.find((i) => i.id === id);
    if (!item) return;
    commit((d) => ({ ...d, incomes: d.incomes.filter((i) => i.id !== id) }));
    setToast({
      message: "Income deleted",
      undo: () => commit((d) => ({ ...d, incomes: [item, ...d.incomes] })),
    });
  };

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

  return (
    <div className="shell">
      <div className="bg">
        <i className="blob b1" />
        <i className="blob b2" />
        <i className="blob b3" />
      </div>

      <header className="topbar">
        <Wordmark />
      </header>

      <main className="content">
        {tab === "home" && (
          <HomeView
            expenses={data.expenses}
            incomes={data.incomes}
            alert={alerts[0]}
            alertCount={alerts.length}
            onDismiss={dismiss}
            onSeeAll={() => setTab("history")}
          />
        )}
        {tab === "reports" && (
          <Summary expenses={data.expenses} incomes={data.incomes} />
        )}
        {tab === "history" && (
          <History
            expenses={data.expenses}
            incomes={data.incomes}
            onDeleteExpense={deleteExpense}
            onDeleteIncome={deleteIncome}
          />
        )}
        {tab === "more" && (
          <MoreView
            perm={perm}
            onEnable={enableNotifications}
            recurring={data.recurring}
            onAddRecurring={addRecurring}
            onDeleteRecurring={deleteRecurring}
          />
        )}
      </main>

      <TabBar tab={tab} onTab={setTab} onAdd={() => setSheet(true)} />

      {sheet && (
        <AddSheet
          prefs={data.prefs}
          onAddExpense={addExpense}
          onAddIncome={addIncome}
          onClose={() => setSheet(false)}
        />
      )}

      {toast && (
        <div className="toast glass">
          <span>{toast.message}</span>
          {toast.undo && (
            <button
              className="link"
              onClick={() => {
                toast.undo();
                setToast(null);
              }}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
