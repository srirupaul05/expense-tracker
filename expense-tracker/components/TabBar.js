"use client";
import { Icon } from "./Icons";

const TABS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "reports", label: "Reports", icon: "chart" },
  { id: "history", label: "History", icon: "list" },
  { id: "more", label: "More", icon: "sliders" },
];

export default function TabBar({ tab, onTab, onAdd }) {
  const item = (t) => (
    <button
      key={t.id}
      className={"tab" + (tab === t.id ? " active" : "")}
      onClick={() => onTab(t.id)}
    >
      <Icon name={t.icon} size={22} />
      <span>{t.label}</span>
    </button>
  );

  return (
    <nav className="tabbar glass">
      {TABS.slice(0, 2).map(item)}
      <button
        className="fab"
        aria-label="Add expense or income"
        onClick={onAdd}
      >
        <Icon name="plus" size={26} />
      </button>
      {TABS.slice(2).map(item)}
    </nav>
  );
}
