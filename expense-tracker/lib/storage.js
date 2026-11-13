const KEY = "spendly:v1";

const empty = () => ({
  expenses: [],
  incomes: [],
  recurring: [],
  meta: { dismissed: [], notified: [], generated: [] },
});

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        expenses: d.expenses || [],
        incomes: d.incomes || [],
        recurring: d.recurring || [],
        meta: {
          dismissed: d.meta?.dismissed || [],
          notified: d.meta?.notified || [],
          generated: d.meta?.generated || [],
        },
      };
    }
  } catch {}
  return empty();
}

export function saveData(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}
