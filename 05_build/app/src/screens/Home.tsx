import { useEffect, useState } from "react";
import { useApp, queue, me } from "../store";
import { useT, speak } from "../i18n";
import { Header, SyncLine } from "../components/chrome";
import { BottomBar, NoteChip, Obj, RoomCard, KeyTag, Sheet } from "../components/ui";
import type { NoteId } from "../data/model";

/** 🏠 MY NEXT ROOM: one room fills the screen, most urgent first. Main action pinned at the bottom. */
export function Home() {
  const t = useT();
  const s = useApp();
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick((x) => x + 1), 15_000); return () => clearInterval(i); }, []);

  const q = queue(s.rooms);
  const next = q[0];
  const then = q.slice(1, 4);
  const doneCount = s.rooms.filter((r) => r.status === "to_inspect" || r.status === "ready").length;
  const aside = s.rooms.filter((r) => r.status === "dnd" && !(r.retryAt && r.retryAt <= Date.now())).length;
  const person = me(s);

  return (
    <div className="screen">
      <Header title={t("home.next")} />
      <div className="screen-body">
        <div className="home-top">
          <div className="muted">{t("home.progress", { done: doneCount, total: s.rooms.length })}</div>
          <SyncLine />
        </div>
        <div className="day-bar" aria-hidden>
          {s.rooms.map((r) => <span key={r.no} className={`st-${r.status}`} />)}
        </div>

        {next ? (
          <>
            {next.status === "needs_fix" ? (
              <div className="fix-card" onClick={() => s.go({ name: "fix", no: next.no })}>
                <KeyTag room={next} />
                <div>
                  <h2>{t("fix.card", { room: next.no })}</h2>
                  <div className="fix-score">{t("fix.score", { score: next.inspection?.score ?? 0 })} · {t("fix.items", { n: next.inspection?.failed.filter((f) => !f.fixed).length ?? 0 })}</div>
                </div>
              </div>
            ) : (
              <RoomCard room={next} hero onClick={() => s.go({ name: "room", no: next.no })} />
            )}

            {then.length > 0 && (
              <>
                <h3 className="section-title small-title">{t("home.then")}</h3>
                <div className="then-row">
                  {then.map((r) => (
                    <button type="button" key={r.no} className="then-item" onClick={() => s.go({ name: "room", no: r.no })}>
                      <KeyTag room={r} size="s" />
                    </button>
                  ))}
                </div>
              </>
            )}
            {aside > 0 && (
              <button type="button" className="aside-line" onClick={() => s.go({ name: "rooms" })}>🚫 {t("home.aside", { n: aside })}</button>
            )}
          </>
        ) : s.rooms.length === 0 ? (
          <div className="empty"><Obj id="no-rooms" size={140} /><h2>{t("home.noRooms")}</h2><p className="muted">{t("home.noRoomsSub")}</p></div>
        ) : (
          <div className="empty">
            <Obj id="all-done" size={140} />
            <h2>{t("home.allDone")}</h2>
            <p className="muted">{t("home.allDoneSub")}</p>
            <p className="thanks">{t("end.thanks", { name: person.name })}</p>
          </div>
        )}
      </div>
      <BottomBar>
        {next ? (
          next.status === "needs_fix" ? (
            <button type="button" className="btn btn-fix" onClick={() => s.go({ name: "fix", no: next.no })}>🔧 {t("fix.now")}</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => s.go({ name: next.status === "cleaning" ? "clean" : "room", no: next.no })}>
              {next.status === "cleaning" ? t("home.continue", { room: next.no }) : t("home.goTo", { room: next.no })} <span className="flip-rtl">→</span>
            </button>
          )
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => s.go({ name: "end" })}>🏁 {t("end.btn")}</button>
        )}
      </BottomBar>
    </div>
  );
}

/** "Why" sheet for a guest culture note: do / don't / why, with audio. */
export function NoteSheet({ id, onClose }: { id: NoteId | null; onClose: () => void }) {
  const t = useT();
  const lang = useApp((s) => s.lang);
  if (!id) return null;
  const read = () => speak([t(`note.${id}.title`), t(`note.${id}.do`), t(`note.${id}.dont`), t(`note.${id}.why`)].join(". "), lang);
  return (
    <Sheet open onClose={onClose} tone="note" title={<NoteChip id={id} big />}>
      <ul className="why-list">
        <li><span className="why-ic ok">✓</span><div><small>{t("note.do")}</small>{t(`note.${id}.do`)}</div></li>
        <li><span className="why-ic no">✕</span><div><small>{t("note.dont")}</small>{t(`note.${id}.dont`)}</div></li>
        <li><span className="why-ic">?</span><div><small>{t("note.why")}</small>{t(`note.${id}.why`)}</div></li>
      </ul>
      <p className="muted small">ⓘ {t("note.source")}</p>
      <div className="sheet-actions">
        <button type="button" className="btn btn-secondary" onClick={read}>🔊 {t("clean.listen")}</button>
        <button type="button" className="btn btn-note" onClick={onClose}>{t("note.gotIt")}</button>
      </div>
    </Sheet>
  );
}

/** Room card full view → knock → can I enter? → Start cleaning / DND / Guest said no. */
export function RoomScreen({ no }: { no: string }) {
  const t = useT();
  const s = useApp();
  const room = s.rooms.find((r) => r.no === no)!;
  const [note, setNote] = useState<NoteId | null>(null);
  const [cantEnter, setCantEnter] = useState(false);
  const needsChoice = room.longStay && !room.longStayChoice;

  return (
    <div className="screen">
      <Header title={room.no} back={s.home} />
      <div className="screen-body">
        <RoomCard room={room} hero />

        {room.vip && <div className="rule rule-vip"><Obj id="vip" size={36} /> {t("room.vipRule")}</div>}
        {room.privacy && <div className="rule rule-privacy"><Obj id="privacy" size={36} /> {t("room.privacyRule")}</div>}

        {room.notes.length > 0 && (
          <section className="note-panel">
            <h2 className="section-title">{t("room.notes")}</h2>
            <div className="note-grid">
              {room.notes.map((n) => <NoteChip key={n} id={n} big onClick={() => setNote(n)} />)}
            </div>
            <div className="muted small">ⓘ {t("room.tapWhy")}</div>
          </section>
        )}

        {room.requests.length > 0 && (
          <section>
            <h2 className="section-title">➕ {t("room.requests")}</h2>
            <div className="req-grid">
              {room.requests.map((rq) => (
                <div key={rq.item} className="req-big"><Obj id={rq.item} size={56} /><b>×{rq.qty}</b><span>{t(`obj.${rq.item}`)}</span></div>
              ))}
            </div>
          </section>
        )}

        {room.longStay && (
          <section>
            <h2 className="section-title">{t("room.longStay")}</h2>
            <div className="seg">
              {(["light", "linen"] as const).map((c) => (
                <button type="button" key={c} className={room.longStayChoice === c ? "on" : ""} onClick={() => s.setLongStay(no, c)}>
                  <Obj id={c === "light" ? "duster" : "linen"} size={40} /> {t(`ls.${c}`)}
                </button>
              ))}
            </div>
          </section>
        )}

        {room.status !== "cleaning" && (
          <div className="knock"><span className="big-emoji">✊🚪</span><div><b>{t("room.knock")}</b><div className="muted">{t("room.canEnter")}</div></div></div>
        )}
      </div>

      <BottomBar>
        {room.status === "cleaning" ? (
          <button type="button" className="btn btn-primary" onClick={() => s.go({ name: "clean", no })}>{t("home.continue", { room: no })}</button>
        ) : (
          <div className="bar-row">
            <button type="button" className="btn btn-secondary" onClick={() => setCantEnter(true)}>🚫 {t("room.cantEnter")}</button>
            <button type="button" className="btn btn-primary" disabled={needsChoice} onClick={() => s.startCleaning(no)}>▶ {t("room.start")}</button>
          </div>
        )}
      </BottomBar>

      <NoteSheet id={note} onClose={() => setNote(null)} />
      <Sheet open={cantEnter} onClose={() => setCantEnter(false)} title={t("room.cantEnter")}>
        <div className="help-list">
          <button type="button" className="help-opt" onClick={() => { s.markDnd(no, "dnd"); }}><Obj id="dnd" size={52} /> {t("room.dnd")}</button>
          <button type="button" className="help-opt" onClick={() => { s.markDnd(no, "refused"); }}><span className="big-emoji">✋</span> {t("room.refused")}</button>
        </div>
        <p className="muted small">⏰ {t("room.reminder", { time: "+30 min" })}</p>
      </Sheet>
    </div>
  );
}
