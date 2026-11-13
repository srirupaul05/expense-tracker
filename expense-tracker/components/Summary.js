"use client";
import { useState } from "react";
import { DonutChart, Legend, TrendChart } from "./Charts";
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
    label = "This week, Monday to Sunday";
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
    <div className="view">
      <h2 className="view-title">Reports</h2>

      <div className="seg">
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
      <p className="muted small period">{label}</p>

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
        <section className="glass card">
          <p className="muted">No spending in this period yet.</p>
        </section>
      ) : (
        <>
          <section className="glass card">
            <p className="card-title">Where it went</p>
            <div className="report-row">
              <DonutChart items={s.items} total={s.total} />
              <Legend items={s.items} />
            </div>
          </section>
          <section className="glass card">
            <p className="card-title">Daily spending</p>
            <TrendChart series={series} mode={tab} />
          </section>
        </>
      )}
    </div>
  );
}
