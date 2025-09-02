import { translations, SupportedLang } from "./translations";

export function t(key: keyof typeof translations, lang: SupportedLang) {
  return translations[key][lang] || translations[key].fr;
}
