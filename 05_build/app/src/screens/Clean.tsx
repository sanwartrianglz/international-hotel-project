import { useState } from "react";
import { useApp, queue } from "../store";
import { useT, speak } from "../i18n";
import { Header } from "../components/chrome";
import { BottomBar, Obj, ObjectTile, Progress, Sheet, KeyTag } from "../components/ui";
import { AREAS, MINIBAR_ITEMS, NOTES, areasFor, progress } from "../data/content";
import type { AreaId } from "../data/model";

/** 🧹 CLEAN THE ROOM: object checklist · progress n/6 · extras · minibar ± · 🔧 Report issue.
 *  "Room done" stays locked until every step is ticked. */
export function CleanScreen({ no }: { no: string }) {
  const t = useT();
  const s = useApp();
  const room = s.rooms.find((r) => r.no === no)!;
  const [area, setArea] = useState<AreaId | null>(null);
  const [minibar, setMinibar] = useState(false);
  const p = progress(room);
  const all = p.done === p.total;
  const noAlcohol = room.notes.includes("no-alcohol");

  return (
    <div className="screen">
      <Header title={room.no} back={() => s.go({ name: "room", no })} />
      <div className="screen-body">
        <div className="clean-head">
          <KeyTag room={room} size="s" />
          {room.notes.length > 0 && (
            <div className="note-mini">{room.notes.map((n) => { const o = NOTES[n].object; return <span key={n} className="note-dot" title={t(`note.${n}.title`)}>{o ? <Obj id={o} size={24} /> : NOTES[n].emoji}</span>; })}</div>
          )}
        </div>

        <div className="tile-grid">
          {areasFor(room).map((a) => (
            <ObjectTile key={a} object={AREAS[a].object} label={t(`area.${a}`)} state={room.done[a] ? "done" : "todo"} onClick={() => setArea(a)} />
          ))}
          {room.requests.map((rq) => (
            <ObjectTile key={rq.item} object={rq.item} label={`${t(`obj.${rq.item}`)} ×${rq.qty}`}
              state={room.done["req:" + rq.item] ? "done" : "todo"} badge={room.done["req:" + rq.item] ? "✓" : "➕"}
              onClick={() => s.tick(no, "req:" + rq.item)} />
          ))}
          {room.occ !== "vacant" && (
            <ObjectTile object="minibar" label={t("clean.minibar")} state={room.done.minibar ? "done" : "todo"} onClick={() => setMinibar(true)} />
          )}
        </div>
        {room.requests.length > 0 && <p className="muted small">➕ {t("clean.bring")}</p>}

        <button type="button" className="btn btn-secondary btn-issue" onClick={() => s.go({ name: "issue", no })}>
          <Obj id="tap-leak" size={32} /> {t("clean.reportIssue")}
        </button>
      </div>

      <BottomBar>
        <div className="bar-progress">
          <Progress done={p.done} total={p.total} />
          <span className="bar-progress-label">{t("clean.progress", p)}</span>
        </div>
        <button type="button" className="btn btn-primary" disabled={!all} onClick={() => s.roomDone(no)}>
          {all ? "✓" : "🔒"} {t("clean.roomDone")}
        </button>
      </BottomBar>

      {area && <AreaSheet no={no} area={area} onClose={() => setArea(null)} />}
      <Sheet open={minibar} onClose={() => setMinibar(false)} title={<><Obj id="minibar" size={36} /> {t("clean.minibar")}</>}>
        <p className="muted">{t("clean.minibarHint")}</p>
        <div className="mb-list">
          {MINIBAR_ITEMS.filter((i) => !(noAlcohol && i === "wine")).map((item) => (
            <div key={item} className="mb-row">
              <Obj id={item} size={48} />
              <span className="mb-name">{t(`obj.${item}`)}</span>
              <button type="button" className="round-btn" onClick={() => s.setMinibar(no, item, -1)} aria-label="−">−</button>
              <b className="mb-count">{room.minibar[item] ?? 0}</b>
              <button type="button" className="round-btn" onClick={() => s.setMinibar(no, item, 1)} aria-label="+">+</button>
            </div>
          ))}
        </div>
        {noAlcohol && <p className="note-inline">🚫🍷 {t("note.no-alcohol.do")}</p>}
        <button type="button" className="btn btn-primary" onClick={() => { s.tick(no, "minibar", true); setMinibar(false); }}>✓ {t("clean.minibarDone")}</button>
      </Sheet>
    </div>
  );
}

/** Step screen: reference image (how it must look, brand standard) + icon sub-steps + 🔊 audio hint. */
function AreaSheet({ no, area, onClose }: { no: string; area: AreaId; onClose: () => void }) {
  const t = useT();
  const s = useApp();
  const room = s.rooms.find((r) => r.no === no)!;
  const def = AREAS[area];
  const [ticks, setTicks] = useState<boolean[]>(() => def.steps.map(() => !!room.done[area]));
  const allTicked = ticks.every(Boolean);
  const listen = () => speak(t(`area.${area}`) + ". " + def.steps.map((st) => t(st.key)).join(", "), s.lang);

  return (
    <Sheet open onClose={onClose} title={<><Obj id={def.object} size={36} /> {t(`area.${area}`)}</>}>
      <div className="reference">
        <div className="reference-img"><Obj id={def.object} size={150} /></div>
        <div className="reference-cap">📷 {t("clean.reference")}{room.vip ? " · ⭐ VIP" : ""}</div>
        <button type="button" className="icon-btn reference-audio" onClick={listen} aria-label={t("clean.listen")}>🔊</button>
      </div>
      <div className="steps">
        {def.steps.map((st, i) => (
          <button type="button" key={st.key} className={`step ${ticks[i] ? "on" : ""}`} onClick={() => setTicks((x) => x.map((v, j) => (j === i ? !v : v)))} aria-pressed={ticks[i]}>
            <Obj id={st.object} size={44} />
            <span>{t(st.key)}</span>
            <span className="step-check">{ticks[i] ? "✓" : ""}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => { s.tick(no, area, allTicked); onClose(); }}>
        {allTicked ? "✓ " + t("clean.done") : t("common.back")}
      </button>
    </Sheet>
  );
}

/** ✓ ROOM DONE: number-first, quiet praise, always the next step. */
export function DoneScreen({ no }: { no: string }) {
  const t = useT();
  const s = useApp();
  const next = queue(s.rooms)[0];
  return (
    <div className="screen done-screen">
      <div className="screen-body center">
        <div className="done-stamp">✓</div>
        <h1 className="title">{t("done.title", { room: no })}</h1>
        <p className="muted">{t("done.sub")}</p>
        {next && <p className="done-next">{t("done.next", { room: next.no })}</p>}
      </div>
      <BottomBar>
        {next ? (
          <button type="button" className="btn btn-primary" onClick={() => s.go({ name: "room", no: next.no })}>{t("done.goTo", { room: next.no })} <span className="flip-rtl">→</span></button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={s.home}>{t("home.allDone")}</button>
        )}
      </BottomBar>
    </div>
  );
}

/** 🔧 FIX-IT: only the failed items + inspector photos → Fix each → Send for re-check. "Needs a fix", never "FAILED". */
export function FixScreen({ no }: { no: string }) {
  const t = useT();
  const s = useApp();
  const room = s.rooms.find((r) => r.no === no)!;
  const failed = room.inspection?.failed ?? [];
  const left = failed.filter((f) => !f.fixed).length;
  return (
    <div className="screen">
      <Header title={t("fix.title", { room: no, n: failed.length })} back={s.home} />
      <div className="screen-body">
        <div className="fix-summary">
          <bdi dir="ltr"><span className="fix-big">{room.inspection?.score ?? 0}</span><span className="muted"> / 100</span></bdi>
          <span className="muted">· {t("fix.passMark")}</span>
        </div>
        <div className="fix-list">
          {failed.map((f, i) => (
            <div key={i} className={`fix-item ${f.fixed ? "on" : ""}`}>
              <div className="fix-photo"><Obj id={AREAS[f.area].object} size={72} /><small>📷 {t("fix.inspector")}</small></div>
              <div className="fix-reason">
                <b>{t(f.reason)}</b>
                <span className="muted">{t(`area.${f.area}`)}</span>
              </div>
              <button type="button" className={`btn btn-small ${f.fixed ? "btn-ok" : "btn-secondary"}`} onClick={() => s.fixItem(no, i)} aria-pressed={f.fixed}>
                {f.fixed ? "✓ " : ""}{t("fix.mark")}
              </button>
            </div>
          ))}
        </div>
        <p className="muted small">{t("fix.sentSub")}</p>
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" disabled={left > 0} onClick={() => s.sendRecheck(no)}>
          {left > 0 ? `🔒 ${t("fix.send")} (${failed.length - left} / ${failed.length})` : `✓ ${t("fix.send")}`}
        </button>
      </BottomBar>
    </div>
  );
}
