import { useEffect, useState } from "react";
import { useApp, queue, me } from "../store";
import { useT, speak } from "../i18n";
import { Header, SyncLine } from "../components/chrome";
import { BottomBar, Eyebrow, GuestNeeds, NoteChip, Obj, RoomCard, KeyTag, Sheet } from "../components/ui";
import { Icon } from "../components/Icon";
import type { NoteId } from "../data/model";

/** 🏠 MY NEXT ROOM: one room fills the screen, most urgent first. Main action pinned at the bottom. */
export function Home() {
  const t = useT();
  const s = useApp();
  const [, tick] = useState(0);
  useEffect(() => { const i = setInterval(() => tick((x) => x + 1), 15_000); return () => clearInterval(i); }, []);

  const q = queue(s.rooms);
  const next = q[0];
  const then = q.slice(1, 5);
  const doneCount = s.rooms.filter((r) => r.status === "to_inspect" || r.status === "ready").length;
  const aside = s.rooms.filter((r) => r.status === "dnd" && !(r.retryAt && r.retryAt <= Date.now())).length;
  const person = me(s);
  const [note, setNote] = useState<NoteId | null>(null);

  return (
    <div className="screen">
      <Header title={t("home.next")} sub={t("shift.floor", { floor: 4, n: s.rooms.length })} />
      <div className="screen-body">
        <div className="day">
          <div className="day-top">
            <span><b>{doneCount}</b> / {s.rooms.length}</span>
            <SyncLine />
          </div>
          <div className="day-bar" aria-label={t("home.progress", { done: doneCount, total: s.rooms.length })}>
            {s.rooms.map((r) => <span key={r.no} className={`st-${r.status}`} />)}
          </div>
        </div>

        {next ? (
          <>
            {next.status === "needs_fix" ? (
              <button type="button" className="fix-card" onClick={() => s.go({ name: "fix", no: next.no })}>
                <KeyTag room={next} />
                <div className="fix-card-body">
                  <div className="fix-card-title">{t("fix.card", { room: next.no })}</div>
                  <div className="fix-card-sub"><b>{next.inspection?.score ?? 0}</b> / 100 · {t("fix.items", { n: next.inspection?.failed.filter((f) => !f.fixed).length ?? 0 })}</div>
                </div>
              </button>
            ) : (
              <>
                <RoomCard room={next} hero onClick={() => s.go({ name: "room", no: next.no })} />
                <GuestNeeds room={next} onNote={setNote} />
              </>
            )}

            {then.length > 0 && (
              <>
                <Eyebrow>{t("home.then")}</Eyebrow>
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
              <button type="button" className="aside-line" onClick={() => s.go({ name: "rooms" })}>
                <Icon name="ban" size={15} /> {t("home.aside", { n: aside })} <Icon name="next" size={14} className="flip-rtl" />
              </button>
            )}
          </>
        ) : s.rooms.length === 0 ? (
          <div className="empty"><Obj id="no-rooms" size={110} /><h2 className="display">{t("home.noRooms")}</h2><p className="muted">{t("home.noRoomsSub")}</p></div>
        ) : (
          <div className="empty">
            <Obj id="all-done" size={110} />
            <h2 className="display">{t("home.allDone")}</h2>
            <p className="muted">{t("home.allDoneSub")}</p>
            <p className="thanks">{t("end.thanks", { name: person.name })}</p>
          </div>
        )}
      </div>
      <BottomBar>
        {next ? (
          next.status === "needs_fix" ? (
            <button type="button" className="btn btn-fix" onClick={() => s.go({ name: "fix", no: next.no })}><Icon name="wrench" size={16} /> {t("fix.now")}</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => s.go({ name: next.status === "cleaning" ? "clean" : "room", no: next.no })}>
              {next.status === "cleaning" ? t("home.continue", { room: next.no }) : t("home.goTo", { room: next.no })} <Icon name="next" size={16} className="flip-rtl" />
            </button>
          )
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => s.go({ name: "end" })}><Icon name="flag" size={16} /> {t("end.btn")}</button>
        )}
      </BottomBar>
      <NoteSheet id={note} onClose={() => setNote(null)} />
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
    <Sheet open onClose={onClose} tone="note" title={<NoteChip id={id} />}>
      <ul className="why-list">
        <li><span className="why-ic ok"><Icon name="check" size={16} stroke={2.4} /></span><div><small>{t("note.do")}</small>{t(`note.${id}.do`)}</div></li>
        <li><span className="why-ic no"><Icon name="close" size={16} stroke={2.4} /></span><div><small>{t("note.dont")}</small>{t(`note.${id}.dont`)}</div></li>
        <li><span className="why-ic"><Icon name="info" size={16} /></span><div><small>{t("note.why")}</small>{t(`note.${id}.why`)}</div></li>
      </ul>
      <p className="muted small">{t("note.source")}</p>
      <div className="sheet-actions">
        <button type="button" className="btn btn-secondary" onClick={read}><Icon name="volume" size={16} /> {t("clean.listen")}</button>
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
      <Header title={t("home.next")} back={s.home} />
      <div className="screen-body">
        <RoomCard room={room} hero />

        {(room.vip || room.privacy) && (
          <div className="rules">
            {room.vip && <div className="rule rule-vip"><Obj id="vip" size={26} /> {t("room.vipRule")}</div>}
            {room.privacy && <div className="rule"><Obj id="privacy" size={26} /> {t("room.privacyRule")}</div>}
          </div>
        )}

        <GuestNeeds room={room} onNote={setNote} />

        {room.longStay && (
          <section className="block">
            <Eyebrow>{t("room.longStay")}</Eyebrow>
            <div className="seg">
              {(["light", "linen"] as const).map((c) => (
                <button type="button" key={c} className={room.longStayChoice === c ? "on" : ""} onClick={() => s.setLongStay(no, c)}>
                  <Obj id={c === "light" ? "duster" : "linen"} size={30} /> {t(`ls.${c}`)}
                </button>
              ))}
            </div>
          </section>
        )}

        {room.status !== "cleaning" && (
          <div className="knock">
            <span className="knock-ic"><Icon name="door" size={20} /></span>
            <div><b>{t("room.knock")}</b><div className="muted small">{t("room.canEnter")}</div></div>
          </div>
        )}
      </div>

      <BottomBar>
        {room.status === "cleaning" ? (
          <button type="button" className="btn btn-primary" onClick={() => s.go({ name: "clean", no })}>{t("home.continue", { room: no })}</button>
        ) : (
          <div className="bar-row">
            <button type="button" className="btn btn-secondary" onClick={() => setCantEnter(true)}><Icon name="ban" size={16} /> {t("room.cantEnter")}</button>
            <button type="button" className="btn btn-primary" disabled={needsChoice} onClick={() => s.startCleaning(no)}><Icon name="play" size={13} fill stroke={0} /> {t("room.start")}</button>
          </div>
        )}
      </BottomBar>

      <NoteSheet id={note} onClose={() => setNote(null)} />
      <Sheet open={cantEnter} onClose={() => setCantEnter(false)} title={t("room.cantEnter")}>
        <div className="opt-list">
          <button type="button" className="opt" onClick={() => s.markDnd(no, "dnd")}><Obj id="dnd" size={40} /><span>{t("room.dnd")}</span></button>
          <button type="button" className="opt" onClick={() => s.markDnd(no, "refused")}><span className="opt-ic"><Icon name="hand" size={22} /></span><span>{t("room.refused")}</span></button>
        </div>
        <p className="muted small"><Icon name="clock" size={13} /> {t("room.reminder", { time: "+30 min" })}</p>
      </Sheet>
    </div>
  );
}
