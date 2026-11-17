import { useEffect, useState, type ReactNode } from "react";
import { useApp, me } from "../store";
import { useT } from "../i18n";
import { Header } from "../components/chrome";
import { BottomBar, Eyebrow, KeyTag, Obj, RoomCard, hhmm, STATUS_ICON } from "../components/ui";
import { Icon } from "../components/Icon";
import { PRESET_MESSAGES } from "../data/content";
import { SUPERVISOR } from "../data/seed";
import type { Status } from "../data/model";
import { LangPicker, BriefingCard } from "./Start";

/** 💬 MESSAGES: pre-set icon tiles, one tap = one message, room number attached. ✓✓ seen + quick reply. */
export function MessagesScreen() {
  const t = useT();
  const s = useApp();
  useEffect(() => { s.markMessagesSeen(); }, [s.messages.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="screen">
      <Header title={SUPERVISOR} sub={t("msg.role")} back={s.home} />
      <div className="screen-body chat">
        {s.messages.length === 0 && <p className="muted small center">{t("msg.tap")}</p>}
        {s.messages.map((m) => (
          <div key={m.id} className={`bubble ${m.from === "me" ? "mine" : "theirs"}`}>
            <div className="bubble-main">
              {m.object ? <Obj id={m.object} size={26} /> : <span className="bubble-emoji">{m.emoji}</span>}
              <span>{t(m.key)}</span>
            </div>
            <div className="bubble-meta">
              {m.room && <span className="room-no">{m.room} · </span>}
              {m.from === "me" ? (m.synced ? (m.seen ? `✓✓ ${t("msg.seen", { time: hhmm(m.at) })}` : "✓") : t("msg.notSent")) : hhmm(m.at)}
            </div>
          </div>
        ))}
      </div>
      <div className="preset-panel">
        <Eyebrow>{t("msg.tap")}</Eyebrow>
        <div className="preset-grid">
          {PRESET_MESSAGES.map((p) => (
            <button type="button" key={p.key} className="preset" onClick={() => s.sendMessage(p.key, p.object, p.emoji)}>
              {p.object ? <Obj id={p.object} size={32} /> : <span className="preset-ic"><Icon name="clock" size={20} /></span>}
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
              {x !== "all" && <Icon name={STATUS_ICON[x]} size={12} stroke={2.4} />} {x === "all" ? t("rooms.all") : t("status." + x)} <b>{n}</b>
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
                <button type="button" className="btn btn-secondary btn-small" onClick={() => s.retryNow(r.no)}><Icon name="refresh" size={14} /> {t("rooms.retry")}</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuRow({ icon, label, onClick, tone }: { icon: ReactNode; label: string; onClick: () => void; tone?: "quiet" }) {
  return (
    <button type="button" className={`menu-item ${tone ? "menu-" + tone : ""}`} onClick={onClick}>
      <span className="menu-ic">{icon}</span><span>{label}</span><Icon name="next" size={16} className="flip-rtl muted" />
    </button>
  );
}

/** Today's briefing, re-opened from the menu during the shift (read-only). */
export function BriefingScreen() {
  const t = useT();
  const s = useApp();
  return (
    <div className="screen">
      <Header title={t("brief.title")} sub={t("shift.time")} back={() => s.go({ name: "menu" })} />
      <div className="screen-body"><BriefingCard /></div>
    </div>
  );
}

export function MenuScreen() {
  const t = useT();
  const s = useApp();
  const person = me(s);
  return (
    <div className="screen">
      <Header title={t("menu.title")} back={s.home} />
      <div className="screen-body">
        <div className="profile">
          <div className="avatar">{person.name[0]}</div>
          <div>
            <div className="profile-name">{person.name}</div>
            <div className="muted small">{t("shift.floor", { floor: 4, n: s.rooms.length })} · {s.device === "tablet" ? t("login.cartTablet") : t("login.ownPhone")}</div>
          </div>
        </div>
        <div className="card list-card">
          <MenuRow icon={<Icon name="list" />} label={t("menu.rooms")} onClick={() => s.go({ name: "rooms" })} />
          <MenuRow icon={<Icon name="clipboard" />} label={t("brief.title")} onClick={() => s.go({ name: "briefing" })} />
          <MenuRow icon={<Icon name="wrench" />} label={t("menu.reports")} onClick={() => s.go({ name: "reports" })} />
          <MenuRow icon={<Icon name="chat" />} label={t("msg.title")} onClick={() => s.go({ name: "messages" })} />
          <MenuRow icon={<Icon name="flag" />} label={t("menu.end")} onClick={() => s.go({ name: "end" })} />
        </div>
        <Eyebrow>{t("menu.language")}</Eyebrow>
        <LangPicker />
        <div className="card list-card">
          <MenuRow icon={<Icon name="film" />} label={t("menu.demo")} onClick={() => s.go({ name: "demo" })} tone="quiet" />
        </div>
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
        <p className="thanks">{t("end.thanks", { name: person.name })}</p>

        {notDone > 0 && <div className="rule rule-warn"><Icon name="info" size={16} /> {t("end.notDone", { n: notDone })}</div>}

        {dnd.length > 0 && (
          <section className="block">
            <Eyebrow>{t("end.handTitle")}</Eyebrow>
            <div className="then-row">{dnd.map((r) => <KeyTag key={r.no} room={r} size="s" />)}</div>
            {handed ? (
              <p className="ok-line"><Icon name="check" size={16} stroke={2.4} /> {t("end.handed", { name: SUPERVISOR })}</p>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={s.handOver}><Icon name="handover" size={16} className="flip-rtl" /> {t("end.hand")}</button>
            )}
          </section>
        )}
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" disabled={dnd.length > 0 && !handed} onClick={s.endShift}><Icon name="flag" size={16} /> {t("end.btn")}</button>
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
        <div className="seal seal-night"><Icon name="moon" size={34} /></div>
        <h1 className="display">{t("end.offTitle")}</h1>
        <p className="muted">{s.device === "tablet" ? t("end.loggedOut") : t("end.offSub")}</p>
      </div>
      <BottomBar><button type="button" className="btn btn-secondary" onClick={s.demoReset}><Icon name="refresh" size={16} /> {t("end.again")}</button></BottomBar>
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
      <Header title="Demo controls" back={s.home} />
      <div className="screen-body demo">
        <p className="muted small">Simulates the other side: reception, the PMS (OPERA) and the supervisor.</p>
        <label className="demo-row">Room
          <select value={room} onChange={(e) => setRoom(e.target.value)}>
            {s.rooms.map((x) => <option key={x.no} value={x.no}>{x.no} · {x.status}</option>)}
          </select>
        </label>
        <div className="demo-grid">
          <button type="button" className="btn btn-urgent" onClick={() => { s.demoUrgent(room); s.home(); }}><Icon name="bolt" size={15} fill stroke={0} /> Reception: mark urgent</button>
          <button type="button" className="btn btn-secondary" disabled={r?.status !== "to_inspect"} onClick={() => s.demoInspect(room, true)}><Icon name="check" size={15} /> Supervisor: pass</button>
          <button type="button" className="btn btn-secondary" disabled={r?.status !== "to_inspect"} onClick={() => s.demoInspect(room, false)}><Icon name="wrench" size={15} /> Supervisor: needs a fix</button>
          <button type="button" className="btn btn-secondary" onClick={() => s.demoCheckout(room)}><Icon name="door" size={15} /> PMS: guest checked out</button>
        </div>
        <label className="demo-row">
          <input type="checkbox" checked={!s.online} onChange={(e) => s.setOnline(!e.target.checked)} /> No signal (offline)
        </label>
        <p className="muted small">Inspection buttons work once the room is “To inspect” (after Room done). Maintenance issues move to “Being fixed” after 20 s and “Fixed” after 60 s. Messages get a reply after 5 s. DND rooms come back after 45 s.</p>
        <button type="button" className="btn btn-secondary" onClick={s.replayOnboarding}><Icon name="play" size={13} fill stroke={0} /> Replay splash + onboarding</button>
        <button type="button" className="btn btn-secondary" onClick={() => { localStorage.clear(); location.reload(); }}><Icon name="refresh" size={15} /> Reset everything</button>
      </div>
      <BottomBar><button type="button" className="btn btn-primary" onClick={s.home}>Back to app</button></BottomBar>
    </div>
  );
}
