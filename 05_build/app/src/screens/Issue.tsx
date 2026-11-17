import { useRef, useState } from "react";
import { useApp } from "../store";
import { useT } from "../i18n";
import { Header } from "../components/chrome";
import { BottomBar, Eyebrow, Obj, hhmm } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { ISSUE_OBJECTS } from "../data/content";
import type { IssueKind } from "../data/model";
import type { ObjectId } from "../data/objects";
import { compressPhoto, startRecording } from "../lib/media";

/** F3 · Report issue: pick icon → photo → required note (type or voice) → send. F3b · Lost & found. */
export function IssueScreen({ no }: { no?: string }) {
  const t = useT();
  const s = useApp();
  const roomNo = no ?? s.rooms.find((r) => r.status === "cleaning")?.no ?? "4";
  const room = s.rooms.find((r) => r.no === roomNo);
  const [kind, setKind] = useState<IssueKind>("maintenance");
  const [object, setObject] = useState<ObjectId | null>(null);
  const [photo, setPhoto] = useState<string | undefined>();
  const [note, setNote] = useState("");
  const [voice, setVoice] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [sent, setSent] = useState(false);
  const [needNote, setNeedNote] = useState(false);
  const stopRef = useRef<null | (() => Promise<string | null>)>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const back = () => (no ? s.go({ name: "clean", no }) : s.home());
  const noPhotos = !!room?.privacy && kind === "maintenance";

  const pickPhoto = async (f?: File) => { if (f) setPhoto(await compressPhoto(f)); };
  const holdStart = async () => { setRecording(true); stopRef.current = await startRecording(); };
  const holdEnd = async () => {
    if (!recording) return;
    setRecording(false);
    const url = (await stopRef.current?.()) ?? "simulated";
    setVoice(url); setNeedNote(false);
  };
  const send = () => {
    if (!note.trim() && !voice) { setNeedNote(true); return; }
    s.reportIssue({ kind, room: roomNo, object: kind === "lost" ? "lost-item" : object!, note: note.trim(), voice: !!voice, photo });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="screen done-screen">
        <div className="screen-body center">
          <div className="seal">{kind === "lost" ? <Obj id="lost-item" size={56} /> : <Icon name="send" size={34} />}</div>
          <h1 className="display">{kind === "lost" ? t("issue.lostSent") : t("issue.sent")}</h1>
          <p className="muted">{kind === "lost" ? t("issue.lostSentSub") : t("issue.sentSub")}</p>
          {!s.online && <p className="banner banner-offline"><Icon name="cloudOff" size={16} /> {t("mode.offline")}</p>}
        </div>
        <BottomBar><button type="button" className="btn btn-primary" onClick={back}>{no ? t("home.continue", { room: no }) : t("common.back")}</button></BottomBar>
      </div>
    );
  }

  const ready = kind === "lost" || object;
  return (
    <div className="screen">
      <Header title={t("issue.title")} sub={roomNo} back={back} />
      <div className="screen-body">
        <div className="seg">
          <button type="button" className={kind === "maintenance" ? "on" : ""} onClick={() => setKind("maintenance")}><Icon name="wrench" size={18} /> {t("issue.kind.maintenance")}</button>
          <button type="button" className={kind === "lost" ? "on" : ""} onClick={() => setKind("lost")}><Icon name="box" size={18} /> {t("issue.kind.lost")}</button>
        </div>

        {kind === "maintenance" && (
          <>
            <Eyebrow>1 · {t("issue.what")}</Eyebrow>
            <div className="issue-grid">
              {ISSUE_OBJECTS.map((o) => (
                <button type="button" key={o} className={`issue-opt ${object === o ? "on" : ""}`} onClick={() => setObject(o)} aria-pressed={object === o}>
                  <Obj id={o} size={36} /><span>{t(`obj.${o}`)}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {ready && (
          <>
            <Eyebrow>{kind === "lost" ? "1" : "2"} · {noPhotos ? t("issue.noPhoto") : t("issue.photo")}</Eyebrow>
            {!noPhotos && (
              <>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} />
                {photo ? (
                  <div className="photo-preview"><img src={photo} alt="" /><button type="button" className="btn btn-secondary btn-small" onClick={() => fileRef.current?.click()}><Icon name="camera" size={16} /> {t("issue.retake")}</button></div>
                ) : (
                  <button type="button" className="photo-btn" onClick={() => fileRef.current?.click()}><Icon name="camera" size={26} stroke={1.5} /><span>{t("issue.photo")}</span></button>
                )}
              </>
            )}

            <Eyebrow>{kind === "lost" ? "2" : "3"} · {kind === "lost" ? t("issue.lostNote") : t("issue.note")}</Eyebrow>
            <div className="note-input">
              <textarea value={note} onChange={(e) => { setNote(e.target.value); setNeedNote(false); }} placeholder={t("issue.placeholder")} rows={2} />
              <button type="button" className={`mic-btn ${recording ? "rec" : ""} ${voice ? "has" : ""}`}
                onPointerDown={holdStart} onPointerUp={holdEnd} onPointerLeave={holdEnd} onContextMenu={(e) => e.preventDefault()}
                aria-label={t("issue.voice")}><Icon name={voice && !recording ? "check" : "mic"} size={22} /></button>
            </div>
            <div className={`small ${needNote ? "error" : "muted"}`}>
              {needNote ? t("issue.noteRequired") : recording ? "● " + t("issue.recording") : voice ? t("issue.voiceAdded") : t("issue.voice")}
            </div>
            {voice && voice !== "simulated" && <audio src={voice} controls className="voice-play" />}
          </>
        )}
      </div>
      <BottomBar>
        <button type="button" className="btn btn-primary" disabled={!ready} onClick={send}><Icon name="send" size={16} /> {t("issue.send")}</button>
      </BottomBar>
    </div>
  );
}

const STATE_IC: Record<string, IconName> = { sent: "send", in_progress: "wrench", fixed: "check", lost: "box" };

/** → Track my reported issues: Sent → Being fixed → Fixed. */
export function ReportsScreen() {
  const t = useT();
  const s = useApp();
  return (
    <div className="screen">
      <Header title={t("issue.mine")} back={s.home} />
      <div className="screen-body">
        {s.issues.length === 0 && <div className="empty"><Obj id="clipboard" size={90} /><p className="muted">{t("issue.none")}</p></div>}
        {s.issues.length > 0 && (
          <div className="card list-card">
            {s.issues.map((i) => {
              const st = i.kind === "lost" ? "lost" : i.state;
              return (
                <div key={i.id} className="report-row">
                  {i.photo ? <img src={i.photo} alt="" className="report-photo" /> : <span className="report-obj"><Obj id={i.object} size={34} /></span>}
                  <div className="report-main">
                    <b><span className="room-no">{i.room}</span> · {t(`obj.${i.object}`)}</b>
                    <span className="muted small">{i.note || (i.voice ? t("issue.voiceAdded") : "")} · {hhmm(i.at)}</span>
                  </div>
                  <span className={`report-state rs-${st}`}>
                    <Icon name={STATE_IC[st]} size={12} stroke={2.2} /> {t(`issue.state.${st}`)}
                    {!i.synced && <Icon name="cloudOff" size={12} />}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomBar><button type="button" className="btn btn-primary" onClick={() => s.go({ name: "issue" })}><Icon name="plus" size={16} /> {t("issue.title")}</button></BottomBar>
    </div>
  );
}
