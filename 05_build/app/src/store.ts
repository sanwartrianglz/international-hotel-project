import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FailedItem, HelpKind, Issue, IssueKind, Message, Room, Status } from "./data/model";
import type { ObjectId } from "./data/objects";
import { seedRooms, STAFF, SUPERVISOR } from "./data/seed";
import { areasFor } from "./data/content";
import type { Lang } from "./i18n";

export type Screen =
  | { name: "home" }
  | { name: "room"; no: string }
  | { name: "clean"; no: string }
  | { name: "done"; no: string }
  | { name: "fix"; no: string }
  | { name: "rooms" }
  | { name: "messages" }
  | { name: "issue"; no?: string }
  | { name: "reports" }
  | { name: "menu" }
  | { name: "end" }
  | { name: "demo" };

export interface Toast { id: number; key: string; vars?: Record<string, string | number>; tone?: "ok" | "info" | "warn" }

interface State {
  lang: Lang;
  onboarded: boolean;          // first-run onboarding seen on this device
  splash: boolean;             // splash screen showing (not persisted)
  phase: "login" | "briefing" | "shift" | "offduty";
  device?: "phone" | "tablet";
  userId?: string;
  screen: Screen;
  rooms: Room[];
  issues: Issue[];
  messages: Message[];
  msgSeenAt: number;
  help?: { kind: HelpKind; room?: string; state: "sent" | "on_the_way"; at: number };
  onBreak?: number;            // break started at
  online: boolean;             // simulated signal (also follows navigator.onLine)
  pending: number;             // changes waiting to sync
  lastSync: number;
  urgentAlert?: string;        // room no. shown as a full alert
  heldAlerts: string[];        // alerts held while on break
  handedOver: string[];
  toasts: Toast[];
}

interface Actions {
  setLang(l: Lang): void;
  endSplash(): void;
  finishOnboarding(): void;
  replayOnboarding(): void;
  login(device: "phone" | "tablet", userId: string): void;
  startShift(): void;
  go(s: Screen): void;
  home(): void;
  // rooms
  setStatus(no: string, status: Status): void;
  startCleaning(no: string): void;
  tick(no: string, stepId: string, value?: boolean): void;
  setMinibar(no: string, item: ObjectId, delta: number): void;
  setLongStay(no: string, choice: "light" | "linen"): void;
  markDnd(no: string, reason: "dnd" | "refused"): void;
  retryNow(no: string): void;
  roomDone(no: string): void;
  fixItem(no: string, idx: number): void;
  sendRecheck(no: string): void;
  // issues, messages, help
  reportIssue(i: { kind: IssueKind; room: string; object: ObjectId; note: string; voice?: boolean; photo?: string }): void;
  sendMessage(key: string, object?: ObjectId, emoji?: string): void;
  markMessagesSeen(): void;
  requestHelp(kind: HelpKind): void;
  clearHelp(): void;
  // break & shift
  startBreak(): void;
  endBreak(): void;
  handOver(): void;
  endShift(): void;
  // system
  setOnline(v: boolean): void;
  dismissUrgent(): void;
  toast(key: string, vars?: Toast["vars"], tone?: Toast["tone"]): void;
  dropToast(id: number): void;
  // demo: what the PMS / reception / supervisor would send
  demoUrgent(no: string): void;
  demoInspect(no: string, pass: boolean): void;
  demoCheckout(no: string): void;
  demoReset(): void;
}

const uid = () => Math.random().toString(36).slice(2, 9);
let toastSeq = 1;

const initial = (): Omit<State, "lang" | "onboarded" | "splash"> => ({
  phase: "login",
  screen: { name: "home" },
  rooms: seedRooms(),
  issues: [],
  messages: [],
  msgSeenAt: 0,
  online: true,
  pending: 0,
  lastSync: Date.now(),
  heldAlerts: [],
  handedOver: [],
  toasts: [],
});

export const useApp = create<State & Actions>()(
  persist(
    (set, get) => {
      /** Every change goes to the PMS. Offline → it waits in the queue (offline-first). */
      const sync = () => {
        if (get().online) set({ lastSync: Date.now() });
        else set((s) => ({ pending: s.pending + 1 }));
      };
      const patch = (no: string, p: Partial<Room> | ((r: Room) => Partial<Room>)) =>
        set((s) => ({
          rooms: s.rooms.map((r) => (r.no === no ? { ...r, ...(typeof p === "function" ? p(r) : p) } : r)),
        }));
      const later = (ms: number, fn: () => void) => window.setTimeout(fn, ms);
      /** Simulated other side: only answers when we are online. */
      const whenOnline = (ms: number, fn: () => void) =>
        later(ms, () => (get().online ? fn() : later(3000, () => whenOnline(0, fn))));

      return {
        lang: "en",
        onboarded: false,
        splash: true,
        ...initial(),

        setLang: (lang) => set({ lang }),
        endSplash: () => set({ splash: false }),
        finishOnboarding: () => set({ onboarded: true }),
        replayOnboarding: () => set({ onboarded: false, splash: true, phase: "login" }),
        login: (device, userId) => {
          const staff = STAFF.find((p) => p.id === userId);
          set({ device, userId, phase: "briefing", lang: get().lang ?? staff?.lang ?? "en" });
        },
        startShift: () => { set({ phase: "shift", screen: { name: "home" } }); sync(); },
        go: (screen) => set({ screen }),
        home: () => set({ screen: { name: "home" } }),

        setStatus: (no, status) => { patch(no, { status }); sync(); },
        startCleaning: (no) => {
          patch(no, (r) => ({ status: "cleaning", startedAt: r.startedAt ?? Date.now(), dndReason: undefined, retryAt: undefined }));
          sync();
          set({ screen: { name: "clean", no } });
        },
        tick: (no, stepId, value) => {
          patch(no, (r) => ({ done: { ...r.done, [stepId]: value ?? !r.done[stepId] } }));
          sync();
        },
        setMinibar: (no, item, delta) => {
          patch(no, (r) => ({ minibar: { ...r.minibar, [item]: Math.max(0, (r.minibar[item] ?? 0) + delta) } }));
        },
        setLongStay: (no, choice) => { patch(no, { longStayChoice: choice, done: {} }); sync(); },
        markDnd: (no, reason) => {
          patch(no, { status: "dnd", dndReason: reason, retryAt: Date.now() + 30 * 60_000 });
          sync();
          set({ screen: { name: "home" } });
          // reminder: in the demo it comes back after 45 s instead of 30 min
          later(45_000, () => {
            const r = get().rooms.find((x) => x.no === no);
            if (r?.status === "dnd") { patch(no, { retryAt: Date.now() }); get().toast("card.next.dnd", { time: no }, "info"); }
          });
        },
        retryNow: (no) => { patch(no, { retryAt: Date.now() }); set({ screen: { name: "room", no } }); },
        roomDone: (no) => {
          patch(no, { status: "to_inspect", doneAt: Date.now(), urgent: false });
          sync();
          set({ screen: { name: "done", no } });
        },
        fixItem: (no, idx) => {
          patch(no, (r) => r.inspection ? {
            inspection: { ...r.inspection, failed: r.inspection.failed.map((f, i) => (i === idx ? { ...f, fixed: !f.fixed } : f)) },
          } : {});
          sync();
        },
        sendRecheck: (no) => {
          patch(no, { status: "to_inspect" });
          sync();
          set({ screen: { name: "home" } });
          get().toast("fix.sentTitle", undefined, "ok");
          // the supervisor re-checks only the failed items
          whenOnline(15_000, () => get().demoInspect(no, true));
        },

        reportIssue: ({ kind, room, object, note, voice, photo }) => {
          const issue: Issue = { id: uid(), kind, room, object, note, voice, photo, state: "sent", at: Date.now(), synced: get().online };
          set((s) => ({ issues: [issue, ...s.issues] }));
          sync();
          if (kind === "maintenance") {
            whenOnline(20_000, () => {
              set((s) => ({ issues: s.issues.map((i) => (i.id === issue.id ? { ...i, state: "in_progress", synced: true } : i)) }));
              get().toast("issue.state.in_progress", undefined, "info");
            });
            whenOnline(60_000, () => {
              set((s) => ({ issues: s.issues.map((i) => (i.id === issue.id ? { ...i, state: "fixed", synced: true } : i)) }));
              get().toast("issue.state.fixed", undefined, "ok");
            });
          }
        },
        sendMessage: (key, object, emoji) => {
          const room = currentRoom(get())?.no;
          const m: Message = { id: uid(), from: "me", key, object, emoji, room, at: Date.now(), synced: get().online };
          set((s) => ({ messages: [...s.messages, m] }));
          sync();
          whenOnline(2500, () => set((s) => ({ messages: s.messages.map((x) => (x.id === m.id ? { ...x, seen: true, synced: true } : x)) })));
          whenOnline(5000, () => {
            const reply = key === "msg.doneEarly" ? { key: "reply.thanks", emoji: "⭐" } : { key: "reply.coming", emoji: "👍" };
            set((s) => ({ messages: [...s.messages, { id: uid(), from: "supervisor", ...reply, at: Date.now(), synced: true }] }));
          });
        },
        markMessagesSeen: () => set({ msgSeenAt: Date.now() }),
        requestHelp: (kind) => {
          const room = currentRoom(get())?.no;
          set({ help: { kind, room, state: "sent", at: Date.now() } });
          get().sendMessage("msg.help." + kind, kind === "supplies" ? "cart" : kind === "safety" ? "first-aid" : undefined, kind === "hands" ? "🙋" : undefined);
          whenOnline(4000, () => set((s) => (s.help ? { help: { ...s.help, state: "on_the_way" } } : {})));
        },
        clearHelp: () => set({ help: undefined }),

        startBreak: () => { set({ onBreak: Date.now() }); sync(); },
        endBreak: () => {
          const held = get().heldAlerts;
          set({ onBreak: undefined, heldAlerts: [], urgentAlert: held[held.length - 1], screen: { name: "home" } });
          sync();
        },
        handOver: () => {
          const dnd = get().rooms.filter((r) => r.status === "dnd").map((r) => r.no);
          set((s) => ({ handedOver: [...s.handedOver, ...dnd] }));
          sync();
        },
        endShift: () => { set({ phase: "offduty", onBreak: undefined, urgentAlert: undefined, help: undefined }); sync(); },

        setOnline: (online) => {
          const wasPending = get().pending;
          set({ online });
          if (online) {
            set((s) => ({
              pending: 0, lastSync: Date.now(),
              issues: s.issues.map((i) => ({ ...i, synced: true })),
              messages: s.messages.map((m) => ({ ...m, synced: true })),
            }));
            if (wasPending > 0) get().toast("mode.synced", undefined, "ok");
          }
        },
        dismissUrgent: () => set({ urgentAlert: undefined }),
        toast: (key, vars, tone = "info") => {
          const id = toastSeq++;
          set((s) => ({ toasts: [...s.toasts, { id, key, vars, tone }] }));
          later(4000, () => get().dropToast(id));
        },
        dropToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

        demoUrgent: (no) => {
          patch(no, (r) => ({ urgent: true, status: r.status === "dnd" ? "to_clean" : r.status, arrival: r.arrival ?? "now" }));
          try { navigator.vibrate?.([200, 100, 200]); } catch { /* not supported */ }
          if (get().onBreak) set((s) => ({ heldAlerts: [...s.heldAlerts, no] }));
          else set({ urgentAlert: no });
        },
        demoInspect: (no, pass) => {
          const r = get().rooms.find((x) => x.no === no);
          if (!r) return;
          if (pass) {
            const score = 92 + Math.floor(Math.random() * 7);
            patch(no, { status: "ready", inspection: { score, failed: [], at: Date.now() } });
            get().toast("fix.passed", { room: no, score }, "ok");
          } else {
            const areas = areasFor(r);
            const failed: FailedItem[] = [
              { area: areas.includes("bathtub") ? "bathtub" : areas[0], reason: "reason.hair", fixed: false },
              { area: "bed", reason: "reason.pillow", fixed: false },
            ];
            patch(no, { status: "needs_fix", inspection: { score: 84, failed, at: Date.now() } });
            get().toast("fix.card", { room: no }, "warn");
          }
        },
        demoCheckout: (no) => { patch(no, { occ: "departure", status: "to_clean", done: {} }); get().toast("occ.departure", undefined, "info"); },
        demoReset: () => set({ ...initial(), phase: get().phase === "login" ? "login" : "briefing" }),
      };
    },
    {
      name: "cecil-hk-v1",
      partialize: (s) => {
        const { toasts: _t, splash: _s, ...rest } = s;
        void _t; void _s;
        return rest;
      },
    },
  ),
);

// ---------- selectors ----------

const occRank = { departure: 0, stayover: 1, vacant: 2 } as const;

/** "My next room": one room at a time, most urgent first:
 *  needs a fix → urgent → the room I'm cleaning → arrivals (earliest) / VIP → departures → stay-overs.
 *  DND rooms come back once their reminder time has passed. */
export function queue(rooms: Room[], now = Date.now()): Room[] {
  const open = rooms.filter(
    (r) => r.status === "needs_fix" || r.status === "to_clean" || r.status === "cleaning" ||
      (r.status === "dnd" && r.retryAt !== undefined && r.retryAt <= now),
  );
  const score = (r: Room) => {
    if (r.status === "needs_fix") return 0;
    if (r.urgent) return 1;
    if (r.status === "cleaning") return 2;
    if (r.status === "dnd") return 9;
    return 3;
  };
  return open.sort((a, b) => {
    const d = score(a) - score(b);
    if (d) return d;
    const aa = a.arrival ?? "99", ba = b.arrival ?? "99";
    if (aa !== ba) return aa < ba ? -1 : 1;
    if (!!a.vip !== !!b.vip) return a.vip ? -1 : 1;
    return occRank[a.occ] - occRank[b.occ] || a.no.localeCompare(b.no);
  });
}

export function currentRoom(s: Pick<State, "rooms" | "screen">): Room | undefined {
  const sc = s.screen;
  if ("no" in sc && sc.no) return s.rooms.find((r) => r.no === sc.no);
  return s.rooms.find((r) => r.status === "cleaning");
}

export function me(s: Pick<State, "userId">) {
  return STAFF.find((p) => p.id === s.userId) ?? STAFF[0];
}

export { SUPERVISOR };
