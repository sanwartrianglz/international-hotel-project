import { useEffect, useRef, useState, type ReactNode } from "react";
import { useApp } from "../store";
import { LANGS, useT, speak, translate } from "../i18n";
import { Icon } from "../components/Icon";
import { Eyebrow, KeyTag, Obj, ObjectTile, Progress } from "../components/ui";
import type { Room } from "../data/model";

/** SPLASH: navy, a brass ring draws around the Cecil "C", then the wordmark. ~1.6 s, every app open. */
export function Splash() {
  const t = useT();
  const endSplash = useApp((s) => s.endSplash);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(endSplash, reduce ? 600 : 1700);
    return () => clearTimeout(id);
  }, [endSplash]);
  return (
    <div className="splash" onClick={endSplash} role="img" aria-label="Cecil Hotel · Housekeeping">
      <img className="splash-logo" src={`${import.meta.env.BASE_URL}brand/logo.webp`} alt="" />
      <div className="splash-rule" aria-hidden />
      <div className="splash-tag">{t("splash.tag")}</div>
    </div>
  );
}

const demoRoom = (p: Partial<Room> & Pick<Room, "no">): Room => ({
  floor: 4, bed: "twin", occ: "departure", status: "to_clean", notes: [], requests: [], done: {}, minibar: {}, ...p,
});

/** Slide pictures, built from the app's real components so onboarding looks like the app. */
const ART: Record<number, () => ReactNode> = {
  1: () => (
    <div className="onb-art onb-art-rooms">
      <KeyTag room={demoRoom({ no: "412", urgent: true })} size="l" />
      <div className="onb-then">
        {["415", "417", "423"].map((no) => <KeyTag key={no} room={demoRoom({ no })} size="s" />)}
      </div>
    </div>
  ),
  2: () => (
    <div className="onb-art">
      <div className="onb-tiles">
        <ObjectTile object="bed" label="" state="done" />
        <ObjectTile object="bathtub" label="" state="done" />
        <ObjectTile object="towels" label="" state="todo" />
      </div>
      <div className="onb-progress"><Progress done={2} total={3} /></div>
    </div>
  ),
  3: () => (
    <div className="onb-art">
      <div className="card list-card needs-card onb-notes">
        {(["prayer-mat", "shoes-off"] as const).map((id) => (
          <div key={id} className="need-row">
            <span className="need-ic"><Obj id={id} size={28} /></span>
            <span className="need-text"><b className="onb-line" /><small className="onb-line onb-line-s" /></span>
            <Icon name="info" size={16} className="need-more" />
          </div>
        ))}
      </div>
    </div>
  ),
  4: () => (
    <div className="onb-art onb-art-help">
      <div className="onb-bubble"><Obj id="towels" size={26} /><span className="onb-line onb-line-light" /><small>✓✓</small></div>
      <div className="onb-help-row">
        <span className="onb-help onb-help-chat"><Icon name="chat" size={22} /></span>
        <span className="onb-help onb-help-sos"><Icon name="help" size={24} /></span>
        <span className="onb-help onb-help-off"><Icon name="cloudOff" size={22} /></span>
      </div>
    </div>
  ),
};

const SLIDES = [1, 2, 3, 4];

/** ONBOARDING: first run only. Language first (asked in every language), then 4 picture-first slides. */
export function Onboarding() {
  const t = useT();
  const { lang, setLang, finishOnboarding } = useApp();
  const [step, setStep] = useState(0); // 0 = language
  const startX = useRef<number | null>(null);
  const rtl = LANGS.find((l) => l.id === lang)?.dir === "rtl";
  const last = step === SLIDES.length;
  const next = () => (last ? finishOnboarding() : setStep((s) => s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const onDown = (e: React.PointerEvent) => { startX.current = e.clientX; };
  const onUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 50) return;
    const forward = rtl ? dx > 0 : dx < 0;
    if (forward) { if (!last) next(); } else prev();
  };

  return (
    <div className="screen onb" onPointerDown={onDown} onPointerUp={onUp}>
      <div className="onb-top">
        {step > 0 ? (
          <button type="button" className="icon-btn icon-btn-plain" onClick={prev} aria-label={t("common.back")}><Icon name="back" className="flip-rtl" /></button>
        ) : <span />}
        {step > 0 && !last && <button type="button" className="link-btn" onClick={finishOnboarding}>{t("onb.skip")}</button>}
      </div>

      {step === 0 ? (
        <div className="onb-body" key="lang">
          <div className="onb-crest" aria-hidden><img src={`${import.meta.env.BASE_URL}brand/mark.webp`} alt="" /></div>
          <Eyebrow>{t("onb.welcome")}</Eyebrow>
          <h1 className="display onb-title">
            {LANGS.map((l) => <span key={l.id} lang={l.id} dir={l.dir} className={l.id === lang ? "on" : ""}>{translate(l.id, "onb.lang.title")}</span>)}
          </h1>
          <div className="onb-langs" role="radiogroup">
            {LANGS.map((l) => (
              <button type="button" key={l.id} role="radio" aria-checked={lang === l.id} lang={l.id} dir={l.dir}
                className={`onb-lang ${lang === l.id ? "on" : ""}`} onClick={() => setLang(l.id)}>
                <span className="onb-lang-name">{l.label}</span>
                <span className="onb-lang-hello">{translate(l.id, "greet.morning", { name: "Joy" })}</span>
                <span className="onb-lang-check">{lang === l.id && <Icon name="check" size={14} stroke={3} />}</span>
              </button>
            ))}
          </div>
          <p className="muted small">{t("onb.lang.sub")}</p>
        </div>
      ) : (
        <div className="onb-body onb-slide" key={step}>
          {ART[step]()}
          <h1 className="display onb-title">{t(`onb.${step}.title`)}</h1>
          <p className="onb-text">{t(`onb.${step}.body`)}</p>
          <button type="button" className="onb-listen" onClick={() => speak(`${t(`onb.${step}.title`)}. ${t(`onb.${step}.body`)}`, lang)}>
            <Icon name="volume" size={16} /> {t("clean.listen")}
          </button>
        </div>
      )}

      <div className="onb-foot">
        <div className="onb-dots" aria-hidden>
          {[0, ...SLIDES].map((i) => <span key={i} className={i === step ? "on" : ""} />)}
        </div>
        <button type="button" className="btn btn-primary" onClick={next}>
          {last ? t("onb.start") : t("onb.next")} <Icon name="next" size={16} className="flip-rtl" />
        </button>
      </div>
    </div>
  );
}
