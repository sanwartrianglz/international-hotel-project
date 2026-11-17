import { useState, type ReactNode } from "react";
import { OBJECTS, type ObjectId } from "../data/objects";
import type { NoteId, Room, Status } from "../data/model";
import { NOTES, progress } from "../data/content";
import { useT } from "../i18n";
import { Icon, type IconName } from "./Icon";

const BASE = import.meta.env.BASE_URL;

/** A U2 object image (Amr's set). Falls back to an emoji if the PNG is missing. */
export function Obj({ id, size = 48, alt = "" }: { id: ObjectId; size?: number; alt?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <span className="obj-fallback" style={{ fontSize: size * 0.6, width: size, height: size }} aria-hidden={!alt}>{OBJECTS[id]}</span>;
  }
  return <img className="obj" src={`${BASE}objects/${id}.png`} width={size} height={size} alt={alt} onError={() => setBroken(true)} draggable={false} />;
}

export const STATUS_ICON: Record<Status, IconName> = {
  to_clean: "circle", cleaning: "sparkle", to_inspect: "search", ready: "check", needs_fix: "wrench", dnd: "ban",
};

export function statusWord(t: ReturnType<typeof useT>, r: Pick<Room, "status" | "dndReason">) {
  if (r.status === "dnd" && r.dndReason === "refused") return t("status.refused");
  return t("status." + r.status);
}

/** Stationery label: small tracked caps with a brass hairline. */
export function Eyebrow({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="eyebrow">
      <span>{children}</span>
      <span className="eyebrow-rule" aria-hidden />
      {action}
    </div>
  );
}

/** KEY TAG: the room number on a grand-hotel key fob with a brass ring. Fob colour + icon + word = status. */
export function KeyTag({ room, size = "m" }: { room: Room; size?: "s" | "m" | "l" }) {
  const t = useT();
  const urgent = room.urgent && room.status !== "ready" && room.status !== "to_inspect";
  return (
    <div className={`keytag keytag-${size} st-${room.status}`} aria-label={`${room.no} · ${statusWord(t, room)}`}>
      <span className="keytag-ring" aria-hidden />
      <span className="keytag-no">{room.no}</span>
      {size !== "s" ? (
        <span className="keytag-status"><Icon name={STATUS_ICON[room.status]} size={12} stroke={2.2} /> {statusWord(t, room)}</span>
      ) : (
        <span className="keytag-dot"><Icon name={STATUS_ICON[room.status]} size={11} stroke={2.4} /></span>
      )}
      {urgent && <span className="keytag-urgent" title={t("tag.urgent")}><Icon name="bolt" size={12} fill stroke={0} /></span>}
    </div>
  );
}

export function NoteChip({ id, onClick, big }: { id: NoteId; onClick?: () => void; big?: boolean }) {
  const t = useT();
  const n = NOTES[id];
  const inner = (
    <>
      <span className="note-ic">
        {n.object ? <Obj id={n.object} size={big ? 36 : 20} /> : <span className="note-emoji" aria-hidden>{n.emoji}</span>}
        {id === "no-alcohol" && <span className="note-slash" aria-hidden />}
      </span>
      <span>{t(`note.${id}.title`)}</span>
    </>
  );
  return onClick ? (
    <button type="button" className={`note-chip ${big ? "note-chip-big" : ""}`} onClick={onClick}>
      {inner}{big && <Icon name="info" size={14} className="note-info" />}
    </button>
  ) : (
    <span className="note-chip">{inner}</span>
  );
}

/** Compact guest-note marker for list cards: icon only, purple ring. */
export function NeedDot({ id }: { id: NoteId }) {
  const n = NOTES[id];
  return (
    <span className="need-dot">
      {n.object ? <Obj id={n.object} size={16} /> : <span aria-hidden>{n.emoji}</span>}
      {id === "no-alcohol" && <span className="note-slash" aria-hidden />}
    </span>
  );
}

/** GUEST NEEDS: a section under the room card. Guest notes (purple, tap for the why) + things to bring. */
export function GuestNeeds({ room, onNote }: { room: Room; onNote: (id: NoteId) => void }) {
  const t = useT();
  if (room.notes.length === 0 && room.requests.length === 0) return null;
  return (
    <section className="needs">
      {room.notes.length > 0 && (
        <div className="block">
          <Eyebrow>{t("room.notes")}</Eyebrow>
          <div className="card list-card needs-card">
            {room.notes.map((id) => {
              const n = NOTES[id];
              return (
                <button type="button" key={id} className="need-row" onClick={() => onNote(id)}>
                  <span className="need-ic">
                    {n.object ? <Obj id={n.object} size={28} /> : <span aria-hidden>{n.emoji}</span>}
                    {id === "no-alcohol" && <span className="note-slash" aria-hidden />}
                  </span>
                  <span className="need-text">
                    <b>{t(`note.${id}.title`)}</b>
                    <small>{t(`note.${id}.do`)}</small>
                  </span>
                  <Icon name="info" size={16} className="need-more" />
                </button>
              );
            })}
          </div>
        </div>
      )}
      {room.requests.length > 0 && (
        <div className="block">
          <Eyebrow>{t("room.requests")}</Eyebrow>
          <div className="card list-card">
            {room.requests.map((rq) => (
              <div key={rq.item} className="need-row need-row-req">
                <span className="need-ic need-ic-req"><Obj id={rq.item} size={28} /></span>
                <span className="need-text"><b>{t(`obj.${rq.item}`)}</b><small>{t("clean.bring")}</small></span>
                <span className="need-qty">×{rq.qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/** Room type line: "Departure · twin" + VIP / privacy / arrival tags */
export function RoomLine({ room }: { room: Room }) {
  const t = useT();
  return (
    <div className="room-line">
      <span className="room-type">{t(`occ.${room.occ}`)} · {t(`bed.${room.bed}`)}</span>
      {room.vip && <span className="tag tag-vip"><Icon name="star" size={11} fill stroke={0} /> {t("tag.vip")}</span>}
      {room.privacy && <span className="tag"><Icon name="lock" size={11} /> {t("tag.privacy")}</span>}
      {room.longStay && <span className="tag">{t("tag.longStay")}</span>}
      {room.arrival && <span className="tag tag-arrival"><Icon name="clock" size={11} /> {room.arrival === "now" ? t("tag.urgent") : t("tag.arrives", { time: room.arrival })}</span>}
    </div>
  );
}

function nextLine(t: ReturnType<typeof useT>, room: Room) {
  const p = progress(room);
  switch (room.status) {
    case "cleaning": return t("card.next.cleaning", p);
    case "needs_fix": return t("card.next.needs_fix", { n: room.inspection?.failed.filter((f) => !f.fixed).length ?? 0 });
    case "dnd": return t("card.next.dnd", { time: room.retryAt ? hhmm(room.retryAt) : "" });
    default: return t(`card.next.${room.status}`);
  }
}

/** Room card: key tag + type line + purple guest-note chips + one line that says what comes next.
 *  Ready / Needs a fix get the inspector's stamp; DND gets the door hanger. */
export function RoomCard({ room, onClick, hero }: { room: Room; onClick?: () => void; hero?: boolean }) {
  const t = useT();
  const p = progress(room);
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className={`room-card ${hero ? "room-card-hero" : ""} ${room.urgent && room.status !== "ready" ? "is-urgent" : ""}`} onClick={onClick}>
      <KeyTag room={room} size={hero ? "l" : "m"} />
      <div className="room-card-body">
        <RoomLine room={room} />
        {!hero && (room.notes.length > 0 || room.requests.length > 0) && (
          <div className="need-dots" aria-label={room.notes.map((n) => t(`note.${n}.title`)).join(", ")}>
            {room.notes.map((n) => <NeedDot key={n} id={n} />)}
            {room.requests.map((rq) => <span key={rq.item} className="need-dot need-dot-req"><Obj id={rq.item} size={16} /><b>{rq.qty}</b></span>)}
          </div>
        )}
        {room.status === "cleaning" && <Progress done={p.done} total={p.total} small />}
        <div className="room-next">{nextLine(t, room)}{onClick && <Icon name="next" size={14} className="flip-rtl" />}</div>
      </div>
      {(room.status === "ready" || room.status === "needs_fix") && (
        <span className={`stamp stamp-${room.status}`}>{t(`stamp.${room.status}`)}</span>
      )}
      {room.status === "dnd" && (
        <span className="hanger"><span className="hanger-hole" /><b>{room.dndReason === "refused" ? <Icon name="hand" size={14} /> : "DND"}</b></span>
      )}
    </Tag>
  );
}

export function Progress({ done, total, small }: { done: number; total: number; small?: boolean }) {
  return (
    <div className={`progress ${small ? "progress-s" : ""}`} role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? "on" : ""} />)}
    </div>
  );
}

/** Object tile: U2 image on a tinted tile · state = tile colour + corner badge + word. */
export function ObjectTile({ object, label, state, onClick, badge }: {
  object: ObjectId; label: string; state: "todo" | "done" | "fix"; onClick?: () => void; badge?: ReactNode;
}) {
  return (
    <button type="button" className={`otile otile-${state}`} onClick={onClick} aria-pressed={state === "done"}>
      <span className="otile-badge" aria-hidden>
        {badge ?? (state === "done" ? <Icon name="check" size={12} stroke={3} /> : state === "fix" ? <Icon name="wrench" size={12} /> : null)}
      </span>
      <span className="otile-img"><Obj id={object} size={52} /></span>
      <span className="otile-label">{label}</span>
    </button>
  );
}

export function Sheet({ open, onClose, children, title, tone }: { open: boolean; onClose: () => void; children: ReactNode; title?: ReactNode; tone?: "note" }) {
  const t = useT();
  if (!open) return null;
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className={`sheet ${tone ? "sheet-" + tone : ""}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" aria-hidden />
        <div className="sheet-head">
          <div className="sheet-title">{title}</div>
          <button type="button" className="icon-btn icon-btn-plain" onClick={onClose} aria-label={t("common.close")}><Icon name="close" size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BottomBar({ children }: { children: ReactNode }) {
  return <div className="bottom-bar">{children}</div>;
}

export function hhmm(ms: number) {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
