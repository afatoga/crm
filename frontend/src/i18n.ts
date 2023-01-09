import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./config/lang/en.json";
import cs from "./config/lang/cs.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: { translation: en },
  cs: { translation: cs },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("af-lang") ? localStorage.getItem("af-lang") : "en",
  fallbackLng: "en",
  keySeparator: ".",

  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
