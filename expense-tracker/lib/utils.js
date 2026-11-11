export const CATEGORIES = [
  { id: "food", label: "Food" },
  { id: "travel", label: "Travel" },
  { id: "shopping", label: "Shopping" },
  { id: "bills", label: "Bills" },
  { id: "fun", label: "Fun" },
  { id: "study", label: "Study" },
  { id: "health", label: "Health" },
  { id: "other", label: "Other" },
];

export const catOf = (id) =>
  CATEGORIES.find((c) => c.id === id) || CATEGORIES[7];

export const fmt = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 });

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

function breakdownLine(s) {
  return s.items
    .slice(0, 3)
    .map((i) => `${i.label} ${fmt(i.amount)}`)
    .join(", ");
}

export function buildAlerts(expenses, now = new Date()) {
  const alerts = [];
  const y = now.getFullYear();
  const m = now.getMonth();

  // Last week's report
  const ws = weekStart(now);
  const lastWs = addDays(ws, -7);
  const lastWeek = expenses.filter((e) => inRange(e, lastWs, ws));
  if (lastWeek.length) {
    const s = summarize(lastWeek);
    alerts.push({
      id: `week-${toDateStr(lastWs)}`,
      title: "📅 Your weekly spending report",
      body: `Last week you spent ${fmt(s.total)}. ${breakdownLine(s)}`,
      summary: s,
    });
  }

  // Last month's report
  const ms = new Date(y, m, 1);
  const lastMs = new Date(y, m - 1, 1);
  const lastMonth = expenses.filter((e) => inRange(e, lastMs, ms));
  if (lastMonth.length) {
    const s = summarize(lastMonth);
    alerts.push({
      id: `month-${lastMs.getFullYear()}-${lastMs.getMonth() + 1}`,
      title: "🗓️ Your monthly spending report",
      body: `Last month you spent ${fmt(s.total)}. ${breakdownLine(s)}`,
      summary: s,
    });
  }

  // Month-end check-in (last 2 days of the month)
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  if (now.getDate() >= daysInMonth - 1) {
    const me = new Date(y, m + 1, 1);
    const thisMonth = expenses.filter((e) => inRange(e, ms, me));
    if (thisMonth.length) {
      const s = summarize(thisMonth);
      alerts.push({
        id: `monthend-${y}-${m + 1}`,
        title: "⏰ Month-end check-in",
        body: `You've spent ${fmt(s.total)} this month. ${breakdownLine(s)}`,
        summary: s,
      });
    }
  }

  return alerts;
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
