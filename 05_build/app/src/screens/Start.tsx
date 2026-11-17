import { useState } from "react";
import { useApp, me } from "../store";
import { LANGS, useT } from "../i18n";
import { STAFF, SUPERVISOR } from "../data/seed";
import { Obj, BottomBar, Eyebrow } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";

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

function Crest() {
  const t = useT();
  return (
    <div className="crest">
      <div className="crest-mark" aria-hidden><span className="crest-c">C</span></div>
      <div className="crest-name">CECIL</div>
      <div className="crest-sub">{t("app.chain")}</div>
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
  const backBtn = (fn: () => void) => (
    <button type="button" className="link-btn" onClick={fn}><Icon name="back" size={16} className="flip-rtl" /> {t("common.back")}</button>
  );

  return (
    <div className="screen start-screen">
      <Crest />
      <LangPicker />

      {!device && (
        <div className="start-block">
          <Eyebrow>{t("login.device")}</Eyebrow>
          <div className="device-grid">
            {([["phone", "phone", "login.ownPhone", "login.ownPhoneSub"], ["tablet", "tablet", "login.cartTablet", "login.cartTabletSub"]] as const).map(([id, ic, a, b]) => (
              <button type="button" key={id} className="device-opt" onClick={() => setDevice(id)}>
                <span className="device-ic"><Icon name={ic as IconName} size={24} /></span>
                <b>{t(a)}</b><span className="muted small">{t(b)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {device === "phone" && (
        <div className="face-wrap">
          <div className="avatar avatar-l">{STAFF[0].name[0]}</div>
          <h1 className="display">{t("greet.morning", { name: STAFF[0].name })}</h1>
          <button type="button" className={`face-btn ${scanning ? "scanning" : ""}`} onClick={face} aria-label={t("login.face")}>
            <Icon name="face" size={44} stroke={1.5} />
          </button>
          <div className="muted small">{scanning ? t("login.unlocking") : t("login.face")}</div>
          {backBtn(() => setDevice(null))}
        </div>
      )}

      {device === "tablet" && !who && (
        <div className="start-block">
          <Eyebrow>{t("login.who")}</Eyebrow>
          <div className="who-grid">
            {STAFF.map((p) => (
              <button type="button" key={p.id} className="who-opt" onClick={() => setWho(p.id)}>
                <span className="avatar">{p.name[0]}</span><b>{p.name}</b>
              </button>
            ))}
          </div>
          {backBtn(() => setDevice(null))}
        </div>
      )}

      {device === "tablet" && who && (
        <div className="pin-wrap">
          <div className="avatar avatar-l">{STAFF.find((p) => p.id === who)?.name[0]}</div>
          <h1 className="display">{t("login.pin")}</h1>
          <div className={`pin-dots ${err ? "shake" : ""}`} dir="ltr">
            {[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? "on" : ""} />)}
          </div>
          <div className={`small ${err ? "error" : "muted"}`}>{err ? t("login.wrongPin") : t("login.demoPin")}</div>
          <div className="pin-pad" dir="ltr">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
              d ? <button type="button" key={i} onClick={() => press(d)}>{d}</button> : <span key={i} />,
            )}
          </div>
          {backBtn(() => { setWho(null); setPin(""); })}
        </div>
      )}
    </div>
  );
}

/** Shift briefing (icons + short text) → Start shift. Styled like the hotel's daily card. */
export function Briefing() {
  const t = useT();
  const s = useApp();
  const person = me(s);
  const items: { icon: React.ReactNode; key: string }[] = [
    { icon: <Obj id="vip" size={30} />, key: "brief.vip" },
    { icon: <span className="brief-ic"><Icon name="clock" size={18} /></span>, key: "brief.arrivals" },
    { icon: <span className="brief-ic"><Icon name="lift" size={18} /></span>, key: "brief.lift" },
    { icon: <Obj id="towels" size={30} />, key: "brief.linen" },
  ];
  return (
    <div className="screen">
      <div className="screen-body">
        <div className="greet">
          <div className="avatar">{person.name[0]}</div>
          <div>
            <h1 className="display">{t("greet.morning", { name: person.name })}</h1>
            <div className="muted small">{t("shift.time")}</div>
          </div>
        </div>

        <div className="daycard">
          <div className="daycard-floor"><small>FLOOR</small><span>4</span></div>
          <div className="daycard-main">
            <div className="daycard-big">{t("shift.floor", { floor: 4, n: s.rooms.length })}</div>
            <div className="daycard-sub">{t("app.chain")}</div>
          </div>
        </div>

        <Eyebrow>{t("brief.title")}</Eyebrow>
        <div className="card">
          <ul className="brief-list">
            {items.map((it) => (
              <li key={it.key}>{it.icon}<span>{t(it.key)}</span></li>
            ))}
          </ul>
          <div className="signature">— {t("brief.from", { name: SUPERVISOR })}</div>
        </div>
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" onClick={s.startShift}><Icon name="play" size={14} fill stroke={0} /> {t("shift.start")}</button>
      </BottomBar>
    </div>
  );
}
