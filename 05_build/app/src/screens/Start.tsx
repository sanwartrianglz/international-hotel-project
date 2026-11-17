import { useState } from "react";
import { useApp, me } from "../store";
import { LANGS, useT } from "../i18n";
import { STAFF, SUPERVISOR } from "../data/seed";
import { Obj, BottomBar } from "../components/ui";

export function LangPicker() {
  const { lang, setLang } = useApp();
  return (
    <div className="lang-picker" role="radiogroup">
      {LANGS.map((l) => (
        <button type="button" key={l.id} role="radio" aria-checked={lang === l.id} className={lang === l.id ? "on" : ""} onClick={() => setLang(l.id)} lang={l.id}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** F1 · Fast login: own phone stays signed in → face unlock; cart tablet → pick yourself + PIN. */
export function Login() {
  const t = useT();
  const login = useApp((s) => s.login);
  const [device, setDevice] = useState<"phone" | "tablet" | null>(null);
  const [who, setWho] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [scanning, setScanning] = useState(false);

  const face = () => { setScanning(true); setTimeout(() => login("phone", "joy"), 1200); };
  const press = (d: string) => {
    if (d === "⌫") { setPin((p) => p.slice(0, -1)); return; }
    const next = (pin + d).slice(0, 4);
    setPin(next); setErr(false);
    if (next.length === 4) {
      const ok = STAFF.find((p) => p.id === who)?.pin === next;
      if (ok) setTimeout(() => login("tablet", who!), 200);
      else setTimeout(() => { setErr(true); setPin(""); }, 250);
    }
  };

  return (
    <div className="screen start-screen">
      <div className="brand">
        <div className="brand-mark"><Obj id="key-card" size={56} /></div>
        <div>
          <div className="brand-name">{t("app.name")}</div>
          <div className="muted">{t("app.chain")}</div>
        </div>
      </div>
      <LangPicker />

      {!device && (
        <>
          <h1 className="title">{t("login.device")}</h1>
          <div className="device-grid">
            <button type="button" className="device-opt" onClick={() => setDevice("phone")}>
              <span className="big-emoji">📱</span><b>{t("login.ownPhone")}</b><span className="muted">{t("login.ownPhoneSub")}</span>
            </button>
            <button type="button" className="device-opt" onClick={() => setDevice("tablet")}>
              <Obj id="cart" size={64} /><b>{t("login.cartTablet")}</b><span className="muted">{t("login.cartTabletSub")}</span>
            </button>
          </div>
        </>
      )}

      {device === "phone" && (
        <div className="face-wrap">
          <div className="avatar avatar-xl">{STAFF[0].from}</div>
          <h1 className="title">{t("greet.morning", { name: STAFF[0].name })}</h1>
          <button type="button" className={`face-btn ${scanning ? "scanning" : ""}`} onClick={face} aria-label={t("login.face")}>
            <span>🙂</span>
          </button>
          <div className="muted">{scanning ? t("login.unlocking") : t("login.face")}</div>
          <button type="button" className="link-btn" onClick={() => setDevice(null)}>← {t("common.back")}</button>
        </div>
      )}

      {device === "tablet" && !who && (
        <>
          <h1 className="title">{t("login.who")}</h1>
          <div className="who-grid">
            {STAFF.map((p) => (
              <button type="button" key={p.id} className="who-opt" onClick={() => setWho(p.id)}>
                <span className="avatar">{p.from}</span><b>{p.name}</b>
              </button>
            ))}
          </div>
          <button type="button" className="link-btn" onClick={() => setDevice(null)}>← {t("common.back")}</button>
        </>
      )}

      {device === "tablet" && who && (
        <div className="pin-wrap">
          <div className="avatar">{STAFF.find((p) => p.id === who)?.from}</div>
          <h1 className="title">{t("login.pin")}</h1>
          <div className={`pin-dots ${err ? "shake" : ""}`} dir="ltr">
            {[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? "on" : ""} />)}
          </div>
          <div className="muted">{err ? t("login.wrongPin") : t("login.demoPin")}</div>
          <div className="pin-pad" dir="ltr">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
              d ? <button type="button" key={i} onClick={() => press(d)}>{d}</button> : <span key={i} />,
            )}
          </div>
          <button type="button" className="link-btn" onClick={() => { setWho(null); setPin(""); }}>← {t("common.back")}</button>
        </div>
      )}
    </div>
  );
}

/** Shift briefing (icons + short text) → Start shift. */
export function Briefing() {
  const t = useT();
  const s = useApp();
  const person = me(s);
  const items = [
    { icon: <Obj id="vip" size={44} />, key: "brief.vip" },
    { icon: <span className="big-emoji">🕑</span>, key: "brief.arrivals" },
    { icon: <span className="big-emoji">🛗</span>, key: "brief.lift" },
    { icon: <Obj id="towels" size={44} />, key: "brief.linen" },
  ];
  return (
    <div className="screen">
      <div className="screen-body">
        <div className="greet">
          <div className="avatar">{person.from}</div>
          <div>
            <h1 className="title">{t("greet.morning", { name: person.name })}</h1>
            <div className="muted">{t("shift.time")}</div>
          </div>
        </div>

        <div className="shift-hero">
          <div className="shift-floor">4</div>
          <div>
            <div className="shift-hero-big">{t("shift.floor", { floor: 4, n: s.rooms.length })}</div>
            <div className="muted">{t("app.chain")}</div>
          </div>
        </div>

        <h2 className="section-title"><Obj id="clipboard" size={32} /> {t("brief.title")}</h2>
        <div className="muted small">{t("brief.from", { name: SUPERVISOR })}</div>
        <ul className="brief-list">
          {items.map((it) => (
            <li key={it.key}>{it.icon}<span>{t(it.key)}</span></li>
          ))}
        </ul>
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" onClick={s.startShift}>▶ {t("shift.start")}</button>
      </BottomBar>
    </div>
  );
}
