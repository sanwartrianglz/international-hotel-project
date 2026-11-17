import { useEffect, useState } from "react";
import { useApp } from "../store";
import { useT, translate } from "../i18n";
import { Obj, Sheet, hhmm } from "./ui";
import { Icon } from "./Icon";
import type { HelpKind } from "../data/model";
import { SUPERVISOR } from "../data/seed";

/** Header on every shift screen (Amr's navigation model: no tab bar).
 *  ☰ / back · title · messages with badge · break · help. Mode banners always visible. */
export function Header({ title, back, sub }: { title?: string; back?: () => void; sub?: string }) {
  const t = useT();
  const { go, online, pending, messages, startBreak, onBreak, msgSeenAt } = useApp();
  const [help, setHelp] = useState(false);
  const unread = messages.filter((m) => m.from === "supervisor" && m.at > msgSeenAt).length;

  return (
    <>
      <header className="header">
        {back ? (
          <button type="button" className="icon-btn icon-btn-plain" onClick={back} aria-label={t("common.back")}><Icon name="back" className="flip-rtl" /></button>
        ) : (
          <button type="button" className="icon-btn icon-btn-plain" onClick={() => go({ name: "menu" })} aria-label={t("menu.title")}><Icon name="menu" /></button>
        )}
        <div className="header-title">
          <span>{title}</span>
          {sub && <small>{sub}</small>}
        </div>
        <button type="button" className="icon-btn icon-btn-plain" onClick={() => go({ name: "messages" })} aria-label={t("msg.title")}>
          <Icon name="chat" />{unread > 0 && <span className="badge">{unread}</span>}
        </button>
        {!onBreak && (
          <button type="button" className="icon-btn icon-btn-plain" onClick={startBreak} aria-label={t("break.btn")}><Icon name="pause" /></button>
        )}
        <button type="button" className="icon-btn icon-btn-help" onClick={() => setHelp(true)} aria-label={t("help.title")}><Icon name="help" /></button>
      </header>
      {!online && (
        <div className="banner banner-offline" role="status">
          <Icon name="cloudOff" size={16} /> <span>{t("mode.offline")}{pending > 0 && <b> · {t("mode.pending", { n: pending })}</b>}</span>
        </div>
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
          <div className={`help-pulse ${help.state}`}><Icon name={help.state === "on_the_way" ? "check" : "clock"} size={30} /></div>
          <h3>{help.state === "on_the_way" ? t("help.onTheWay") : t("msg.tap")}</h3>
          <p className="muted">{t("help.sentTo", { name: SUPERVISOR, room: help.room ?? "4" })}</p>
          <button type="button" className="btn btn-secondary" onClick={() => { clearHelp(); onClose(); }}>{t("common.close")}</button>
        </div>
      ) : (
        <div className="opt-list">
          <button type="button" className="opt" onClick={() => pick("supplies")}><Obj id="cart" size={40} /><span>{t("help.supplies")}</span><Icon name="next" size={16} className="flip-rtl muted" /></button>
          <button type="button" className="opt" onClick={() => pick("hands")}><span className="opt-ic"><Icon name="hand" size={22} /></span><span>{t("help.hands")}</span><Icon name="next" size={16} className="flip-rtl muted" /></button>
          <button type="button" className="opt opt-safety" onClick={() => pick("safety")}><Obj id="first-aid" size={40} /><span>{t("help.safety")}</span><Icon name="next" size={16} className="flip-rtl" /></button>
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
      <div className="break-hanger"><span className="hanger-hole" /><Icon name="pause" size={26} stroke={2.4} /></div>
      <h1>{t("break.btn")}</h1>
      <div className="break-timer">{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</div>
      <p>{t("break.sub")}</p>
      <div className="break-action">
        <button type="button" className="btn btn-light" onClick={endBreak}><Icon name="play" size={16} fill stroke={0} /> {t("break.back")}</button>
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
        <div className="urgent-bolt"><Icon name="bolt" size={26} fill stroke={0} /></div>
        <div className="urgent-eyebrow">{t("tag.urgent")}</div>
        <h2>{urgentAlert}</h2>
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
  return <div className={`sync-line ${online ? "" : "off"}`}><span className="sync-dot" />{t("pms.synced", { time: hhmm(lastSync) })}</div>;
}
