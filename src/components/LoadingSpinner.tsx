import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function AppLoader() {
  const { t } = useTranslation("common");

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a3978]">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex flex-col items-center text-center"
      >
        {/* Logo / Nombre */}
        <motion.h1
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Natly
        </motion.h1>

        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white border-t-[#F4B000] rounded-full animate-spin mb-4" />

        {/* Texto */}
        <p className="text-white/80 text-sm mt-2 animate-pulse">
          {t("loading.message")}
        </p>
      </motion.div>
    </div>
  );
}
