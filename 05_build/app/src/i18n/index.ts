import { en, type StringKey } from "./en";
import { ar } from "./ar";
import { fil } from "./fil";
import { useApp } from "../store";

export type Lang = "en" | "ar" | "fil";
export type { StringKey };

export const LANGS: { id: Lang; label: string; dir: "ltr" | "rtl"; speech: string }[] = [
  { id: "en", label: "English", dir: "ltr", speech: "en-GB" },
  { id: "ar", label: "العربية", dir: "rtl", speech: "ar-EG" },
  { id: "fil", label: "Filipino", dir: "ltr", speech: "fil-PH" },
];

const DICTS: Record<Lang, Partial<Record<StringKey, string>>> = { en, ar, fil };

export function translate(lang: Lang, key: StringKey | string, vars?: Record<string, string | number>) {
  const raw = DICTS[lang][key as StringKey] ?? en[key as StringKey] ?? key;
  return vars ? raw.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")) : raw;
}

export function useT() {
  const lang = useApp((s) => s.lang);
  return (key: StringKey | string, vars?: Record<string, string | number>) => translate(lang, key, vars);
}

/** Read text aloud in the person's language (audio for low literacy). */
export function speak(text: string, lang: Lang) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = LANGS.find((l) => l.id === lang)?.speech ?? "en-GB";
    u.rate = 0.9;
    synth.speak(u);
  } catch {
    /* audio is a bonus, never a blocker */
  }
}
