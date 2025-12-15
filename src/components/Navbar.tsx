import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import LanguageIcon from "../assets/icon/language.png";
import { IconClose, IconMenu } from "../natly-icons";

export default function Navbar() {
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation("navbar");

  const langRef = useRef<HTMLDivElement | null>(null);
  const currentLang = (i18n.language || "es").slice(0, 2).toUpperCase();

  // Cerrar menú de idioma al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="w-full bg-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          {/* LOGO */}
          <Link to="/" className="text-3xl font-bold text-natly-blue">
            Natly
          </Link>

          {/* CONTENEDOR DERECHA: menú, idioma, login, hamburguesa */}
          <div className="flex items-center gap-4 ml-auto">
            {/* MENÚ DESKTOP (solo >= lg) */}
            <div className="hidden lg:flex gap-10 text-lg text-natly-blue mr-2">
              {[
                  [t("home"), "/"],
                [t("cards"), "/flashcard"],
                [t("quiz"), "/quiz"],
                [t("donate"), "/donate"],
                [t("about"), "/about"],
                [t("contact"), "/contact"],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="hover:text-natly-teal-dark transition font-medium"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* SELECTOR DE IDIOMA (SIEMPRE VISIBLE) */}
            <div ref={langRef} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-natly-blue"
              >
                <img  
                  src={LanguageIcon}
                  alt="Language selector"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-bold text-base lg:text-lg">
                  {currentLang}
                </span>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white shadow-lg rounded-md border border-gray-200 py-2 z-50">
                  {[
                    { code: "es", label: "Español" },
                    { code: "en", label: "English" },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-natly-blue hover:text-black hover:underline transition"
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* LOGIN DESKTOP (>= lg) */}
            <Link
              to="/login"
              className="hidden lg:block bg-natly-blue text-white px-5 py-3 rounded-full font-semibold hover:bg-natly-blue-dark transition"
            >
              {t("login")}
            </Link>

            {/* HAMBURGUESA MOBILE (< lg) */}
            <button
              type="button"
              className="lg:hidden text-natly-blue text-3xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MENÚ MOBILE (DROP-DOWN SIMPLE) */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md p-4 space-y-4">
          {[
            [t("home"), "/"],
            [t("cards"), "/flashcard"],
            [t("quiz"), "/quiz"],
            [t("donate"), "/donate"],
            [t("about"), "/about"],
            [t("contact"), "/contact"],
          ].map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className="block text-lg text-natly-blue font-medium hover:text-natly-teal-dark transition"
            >
              {label}
            </Link>
          ))}

          {/* Login en mobile */}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-center bg-natly-blue text-white py-3 rounded-full font-semibold mt-4"
          >
            Iniciar sesión
          </Link>
        </div>
      )}
    </>
  );
}
