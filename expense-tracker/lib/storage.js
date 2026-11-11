const KEY = "spendly:v1";

const empty = () => ({ expenses: [], meta: { dismissed: [], notified: [] } });

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        expenses: d.expenses || [],
        meta: {
          dismissed: d.meta?.dismissed || [],
          notified: d.meta?.notified || [],
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
