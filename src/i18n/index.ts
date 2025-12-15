import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Importación correcta para Vite + TS
import es from "./locales/es/common.json";
import esNavbar from "./locales/es/navbar.json";
import esHome from "./locales/es/home.json";
import esFlashcards from "./locales/es/flashcards.json";
import esDonate from "./locales/es/donation.json";
import esAbout from "./locales/es/about.json";
import esContact from "./locales/es/contact.json";
import esFooter from "./locales/es/footer.json";

import en from "./locales/en/common.json";
import enNavbar from "./locales/en/navbar.json";
import enHome from "./locales/en/home.json";
import enFlashcards from "./locales/en/flashcards.json";
import enDonate from "./locales/en/donation.json";
import enAbout from "./locales/en/about.json";
import enContact from "./locales/en/contact.json";
import enFooter from "./locales/en/footer.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { 
        common: en,
        navbar : enNavbar,
        home: enHome,
        flashcards: enFlashcards,
        donate: enDonate,
        about: enAbout,
        contact: enContact,
        footer: enFooter
       },
      es: { 
        common: es,
        navbar: esNavbar,
        home: esHome,
        flashcards: esFlashcards,
        donate: esDonate,
        about: esAbout,
        contact: esContact,
        footer: esFooter
      },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
