import { useEffect, useState } from "react";
import { useApp, me } from "../store";
import { useT } from "../i18n";
import { Header } from "../components/chrome";
import { BottomBar, Obj, RoomCard, hhmm, STATUS_ICON } from "../components/ui";
import { PRESET_MESSAGES } from "../data/content";
import { SUPERVISOR } from "../data/seed";
import type { Status } from "../data/model";
import { LangPicker } from "./Start";

/** 💬 MESSAGES: pre-set icon tiles, one tap = one message, room number attached. ✓✓ seen + quick reply. */
export function MessagesScreen() {
  const t = useT();
  const s = useApp();
  useEffect(() => { s.markMessagesSeen(); }, [s.messages.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="screen">
      <Header title={`💬 ${SUPERVISOR}`} back={s.home} />
      <div className="screen-body chat">
        {s.messages.map((m) => (
          <div key={m.id} className={`bubble ${m.from === "me" ? "mine" : "theirs"}`}>
            <div className="bubble-main">
              {m.object ? <Obj id={m.object} size={36} /> : <span className="big-emoji-s">{m.emoji}</span>}
              <span>{t(m.key)}</span>
            </div>
            <div className="bubble-meta">
              {m.room && <span>{m.room} · </span>}
              {m.from === "me" ? (m.synced ? (m.seen ? `✓✓ ${t("msg.seen", { time: hhmm(m.at) })}` : "✓") : `☁︎ ${t("msg.notSent")}`) : hhmm(m.at)}
            </div>
          </div>
        ))}
      </div>
      <div className="preset-panel">
        <div className="muted small">{t("msg.tap")}</div>
        <div className="preset-grid">
          {PRESET_MESSAGES.map((p) => (
            <button type="button" key={p.key} className="preset" onClick={() => s.sendMessage(p.key, p.object, p.emoji)}>
              {p.object ? <Obj id={p.object} size={44} /> : <span className="big-emoji">{p.emoji}</span>}
              <span>{t(p.key)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const FILTERS: (Status | "all")[] = ["all", "to_clean", "cleaning", "to_inspect", "ready", "dnd"];

/** ☰ ALL MY ROOMS: list + status filter · DND retry. */
export function RoomsScreen() {
  const t = useT();
  const s = useApp();
  const [f, setF] = useState<Status | "all">("all");
  const list = s.rooms.filter((r) => f === "all" || r.status === f || (f === "to_clean" && r.status === "needs_fix"));
  return (
    <div className="screen">
      <Header title={t("rooms.title")} back={s.home} />
      <div className="filter-row" role="tablist">
        {FILTERS.map((x) => {
          const n = x === "all" ? s.rooms.length : s.rooms.filter((r) => r.status === x).length;
          return (
            <button type="button" role="tab" aria-selected={f === x} key={x} className={`filter st-${x} ${f === x ? "on" : ""}`} onClick={() => setF(x)}>
              {x !== "all" && <span aria-hidden>{STATUS_ICON[x]}</span>} {x === "all" ? t("rooms.all") : t("status." + x)} <b>{n}</b>
            </button>
          );
        })}
      </div>
      <div className="screen-body">
        {list.length === 0 && <p className="muted center">{t("rooms.empty")}</p>}
        <div className="room-list">
          {list.map((r) => (
            <div key={r.no} className="room-list-item">
              <RoomCard room={r} onClick={() => s.go({ name: r.status === "needs_fix" ? "fix" : r.status === "cleaning" ? "clean" : "room", no: r.no })} />
              {r.status === "dnd" && (
                <button type="button" className="btn btn-secondary btn-small" onClick={() => s.retryNow(r.no)}>⟳ {t("rooms.retry")}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MenuScreen() {
  const t = useT();
  const s = useApp();
  const person = me(s);
  const items = [
    { icon: <span className="big-emoji-s">☰</span>, label: t("menu.rooms"), go: () => s.go({ name: "rooms" }) },
    { icon: <Obj id="clipboard" size={36} />, label: t("menu.reports"), go: () => s.go({ name: "reports" }) },
    { icon: <span className="big-emoji-s">💬</span>, label: t("msg.title"), go: () => s.go({ name: "messages" }) },
    { icon: <span className="big-emoji-s">🏁</span>, label: t("menu.end"), go: () => s.go({ name: "end" }) },
  ];
  return (
    <div className="screen">
      <Header title={t("menu.title")} back={s.home} />
      <div className="screen-body">
        <div className="greet"><div className="avatar">{person.from}</div><div><b>{person.name}</b><div className="muted">{t("shift.floor", { floor: 4, n: s.rooms.length })} · {s.device === "tablet" ? t("login.cartTablet") : t("login.ownPhone")}</div></div></div>
        <div className="menu-list">
          {items.map((it) => <button type="button" key={it.label} className="menu-item" onClick={it.go}>{it.icon}<span>{it.label}</span><span className="flip-rtl muted">›</span></button>)}
        </div>
        <h2 className="section-title">🌐 {t("menu.language")}</h2>
        <LangPicker />
        <button type="button" className="menu-item menu-demo" onClick={() => s.go({ name: "demo" })}>🎬<span>{t("menu.demo")}</span><span className="flip-rtl muted">›</span></button>
      </div>
    </div>
  );
}

/** 🏁 END SHIFT: summary · hand over DND rooms · progress · off duty. */
export function EndScreen() {
  const t = useT();
  const s = useApp();
  const person = me(s);
  const done = s.rooms.filter((r) => r.status === "to_inspect" || r.status === "ready").length;
  const inspected = s.rooms.filter((r) => r.inspection);
  const passedFirst = inspected.filter((r) => r.inspection!.failed.length === 0).length;
  const rate = inspected.length ? Math.round((passedFirst / inspected.length) * 100) : 100;
  const dnd = s.rooms.filter((r) => r.status === "dnd");
  const handed = dnd.length > 0 && dnd.every((r) => s.handedOver.includes(r.no));
  const notDone = s.rooms.filter((r) => r.status === "to_clean" || r.status === "cleaning" || r.status === "needs_fix").length;

  return (
    <div className="screen">
      <Header title={t("end.title")} back={s.home} />
      <div className="screen-body">
        <div className="stats">
          <div className="stat"><b>{done}</b><span>{t("end.rooms")}</span></div>
          <div className="stat"><b>{s.issues.length}</b><span>{t("end.issues")}</span></div>
          <div className="stat stat-ok"><b>{rate}%</b><span>{t("end.passed")}</span></div>
        </div>
        <p className="thanks">⭐ {t("end.thanks", { name: person.name })}</p>

        {notDone > 0 && <div className="rule rule-warn">⚠ {t("end.notDone", { n: notDone })}</div>}

        {dnd.length > 0 && (
          <section>
            <h2 className="section-title">🚫 {t("end.handTitle")}</h2>
            <div className="then-row">{dnd.map((r) => <span key={r.no} className="keytag keytag-s st-dnd"><span className="keytag-hole" /><span className="keytag-no">{r.no}</span></span>)}</div>
            {handed ? (
              <p className="ok-line">✓ {t("end.handed", { name: SUPERVISOR })}</p>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={s.handOver}>↪ {t("end.hand")}</button>
            )}
          </section>
        )}
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" disabled={dnd.length > 0 && !handed} onClick={s.endShift}>🏁 {t("end.btn")}</button>
      </BottomBar>
    </div>
  );
}

export function OffDuty() {
  const t = useT();
  const s = useApp();
  return (
    <div className="screen done-screen">
      <div className="screen-body center">
        <div className="done-stamp">🌙</div>
        <h1 className="title">{t("end.offTitle")}</h1>
        <p className="muted">{s.device === "tablet" ? t("end.loggedOut") : t("end.offSub")}</p>
      </div>
      <BottomBar><button type="button" className="btn btn-secondary" onClick={s.demoReset}>↺ {t("end.again")}</button></BottomBar>
    </div>
  );
}

/** Demo controls: what reception, the PMS and the supervisor would send.
 *  Stand-in until the supervisor app is built. English only (for presenters). */
export function DemoScreen() {
  const s = useApp();
  const [room, setRoom] = useState("418");
  const r = s.rooms.find((x) => x.no === room);
  return (
    <div className="screen">
      <Header title="🎬 Demo controls" back={s.home} />
      <div className="screen-body demo">
        <p className="muted small">Simulates the other side: reception, the PMS (OPERA) and the supervisor.</p>
        <label className="demo-row">Room
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            {s.rooms.map((x) => <option key={x.no} value={x.no}>{x.no} · {x.status}</option>)}
          </select>
        </label>
        <div className="demo-grid">
          <button type="button" className="btn btn-urgent" onClick={() => { s.demoUrgent(room); s.home(); }}>⚡ Reception: mark urgent</button>
          <button type="button" className="btn btn-secondary" disabled={r?.status !== "to_inspect"} onClick={() => s.demoInspect(room, true)}>✓ Supervisor: pass</button>
          <button type="button" className="btn btn-secondary" disabled={r?.status !== "to_inspect"} onClick={() => s.demoInspect(room, false)}>🔧 Supervisor: needs a fix</button>
          <button type="button" className="btn btn-secondary" onClick={() => s.demoCheckout(room)}>🧳 PMS: guest checked out</button>
        </div>
        <label className="demo-row">
          <input type="checkbox" checked={!s.online} onChange={(e) => s.setOnline(!e.target.checked)} /> No signal (offline)
        </label>
        <p className="muted small">Inspection buttons work once the room is “To inspect” (after Room done). Maintenance issues move to “Being fixed” after 20 s and “Fixed” after 60 s. Messages get a reply after 5 s. DND rooms come back after 45 s.</p>
        <button type="button" className="btn btn-secondary" onClick={() => { localStorage.clear(); location.reload(); }}>↺ Reset everything</button>
      </div>
      <BottomBar><button type="button" className="btn btn-primary" onClick={s.home}>Back to app</button></BottomBar>
    </div>
  );
}
