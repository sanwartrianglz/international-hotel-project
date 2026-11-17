import { useEffect } from "react";
import { useApp } from "./store";
import { LANGS } from "./i18n";
import { Login, Briefing } from "./screens/Start";
import { Home, RoomScreen } from "./screens/Home";
import { CleanScreen, DoneScreen, FixScreen } from "./screens/Clean";
import { IssueScreen, ReportsScreen } from "./screens/Issue";
import { MessagesScreen, RoomsScreen, MenuScreen, EndScreen, OffDuty, DemoScreen } from "./screens/More";
import { BreakScreen, Toasts, UrgentAlert } from "./components/chrome";
import { DeviceFrame } from "./components/DeviceFrame";

export default function App() {
  const { phase, screen, lang, onBreak, setOnline, device } = useApp();

  // Arabic → RTL. Every layout uses logical CSS properties, so it mirrors by itself.
  useEffect(() => {
    const l = LANGS.find((x) => x.id === lang)!;
    document.documentElement.lang = lang;
    document.documentElement.dir = l.dir;
  }, [lang]);

  // Each new screen starts at the top.
  const screenKey = phase + screen.name + ("no" in screen ? screen.no : "");
  useEffect(() => { window.scrollTo(0, 0); document.getElementById("app-scroll")?.scrollTo(0, 0); }, [screenKey]);

  // Real signal follows the browser; the demo panel can also simulate "no signal".
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, [setOnline]);

  let body;
  if (phase === "login") body = <Login />;
  else if (phase === "briefing") body = <Briefing />;
  else if (phase === "offduty") body = <OffDuty />;
  else if (onBreak) body = <BreakScreen />;
  else {
    switch (screen.name) {
      case "room": body = <RoomScreen no={screen.no} />; break;
      case "clean": body = <CleanScreen no={screen.no} />; break;
      case "done": body = <DoneScreen no={screen.no} />; break;
      case "fix": body = <FixScreen no={screen.no} />; break;
      case "rooms": body = <RoomsScreen />; break;
      case "messages": body = <MessagesScreen />; break;
      case "issue": body = <IssueScreen no={screen.no} />; break;
      case "reports": body = <ReportsScreen />; break;
      case "menu": body = <MenuScreen />; break;
      case "end": body = <EndScreen />; break;
      case "demo": body = <DemoScreen />; break;
      default: body = <Home />;
    }
  }

  return (
    <DeviceFrame>
      <div className={`app device-${device ?? "phone"}`}>
        {body}
        {phase === "shift" && !onBreak && <UrgentAlert />}
        <Toasts />
      </div>
    </DeviceFrame>
  );
}
