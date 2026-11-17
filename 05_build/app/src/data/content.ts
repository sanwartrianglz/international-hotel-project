import type { AreaId, NoteId, Room } from "./model";
import type { ObjectId } from "./objects";

/** Checklist areas: each is one big object tile. Sub-steps are icon + 1–2 words. */
export const AREAS: Record<AreaId, { object: ObjectId; steps: { object: ObjectId; key: string }[] }> = {
  bed:        { object: "bed",        steps: [{ object: "linen", key: "step.sheets" }, { object: "pillows", key: "step.pillows" }, { object: "throw", key: "step.throw" }] },
  bathtub:    { object: "bathtub",    steps: [{ object: "bathtub", key: "step.scrub" }, { object: "shower", key: "step.shower" }, { object: "towels", key: "step.towels" }] },
  toilet:     { object: "toilet",     steps: [{ object: "toilet", key: "step.toiletClean" }, { object: "sink", key: "step.sink" }] },
  toiletries: { object: "toiletries", steps: [{ object: "toiletries", key: "step.refill" }, { object: "bathrobe", key: "step.robe" }] },
  bin:        { object: "bin",        steps: [{ object: "bin", key: "step.empty" }, { object: "duster", key: "step.dust" }] },
  window:     { object: "window",     steps: [{ object: "window", key: "step.glass" }, { object: "vacuum", key: "step.vacuum" }] },
  vacuum:     { object: "vacuum",     steps: [{ object: "vacuum", key: "step.vacuum" }] },
  linen:      { object: "linen",      steps: [{ object: "linen", key: "step.sheets" }, { object: "towels", key: "step.towels" }] },
};

/** The right clean for the guest: occupancy (from the PMS) picks the checklist. */
export function areasFor(room: Room): AreaId[] {
  if (room.longStay && room.longStayChoice === "light") return ["bed", "toiletries", "bin"];
  if (room.longStay && room.longStayChoice === "linen") return ["linen", "bed", "bathtub", "toiletries", "bin"];
  if (room.occ === "stayover") return ["bed", "bathtub", "toiletries", "bin"];
  if (room.occ === "vacant") return ["bed", "bathtub", "vacuum"];
  return ["bed", "bathtub", "toilet", "toiletries", "bin", "window"]; // departure: full clean
}

/** Every tickable step id for a room: areas + guest requests + minibar. */
export function stepIds(room: Room): string[] {
  const ids: string[] = areasFor(room);
  room.requests.forEach((r) => ids.push("req:" + r.item));
  if (room.occ !== "vacant") ids.push("minibar");
  return ids;
}

export function progress(room: Room) {
  const ids = stepIds(room);
  const done = ids.filter((id) => room.done[id]).length;
  return { done, total: ids.length };
}

/** Guest culture notes. They come from the guest's own request / profile in the PMS,
 *  never guessed from nationality or religion. */
export const NOTES: Record<NoteId, { object: ObjectId | null; emoji: string }> = {
  "prayer-mat":   { object: "prayer-mat", emoji: "🕌" },
  "no-alcohol":   { object: "wine", emoji: "🚫🍷" },
  "female-staff": { object: "female-staff", emoji: "👩" },
  "shoes-off":    { object: "shoes-off", emoji: "👞" },
  quiet:          { object: "quiet", emoji: "🤫" },
  "service-dog":  { object: "service-dog", emoji: "🐕" },
};

/** Issue icon grid: what can break in a room. */
export const ISSUE_OBJECTS: ObjectId[] = [
  "ac", "light", "tap-leak", "tv", "door-lock", "socket", "safe", "furniture", "window", "minibar", "toilet", "key-card",
];

export const MINIBAR_ITEMS: ObjectId[] = ["water", "soft-drink", "snack", "coffee-pods", "wine"];

/** Pre-set messages to the supervisor (Salma's sketch): one tap = one message. */
export const PRESET_MESSAGES: { key: string; object?: ObjectId; emoji?: string }[] = [
  { key: "msg.towels", object: "towels" },
  { key: "msg.doneEarly", object: "all-done" },
  { key: "msg.late", object: "clock" },
  { key: "msg.guestNo", object: "dnd" },
  { key: "msg.key", object: "key-card" },
  { key: "msg.amenities", object: "toiletries" },
];

/** Supervisor's pre-set replies: same words in every language. */
export const SUPERVISOR_REPLIES = [
  { key: "reply.coming", emoji: "👍" },
  { key: "reply.onMyWay", emoji: "👀" },
  { key: "reply.done", emoji: "✅" },
  { key: "reply.thanks", emoji: "⭐" },
];
