import type { Room } from "./model";

/** Mock PMS (e.g. OPERA) feed for Joy's shift: Cairo property, floor 4, 14 rooms.
 *  Matches the "A day for Joy" scenario on the FigJam board. */
const base = { floor: 4, notes: [], requests: [], done: {}, minibar: {} } as const;

export function seedRooms(): Room[] {
  const r = (p: Partial<Room> & Pick<Room, "no" | "bed" | "occ">): Room => ({
    status: "to_clean", ...base, notes: [], requests: [], done: {}, minibar: {}, ...p,
  });
  return [
    r({ no: "412", bed: "twin", occ: "departure", vip: true, arrival: "13:00",
        notes: ["prayer-mat", "no-alcohol", "female-staff"], requests: [{ item: "pillows", qty: 2 }] }),
    r({ no: "415", bed: "king", occ: "departure", arrival: "15:00", notes: ["shoes-off"] }),
    r({ no: "410", bed: "double", occ: "stayover", requests: [{ item: "crib", qty: 1 }] }),
    r({ no: "411", bed: "king", occ: "stayover", privacy: true }),
    r({ no: "413", bed: "twin", occ: "departure" }),
    r({ no: "414", bed: "king", occ: "stayover", longStay: true, notes: ["quiet"] }),
    r({ no: "416", bed: "double", occ: "stayover", notes: ["prayer-mat"] }),
    r({ no: "417", bed: "twin", occ: "departure", arrival: "16:00" }),
    r({ no: "418", bed: "king", occ: "departure", notes: ["service-dog"] }),
    r({ no: "419", bed: "double", occ: "vacant" }),
    r({ no: "420", bed: "king", occ: "stayover", status: "dnd", dndReason: "dnd" }),
    r({ no: "421", bed: "twin", occ: "stayover", requests: [{ item: "towels", qty: 2 }] }),
    r({ no: "422", bed: "double", occ: "departure", notes: ["no-alcohol"] }),
    r({ no: "423", bed: "king", occ: "stayover", vip: true }),
  ];
}

export const STAFF = [
  { id: "joy", name: "Joy", from: "🇵🇭", lang: "fil" as const, pin: "1234" },
  { id: "amina", name: "Amina", from: "🇪🇬", lang: "ar" as const, pin: "1234" },
  { id: "ravi", name: "Ravi", from: "🇮🇳", lang: "en" as const, pin: "1234" },
];

export const SUPERVISOR = "Mona";
