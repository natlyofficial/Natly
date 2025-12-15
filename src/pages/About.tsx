import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation("about");

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-24 text-natly-blue">

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center overflow-hidden"
      >
        {/* Decorative pastel shapes */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-3 opacity-80">
          <span className="h-2 w-10 rounded-full bg-natly-teal" />
          <span className="h-2 w-10 rounded-full bg-natly-blue" />
          <span className="h-2 w-10 rounded-full bg-orange-400" />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-12">
          <span className="text-natly-blue-dark">
            {t("hero_title").split(" ")[0]}
          </span>{" "}
          <span className="bg-gradient-to-r from-natly-teal to-natly-blue bg-clip-text text-transparent">
            {t("hero_title").split(" ").slice(1).join(" ")}
          </span>
        </h1>

        <p className="mt-12 mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-natly-gray">
          {t("hero_description")}
        </p>

        {/* Bottom accent */}
        <div className="mt-10 flex justify-center gap-2">
          <span className="h-1 w-6 rounded-full bg-natly-teal" />
          <span className="h-1 w-6 rounded-full bg-natly-blue" />
          <span className="h-1 w-6 rounded-full bg-orange-400" />
        </div>
      </motion.div>

      {/* FOUNDER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="text-3xl font-bold mb-4">
            {t("founder_title")}
          </h2>
          <p className="leading-relaxed mb-4">
            {t("founder_p1")}
          </p>
          <p className="leading-relaxed">
            {t("founder_p2")}
          </p>
        </div>

        <div className="rounded-2xl bg-natly-teal/70 border p-10 text-center text-white shadow-sm">
          <p className="text-2xl font-bold">
            {t("founder_quote_title")}
          </p>
          <p className="mt-2">
            {t("founder_quote_text")}
          </p>
        </div>
      </motion.div>

      {/* VISION & MISSION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-12"
      >
        <div>
          <h3 className="text-2xl font-bold mb-3">{t("vision_title")}</h3>
          <p className="text-natly-gray">{t("vision_text")}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-3">{t("mission_title")}</h3>
          <p className="text-natly-gray">{t("mission_text")}</p>
        </div>
      </motion.div>

      {/* OBJECTIVES */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("objectives_title")}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <p key={i} className="leading-relaxed">
              • {t(`objectives_${i}`)}
            </p>
          ))}
        </div>
      </motion.div>

      {/* VALUES */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("values_title")}
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            { key: "inclusion", bg: "bg-natly-teal/15" },
            { key: "accessibility", bg: "bg-natly-blue-light/20" },
            { key: "trust", bg: "bg-emerald-200/40" },
            { key: "commitment", bg: "bg-orange-200/50" },
            { key: "respect", bg: "bg-yellow-100/70" },
            { key: "solidarity", bg: "bg-natly-teal/10" },
            { key: "transparency", bg: "bg-sky-200/40" },
            { key: "empowerment", bg: "bg-indigo-200/30" },
          ].map(({ key, bg }) => (
            <div
              key={key}
              className={`
                rounded-2xl 
                p-5 
                font-semibold 
                ${bg}
                shadow-sm 
                transition
                hover:scale-[1.02]
              `}
            >
              {t(`value_${key}`)}
            </div>
          ))}
        </div>
      </motion.div>

      {/* CLOSING */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-lg max-w-3xl mx-auto leading-relaxed text-natly-gray">
          {t("closing_text")}
        </p>
      </motion.div>

    </div>
  );
}
