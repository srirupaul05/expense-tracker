"use client";
import RecurringManager from "./RecurringManager";
import { Icon } from "./Icons";

const STATUS = {
  granted: "On. Reports arrive when you open the app.",
  denied: "Blocked. Allow notifications for this app in your phone settings.",
  default: "Get your weekly and monthly reports as notifications.",
  unsupported:
    "Not available here. On iPhone, add the app to your Home Screen first.",
};

export default function MoreView({
  perm,
  onEnable,
  recurring,
  onAddRecurring,
  onDeleteRecurring,
}) {
  return (
    <div className="view">
      <h2 className="view-title">More</h2>

      <section className="glass card">
        <div className="setting">
          <span className="avatar">
            <Icon name="bell" size={18} />
          </span>
          <div className="grow">
            <div className="row-title">Report notifications</div>
            <small className="muted">{STATUS[perm] || STATUS.default}</small>
          </div>
          {perm === "default" && (
            <button className="pill" onClick={onEnable}>
              Turn on
            </button>
          )}
        </div>
      </section>

      <RecurringManager
        recurring={recurring}
        onAdd={onAddRecurring}
        onDelete={onDeleteRecurring}
      />

      <p className="muted small center">
        Your data is stored on this device only.
      </p>
    </div>
  );
}
