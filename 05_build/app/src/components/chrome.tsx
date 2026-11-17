import { useEffect, useState } from "react";
import { useApp } from "../store";
import { useT, translate } from "../i18n";
import { Obj, Sheet, hhmm } from "./ui";
import type { HelpKind } from "../data/model";
import { SUPERVISOR } from "../data/seed";

/** Header on every shift screen (Amr's navigation model: no tab bar).
 *  ☰ rooms/menu · title · 💬 messages with badge · 🛟 help · ⏸ break. Mode banners always visible. */
export function Header({ title, back }: { title?: string; back?: () => void }) {
  const t = useT();
  const { go, online, pending, messages, startBreak, onBreak, msgSeenAt } = useApp();
  const [help, setHelp] = useState(false);
  const unread = messages.filter((m) => m.from === "supervisor" && m.at > msgSeenAt).length;

  return (
    <>
      <header className="header">
        {back ? (
          <button type="button" className="icon-btn" onClick={back} aria-label={t("common.back")}><span className="flip-rtl">←</span></button>
        ) : (
          <button type="button" className="icon-btn" onClick={() => go({ name: "menu" })} aria-label={t("menu.title")}>☰</button>
        )}
        <div className="header-title">{title}</div>
        <button type="button" className="icon-btn" onClick={() => go({ name: "messages" })} aria-label={t("msg.title")}>
          💬{unread > 0 && <span className="badge">{unread}</span>}
        </button>
        {!onBreak && (
          <button type="button" className="icon-btn" onClick={startBreak} aria-label={t("break.btn")}>⏸</button>
        )}
        <button type="button" className="icon-btn icon-btn-help" onClick={() => setHelp(true)} aria-label={t("help.title")}>🛟</button>
      </header>
      {!online && (
        <div className="banner banner-offline" role="status">☁︎ {t("mode.offline")}{pending > 0 && <b> · {t("mode.pending", { n: pending })}</b>}</div>
      )}
      <HelpSheet open={help} onClose={() => setHelp(false)} />
    </>
  );
}

/** Help sheet: supplies · extra hands · safety (last, red). Room number attached automatically. */
export function HelpSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const { requestHelp, help, clearHelp } = useApp();
  const pick = (k: HelpKind) => requestHelp(k);
  const close = () => { onClose(); if (help?.state === "on_the_way") clearHelp(); };
  return (
    <Sheet open={open} onClose={close} title={t("help.title")}>
      {help ? (
        <div className="help-status">
          <div className={`help-pulse ${help.state}`}>{help.state === "on_the_way" ? "👍" : "…"}</div>
          <h3>{help.state === "on_the_way" ? t("help.onTheWay") : t("msg.tap")}</h3>
          <p className="muted">{t("help.sentTo", { name: SUPERVISOR, room: help.room ?? "4" })}</p>
          <button type="button" className="btn btn-secondary" onClick={() => { clearHelp(); onClose(); }}>{t("common.close")}</button>
        </div>
      ) : (
        <div className="help-list">
          <button type="button" className="help-opt" onClick={() => pick("supplies")}><Obj id="cart" size={52} /> {t("help.supplies")}</button>
          <button type="button" className="help-opt" onClick={() => pick("hands")}><span className="big-emoji">🙋</span> {t("help.hands")}</button>
          <button type="button" className="help-opt help-safety" onClick={() => pick("safety")}><Obj id="first-aid" size={52} /> {t("help.safety")}</button>
        </div>
      )}
    </Sheet>
  );
}

/** Full-screen paused state (DoorDash pattern): no new rooms, no alerts. */
export function BreakScreen() {
  const t = useT();
  const { onBreak, endBreak } = useApp();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);
  const s = Math.max(0, Math.floor((now - (onBreak ?? now)) / 1000));
  return (
    <div className="break-screen">
      <div className="break-icon">⏸</div>
      <h1>{t("break.btn")}</h1>
      <div className="break-timer">{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</div>
      <p>{t("break.sub")}</p>
      <div className="break-action">
        <button type="button" className="btn btn-primary btn-light" onClick={endBreak}>{t("break.back")}</button>
      </div>
    </div>
  );
}

export function UrgentAlert() {
  const t = useT();
  const { urgentAlert, dismissUrgent, go } = useApp();
  if (!urgentAlert) return null;
  return (
    <div className="urgent-overlay" role="alertdialog" aria-live="assertive">
      <div className="urgent-card">
        <div className="urgent-bolt">⚡</div>
        <h2>{t("urgent.title", { room: urgentAlert })}</h2>
        <p>{t("urgent.sub")}</p>
        <button type="button" className="btn btn-urgent" onClick={() => { dismissUrgent(); go({ name: "room", no: urgentAlert }); }}>
          {t("urgent.go", { room: urgentAlert })}
        </button>
        <button type="button" className="btn btn-ghost-light" onClick={dismissUrgent}>{t("urgent.after")}</button>
      </div>
    </div>
  );
}

export function Toasts() {
  const { toasts, dropToast, lang } = useApp();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((x) => (
        <button type="button" key={x.id} className={`toast toast-${x.tone}`} onClick={() => dropToast(x.id)}>
          {translate(lang, x.key, x.vars)}
        </button>
      ))}
    </div>
  );
}

export function SyncLine() {
  const t = useT();
  const { lastSync, online } = useApp();
  return <div className="sync-line">{online ? "●" : "○"} {t("pms.synced", { time: hhmm(lastSync) })}</div>;
}
