import { useTranslation } from "react-i18next";

export default function DonationBanner() {
  const { t } = useTranslation("common");

  return (
    <div className="mt-15 px-4">
      <div
        className="
          max-w-3xl mx-auto 
          text-center
        "
      >
        {/* Mensaje principal */}
        <p className="text-natly-blue text-2xl font-bold leading-snug mb-4">
          {t("donation.message")}
        </p>

        {/* Submensaje */}
        <p className="text-natly-gray text-lg md:text-xl mb-8">
          {t("donation.thank_you")}
        </p>

        {/* Botón */}
        <button
          className="
            px-10 py-4 
            bg-natly-teal 
            text-white 
            text-lg md:text-xl 
            font-semibold 
            rounded-full 
            shadow-md 
            hover:bg-natly-teal-dark 
            transition-transform 
            hover:scale-105
          "
        >
          {t("buttons.donate")}
        </button>
      </div>
    </div>
  );
}
