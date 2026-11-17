import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { useApp } from "../store";
import { LANGS } from "../i18n";

/** iPhone 15 Pro: 393 × 852 pt screen, 12 pt titanium bezel. */
const SCREEN_W = 393;
const SCREEN_H = 852;
const BEZEL = 12;
const FRAME_H = SCREEN_H + BEZEL * 2;

/** On a desktop-size window the app is shown inside an iPhone mockup (for reviews and presentations).
 *  On a real phone, or with ?frame=off, it runs full-screen. */
function useFramed() {
  const query = "(min-width: 600px) and (min-height: 560px)";
  const param = new URLSearchParams(location.search).get("frame");
  const off = param === "off";
  const force = param === "on";
  const [framed, setFramed] = useState(() => force || (!off && matchMedia(query).matches));
  useEffect(() => {
    if (off || force) return;
    const mq = matchMedia(query);
    const on = () => setFramed(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [off, force]);
  return framed;
}

function useScale() {
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 48) / FRAME_H, (window.innerWidth - 32) / (SCREEN_W + BEZEL * 2)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 10_000); return () => clearInterval(i); }, []);
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function StatusBar({ dark }: { dark: boolean }) {
  const time = useClock();
  const online = useApp((s) => s.online);
  const c = dark ? "#fff" : "#1e293b";
  return (
    <div className={`ios-status ${dark ? "ios-status-dark" : ""}`} aria-hidden>
      <span className="ios-time">{time}</span>
      <span className="ios-icons">
        {/* signal: bars go empty when the demo simulates "no signal" */}
        <svg width="18" height="12" viewBox="0 0 18 12">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 5} y={9 - i * 3} width="3.2" height={3 + i * 3} rx="1" fill={c} opacity={online ? 1 : i === 0 ? 0.9 : 0.25} />
          ))}
        </svg>
        {online && (
          <svg width="16" height="12" viewBox="0 0 16 12">
            <path d="M8 11.2 5.6 8.8a3.4 3.4 0 0 1 4.8 0L8 11.2Z" fill={c} />
            <path d="M3.3 6.6a6.6 6.6 0 0 1 9.4 0l-1.2 1.2a5 5 0 0 0-7 0L3.3 6.6Z" fill={c} />
            <path d="M1 4.3a9.9 9.9 0 0 1 14 0l-1.2 1.2a8.2 8.2 0 0 0-11.6 0L1 4.3Z" fill={c} />
          </svg>
        )}
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke={c} opacity="0.4" />
          <rect x="2" y="2" width="17" height="9" rx="2.4" fill={c} />
          <path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill={c} opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

export function DeviceFrame({ children }: { children: ReactNode }) {
  const framed = useFramed();
  const scale = useScale();
  const dark = useApp((s) => !!s.onBreak && s.phase === "shift");
  const dir = useApp((s) => LANGS.find((l) => l.id === s.lang)?.dir ?? "ltr");

  useEffect(() => {
    document.documentElement.classList.toggle("is-framed", framed);
  }, [framed]);

  if (!framed) return <>{children}</>;

  return (
    <div className="mock-stage" dir="ltr">
      <div className="mock-slot" style={{ width: (SCREEN_W + BEZEL * 2) * scale, height: FRAME_H * scale }}>
        <div className="iphone" style={{ transform: `scale(${scale})` }}>
          <span className="iphone-btn iphone-btn-action" />
          <span className="iphone-btn iphone-btn-vol-up" />
          <span className="iphone-btn iphone-btn-vol-down" />
          <span className="iphone-btn iphone-btn-power" />
          <div className="iphone-screen">
            <StatusBar dark={dark} />
            <div className="iphone-island" />
            <div className="iphone-content" id="app-scroll" dir={dir}>{children}</div>
            <div className={`iphone-home ${dark ? "iphone-home-light" : ""}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
