/** One line-icon family (24 grid, 1.75 stroke) for all controls. Objects stay Amr's U2 images. */
const P: Record<string, string> = {
  menu: "M4 7h16M4 12h16M4 17h10",
  back: "M15 5l-7 7 7 7",
  next: "M9 5l7 7-7 7",
  chat: "M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3v-3H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
  pause: "M9 6v12M15 6v12",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  play: "M8 5.5v13l10-6.5z",
  camera: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  mic: "M12 4a2.5 2.5 0 0 1 2.5 2.5v5a2.5 2.5 0 0 1-5 0v-5A2.5 2.5 0 0 1 12 4zM6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3",
  bolt: "M13 3L5 13.5h6L10 21l8-10.5h-6z",
  close: "M6 6l12 12M18 6L6 18",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4.5l3 2",
  wrench: "M14.5 5.5a4 4 0 0 0 4.9 5L12 18a2.1 2.1 0 1 1-3-3l7.4-7.4a4 4 0 0 0-1.9-2.1z",
  search: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15.5 15.5L20 20",
  ban: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM6.4 6.4l11.2 11.2",
  circle: "M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z",
  sparkle: "M12 3.5l1.8 5 5 1.8-5 1.8-1.8 5-1.8-5-5-1.8 5-1.8zM18.5 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
  send: "M4 12l16-8-6 16-2.5-6.5z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  info: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8h.01",
  volume: "M5 9.5h3l4-3.5v12l-4-3.5H5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  refresh: "M19 8a7.5 7.5 0 1 0 .5 6M19 4v4h-4",
  door: "M7 20V4h10v16M5 20h14M14 12h.01",
  cloudOff: "M4 4l16 16M8 8.5A4 4 0 0 0 7 16.5h9M18.5 15.5A3.5 3.5 0 0 0 17 9a5 5 0 0 0-6.5-3.6",
  flag: "M6 21V4M6 4h11l-2 4 2 4H6",
  list: "M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01",
  globe: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM4 12h16M12 4c2.5 2.7 2.5 13.3 0 16M12 4c-2.5 2.7-2.5 13.3 0 16",
  film: "M5 5h14v14H5zM9 5v14M15 5v14M5 9h4M5 15h4M15 9h4M15 15h4",
  hand: "M8 13V6.5a1.5 1.5 0 0 1 3 0V12M11 11V5a1.5 1.5 0 0 1 3 0v6M14 11V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-.5A5.5 5.5 0 0 1 5.6 17L4 13.5a1.4 1.4 0 0 1 2.4-1.4L8 14",
  user: "M12 4a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM5 20a7 7 0 0 1 14 0",
  phone: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  tablet: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2",
  face: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 10v1M15 10v1M9.5 15a3.5 3.5 0 0 0 5 0",
  lift: "M6 3h12v18H6zM9.5 9.5L12 7l2.5 2.5M9.5 14.5L12 17l2.5-2.5",
  moon: "M18 14.5A7 7 0 0 1 9.5 6a7 7 0 1 0 8.5 8.5z",
  star: "M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z",
  handover: "M4 12h12M12 8l4 4-4 4M20 5v14",
  box: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  clipboard: "M9 3.5h6v3H9zM8 5H6v15.5h12V5h-2M9 11h6M9 15h4",
};

export type IconName = keyof typeof P;

export function Icon({ name, size = 20, stroke = 1.75, className, fill }: { name: IconName; size?: number; stroke?: number; className?: string; fill?: boolean }) {
  return (
    <svg className={`ic ${className ?? ""}`} width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name]} />
    </svg>
  );
}
