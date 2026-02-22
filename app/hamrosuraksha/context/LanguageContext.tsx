import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import en, { type Translations } from "@/locales/en";
import ne from "@/locales/ne";

type Lang = "en" | "ne";

interface LanguageContextType {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  t: en,
  toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ne" : "en"));
  }, []);

  const t = lang === "ne" ? ne : en;

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
