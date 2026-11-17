import { useState, type ReactNode } from "react";
import { OBJECTS, type ObjectId } from "../data/objects";
import type { NoteId, Room, Status } from "../data/model";
import { NOTES, progress } from "../data/content";
import { useT } from "../i18n";

const BASE = import.meta.env.BASE_URL;

/** A U2 object image (Amr's set). Falls back to an emoji if the PNG is missing. */
export function Obj({ id, size = 56, alt = "" }: { id: ObjectId; size?: number; alt?: string }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return <span className="obj-fallback" style={{ fontSize: size * 0.62, width: size, height: size }} aria-hidden={!alt}>{OBJECTS[id]}</span>;
  }
  return <img className="obj" src={`${BASE}objects/${id}.png`} width={size} height={size} alt={alt} onError={() => setBroken(true)} draggable={false} />;
}

export const STATUS_ICON: Record<Status, string> = {
  to_clean: "○", cleaning: "🧹", to_inspect: "🔍", ready: "✓", needs_fix: "🔧", dnd: "🚫",
};

export function statusWord(t: ReturnType<typeof useT>, r: Pick<Room, "status" | "dndReason">) {
  if (r.status === "dnd" && r.dndReason === "refused") return t("status.refused");
  return t("status." + r.status);
}

/** KEY TAG: the room number on a grand-hotel key fob. Fob colour + icon + word = status. */
export function KeyTag({ room, size = "m" }: { room: Room; size?: "s" | "m" | "l" }) {
  const t = useT();
  return (
    <div className={`keytag keytag-${size} st-${room.status}`} aria-label={`${room.no} · ${statusWord(t, room)}`}>
      <span className="keytag-hole" aria-hidden />
      <span className="keytag-no">{room.no}</span>
      <span className="keytag-status"><span aria-hidden>{STATUS_ICON[room.status]}</span> {statusWord(t, room)}</span>
      {room.urgent && room.status !== "ready" && room.status !== "to_inspect" && (
        <span className="keytag-urgent" title={t("tag.urgent")}>⚡</span>
      )}
    </div>
  );
}

export function NoteChip({ id, onClick, big }: { id: NoteId; onClick?: () => void; big?: boolean }) {
  const t = useT();
  const n = NOTES[id];
  const inner = (
    <>
      {n.object ? <Obj id={n.object} size={big ? 44 : 28} /> : <span className="note-emoji" aria-hidden>{n.emoji}</span>}
      {id === "no-alcohol" && <span className="note-slash" aria-hidden />}
      <span>{t(`note.${id}.title`)}</span>
    </>
  );
  return onClick ? (
    <button type="button" className={`note-chip ${big ? "note-chip-big" : ""}`} onClick={onClick}>{inner}</button>
  ) : (
    <span className="note-chip">{inner}</span>
  );
}

/** Room type line: "Departure · twin · ⭐ VIP" */
export function RoomLine({ room }: { room: Room }) {
  const t = useT();
  const bits = [t(`occ.${room.occ}`), t(`bed.${room.bed}`)];
  return (
    <div className="room-line">
      <span>{bits.join(" · ")}</span>
      {room.vip && <span className="tag tag-vip">⭐ {t("tag.vip")}</span>}
      {room.privacy && <span className="tag tag-privacy">🔒 {t("tag.privacy")}</span>}
      {room.longStay && <span className="tag">{t("tag.longStay")}</span>}
      {room.arrival && <span className="tag tag-arrival">🕑 {t("tag.arrives", { time: room.arrival === "now" ? "⚡" : room.arrival })}</span>}
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
        {room.notes.length > 0 && (
          <div className="note-row">{room.notes.map((n) => <NoteChip key={n} id={n} />)}</div>
        )}
        {room.requests.length > 0 && (
          <div className="req-row">
            {room.requests.map((rq) => (
              <span key={rq.item} className="req-chip"><Obj id={rq.item} size={26} /> ×{rq.qty}</span>
            ))}
          </div>
        )}
        {room.status === "cleaning" && <Progress done={p.done} total={p.total} small />}
        <div className="room-next">{nextLine(t, room)}</div>
      </div>
      {(room.status === "ready" || room.status === "needs_fix") && (
        <span className={`stamp stamp-${room.status}`}>{room.status === "ready" ? "✓ " : "🔧 "}{t(`stamp.${room.status}`)}</span>
      )}
      {room.status === "dnd" && <span className="hanger"><span className="hanger-hole" />🚫<b>{room.dndReason === "refused" ? "✋" : "DND"}</b></span>}
    </Tag>
  );
}

export function Progress({ done, total, small }: { done: number; total: number; small?: boolean }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className={`progress ${small ? "progress-s" : ""}`} role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total}>
      <div className="progress-fill" style={{ inlineSize: pct + "%" }} />
      <div className="progress-steps">
        {Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? "on" : ""} />)}
      </div>
    </div>
  );
}

/** Object tile: U2 image on a tinted tile · state = tile colour + corner badge + word. 120 × 150 tap target. */
export function ObjectTile({ object, label, state, onClick, badge }: {
  object: ObjectId; label: string; state: "todo" | "done" | "fix"; onClick?: () => void; badge?: ReactNode;
}) {
  const t = useT();
  return (
    <button type="button" className={`otile otile-${state}`} onClick={onClick} aria-pressed={state === "done"}>
      <span className="otile-badge" aria-hidden>{badge ?? (state === "done" ? "✓" : state === "fix" ? "🔧" : "")}</span>
      <Obj id={object} size={72} />
      <span className="otile-label">{label}</span>
      <span className="otile-state">{state === "done" ? t("clean.done") : state === "fix" ? t("status.needs_fix") : ""}</span>
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
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t("common.close")}>✕</button>
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
