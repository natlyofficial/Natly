import underConstructionMobileEs from "../assets/underconstrucionmobilees.webp";
import underConstructionDesktopEs from "../assets/underconstruciones.webp";
import underConstructionMobileEn from "../assets/underconstrucionmobileen.webp";
import underConstructionDesktopEn from "../assets/underconstrucionen.webp";
import { useTranslation } from "react-i18next";

export default function UnderConstruction() {
  
  const { t, i18n } = useTranslation("common");

  const underConstructionMobile = i18n.language === "es" ? underConstructionMobileEs : underConstructionMobileEn;
  const underConstructionDesktop = i18n.language === "es" ? underConstructionDesktopEs : underConstructionDesktopEn;
  
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: "#39b2bd" }} // Color verde-azulado Natly
    >
      {/* Imagen para MOBILE */}
      <img
        src={underConstructionMobile}
        alt="Under Construction Mobile"
        className="block md:hidden w-200"
      />

      {/* Imagen para DESKTOP */}
      <img
        src={underConstructionDesktop}
        alt="Under Construction Desktop"
        className="hidden md:block w-300"
      />

      <p className="text-white text-3xl mt-6 mb-5 font-semibold text-center">
        {t("messages.under_construction")}
      </p>
    </div>
  );
}
