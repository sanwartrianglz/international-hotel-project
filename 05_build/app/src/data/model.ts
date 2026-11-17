import type { ObjectId } from "./objects";

// Words follow Amr's tone-of-voice word list: To clean · Cleaning · To inspect · Ready · Needs a fix · DND.
export type Status = "to_clean" | "cleaning" | "to_inspect" | "ready" | "needs_fix" | "dnd";

/** What the guest is doing today: decides which clean the room gets. From the PMS. */
export type Occupancy = "departure" | "stayover" | "vacant";
export type Bed = "king" | "twin" | "double";

export type NoteId =
  | "prayer-mat" | "no-alcohol" | "female-staff" | "shoes-off" | "quiet" | "service-dog";

export type AreaId =
  | "bed" | "bathtub" | "toilet" | "toiletries" | "bin" | "window" | "vacuum" | "linen";

export interface Request { item: ObjectId; qty: number }

export interface FailedItem { area: AreaId; reason: string; fixed: boolean }

export interface Room {
  no: string;
  floor: number;
  bed: Bed;
  occ: Occupancy;
  status: Status;
  vip?: boolean;
  privacy?: boolean;
  longStay?: boolean;
  longStayChoice?: "light" | "linen";
  arrival?: string;          // "14:00": a guest arrives today
  earlyCheckin?: boolean;
  urgent?: boolean;
  notes: NoteId[];
  requests: Request[];
  // work state
  done: Partial<Record<string, boolean>>;  // area or extra id → ticked
  minibar: Partial<Record<ObjectId, number>>;
  dndReason?: "dnd" | "refused";
  retryAt?: number;          // ms epoch: when to try again
  startedAt?: number;
  doneAt?: number;
  inspection?: { score: number; failed: FailedItem[]; at: number };
}

export type IssueKind = "maintenance" | "lost";
export type IssueState = "sent" | "in_progress" | "fixed";

export interface Issue {
  id: string;
  kind: IssueKind;
  room: string;
  object: ObjectId;
  note: string;
  voice?: boolean;
  photo?: string;            // small data URL
  state: IssueState;
  at: number;
  synced: boolean;
}

export interface Message {
  id: string;
  from: "me" | "supervisor";
  key: string;               // pre-set message key (translated on each side)
  object?: ObjectId;
  emoji?: string;
  room?: string;
  at: number;
  seen?: boolean;
  synced: boolean;
}

export type HelpKind = "supplies" | "hands" | "safety";
