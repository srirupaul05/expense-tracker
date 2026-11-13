export const CATEGORIES = [
  { id: "food", label: "Food", color: "#f08a7e" },
  { id: "travel", label: "Travel", color: "#f2b36d" },
  { id: "shopping", label: "Shopping", color: "#e0668b" },
  { id: "bills", label: "Bills", color: "#c9a24d" },
  { id: "fun", label: "Fun", color: "#b784c9" },
  { id: "study", label: "Study", color: "#7fa7d8" },
  { id: "health", label: "Health", color: "#7dbf9e" },
  { id: "other", label: "Other", color: "#b8a398" },
];

export const INCOME_TYPES = [
  { id: "pocket", label: "Pocket money" },
  { id: "salary", label: "Salary" },
  { id: "freelance", label: "Freelance" },
  { id: "scholarship", label: "Scholarship" },
  { id: "gift", label: "Gift" },
  { id: "other", label: "Other" },
];

export const catOf = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[7];
export const incomeOf = (id) =>
  INCOME_TYPES.find((c) => c.id === id) || INCOME_TYPES[5];

export const fmt = (n) => {
  const v = Number(n) || 0;
  return (
    (v < 0 ? "-" : "") +
    "₹" +
    Math.abs(v).toLocaleString("en-IN", { maximumFractionDigits: 2 })
  );
};

export function toDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const todayStr = () => toDateStr(new Date());

export function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d, n) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() + n);
  return x;
}

// Weeks run Monday to Sunday
export function weekStart(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

export function inRange(e, start, end) {
  const t = parseDate(e.date).getTime();
  return t >= start.getTime() && t < end.getTime();
}

export const sumAmount = (list) => list.reduce((s, e) => s + e.amount, 0);

// Total money you have: all income minus all expenses before `end`
export function balanceBefore(expenses, incomes, end) {
  const t = end.getTime();
  const inc = incomes.filter((e) => parseDate(e.date).getTime() < t);
  const exp = expenses.filter((e) => parseDate(e.date).getTime() < t);
  return sumAmount(inc) - sumAmount(exp);
}

export function summarize(list) {
  const map = {};
  let total = 0;
  for (const e of list) {
    total += e.amount;
    const c = catOf(e.category);
    if (!map[c.id]) map[c.id] = { ...c, amount: 0, notes: [] };
    map[c.id].amount += e.amount;
    if (e.note && !map[c.id].notes.includes(e.note))
      map[c.id].notes.push(e.note);
  }
  const items = Object.values(map).sort((a, b) => b.amount - a.amount);
  return { total, count: list.length, items };
}

// One bar per day, starting from `start`
export function dailySeries(expenses, start, days) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = addDays(start, i);
    const ds = toDateStr(d);
    const amount = expenses
      .filter((e) => e.date === ds)
      .reduce((s, e) => s + e.amount, 0);
    out.push({ date: d, amount });
  }
  return out;
}

function breakdownLine(s) {
  return s.items
    .slice(0, 3)
    .map((i) => `${i.label} ${fmt(i.amount)}`)
    .join(", ");
}

function periodAlert(
  id,
  title,
  intro,
  expenses,
  incomes,
  start,
  end,
  balanceEnd,
) {
  const ex = expenses.filter((e) => inRange(e, start, end));
  const inc = incomes.filter((e) => inRange(e, start, end));
  if (!ex.length && !inc.length) return null;
  const s = summarize(ex);
  const income = sumAmount(inc);
  const balance = balanceBefore(expenses, incomes, balanceEnd);
  const top = breakdownLine(s);
  return {
    id,
    title,
    body:
      `${intro}: earned ${fmt(income)}, spent ${fmt(s.total)}. Balance ${fmt(balance)}.` +
      (top ? ` Spent on: ${top}` : ""),
    income,
    balance,
    summary: s,
  };
}

export function buildAlerts(expenses, incomes, now = new Date()) {
  const alerts = [];
  const y = now.getFullYear();
  const m = now.getMonth();

  // Last week's report
  const ws = weekStart(now);
  const lastWs = addDays(ws, -7);
  const week = periodAlert(
    `week-${toDateStr(lastWs)}`,
    "📅 Your weekly report",
    "Last week",
    expenses,
    incomes,
    lastWs,
    ws,
    ws,
  );
  if (week) alerts.push(week);

  // Last month's report
  const ms = new Date(y, m, 1);
  const lastMs = new Date(y, m - 1, 1);
  const month = periodAlert(
    `month-${lastMs.getFullYear()}-${lastMs.getMonth() + 1}`,
    "🗓️ Your monthly report",
    "Last month",
    expenses,
    incomes,
    lastMs,
    ms,
    ms,
  );
  if (month) alerts.push(month);

  // Month-end check-in (last 2 days of the month)
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  if (now.getDate() >= daysInMonth - 1) {
    const me = new Date(y, m + 1, 1);
    const monthEnd = periodAlert(
      `monthend-${y}-${m + 1}`,
      "⏰ Month-end check-in",
      "This month",
      expenses,
      incomes,
      ms,
      me,
      addDays(now, 1),
    );
    if (monthEnd) alerts.push(monthEnd);
  }

  return alerts;
}

// Creates expenses for recurring rules that are due (rent, subscriptions...)
export function applyRecurring(data, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const done = new Set(data.meta.generated);
  const added = [];
  const newIds = [];

  for (const r of data.recurring) {
    const start = parseDate(r.start);
    const dates = [];

    if (r.freq === "weekly") {
      let d = start;
      let guard = 0;
      while (d <= today && guard++ < 400) {
        dates.push(d);
        d = addDays(d, 7);
      }
    } else {
      let y = start.getFullYear();
      let m = start.getMonth();
      let guard = 0;
      while (guard++ < 120) {
        const last = new Date(y, m + 1, 0).getDate();
        const d = new Date(y, m, Math.min(start.getDate(), last));
        if (d > today) break;
        if (d >= start) dates.push(d);
        m += 1;
        if (m > 11) {
          m = 0;
          y += 1;
        }
      }
    }

    for (const d of dates) {
      const ds = toDateStr(d);
      const id = `r-${r.id}-${ds}`;
      if (done.has(id)) continue;
      done.add(id);
      newIds.push(id);
      added.push({
        id,
        amount: r.amount,
        category: r.category,
        note: r.note,
        date: ds,
        auto: true,
      });
    }
  }

  if (!added.length) return data;
  return {
    ...data,
    expenses: [...added, ...data.expenses],
    meta: { ...data.meta, generated: [...data.meta.generated, ...newIds] },
  };
}

// Phone notification (works when the user has allowed notifications)
export async function notify(title, body) {
  if (
    typeof Notification === "undefined" ||
    Notification.permission !== "granted"
  )
    return;
  try {
    const reg = await navigator.serviceWorker?.ready;
    if (reg) {
      await reg.showNotification(title, {
        body,
        icon: "/icons/192",
        badge: "/icons/192",
      });
    } else {
      new Notification(title, { body });
    }
  } catch {}
}
