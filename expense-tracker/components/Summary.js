"use client";
import { useState } from "react";
import { DonutChart, TrendChart } from "./Charts";
import {
  addDays,
  dailySeries,
  fmt,
  inRange,
  summarize,
  sumAmount,
  weekStart,
} from "../lib/utils";

export default function Summary({ expenses, incomes }) {
  const [tab, setTab] = useState("week");
  const now = new Date();

  let start, end, label, days;
  if (tab === "week") {
    start = weekStart(now);
    end = addDays(start, 7);
    days = 7;
    label = "This week (Mon–Sun)";
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    label = now.toLocaleString("en-IN", { month: "long", year: "numeric" });
  }

  const ex = expenses.filter((e) => inRange(e, start, end));
  const inc = incomes.filter((e) => inRange(e, start, end));
  const s = summarize(ex);
  const income = sumAmount(inc);
  const net = income - s.total;
  const series = dailySeries(ex, start, days);

  return (
    <div className="card">
      <div className="tabs">
        <button
          className={tab === "week" ? "active" : ""}
          onClick={() => setTab("week")}
        >
          Week
        </button>
        <button
          className={tab === "month" ? "active" : ""}
          onClick={() => setTab("month")}
        >
          Month
        </button>
      </div>
      <p className="muted">{label}</p>

      <div className="stats">
        <div>
          <small>Earned</small>
          <b className="pos">{fmt(income)}</b>
        </div>
        <div>
          <small>Spent</small>
          <b className="neg">{fmt(s.total)}</b>
        </div>
        <div>
          <small>{net >= 0 ? "Saved" : "Overspent"}</small>
          <b>{fmt(Math.abs(net))}</b>
        </div>
      </div>

      {s.total === 0 ? (
        <p className="muted" style={{ marginTop: 14 }}>
          No spending yet. 🎉
        </p>
      ) : (
        <>
          <p className="section-title">Where it went</p>
          <DonutChart items={s.items} total={s.total} />
          <p className="section-title">Daily spending</p>
          <TrendChart series={series} mode={tab} />
        </>
      )}
    </div>
  );
}
