import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./config/lang/en.json"
import cs from "./config/lang/cs.json"

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {translation: en},
  cs: {translation: cs}
};

i18n
  //.use(XHR)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem('af-lang') ? localStorage.getItem('af-lang') : "en",
    //"cs", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    // backend: {
    //   loadPath: '/i18n/lang/{{ns}}/{{lng}}.json' // http://localhost:8050/public/i18n/translations/en.json
    // },
    //saveMissing: true,
    keySeparator: '.',
  
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    react: {
      useSuspense: false
    }
  });

  export default i18n;