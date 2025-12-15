import mascotdonation from "../assets/donation.png";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Donate() {
  const { t } = useTranslation("donate");

  return (
    <div className="max-w-7xl mx-auto px-1 py-5 text-center">

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center"
      >
        <img
          src={mascotdonation}
          alt="Natly mascot"
          className="w-100 md:w-150"
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl text-natly-blue-dark font-extrabold mb-4"
      >
        {t("donate_title")}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        {t("donate_description")}
      </motion.p>

      {/* Donation amounts */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="flex flex-wrap justify-center gap-4 mb-10"
      >
        {(t("donation_amounts", { returnObjects: true }) as string[]).map(
          (amount) => (
            <motion.button
              key={amount}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-xl border text-natly-blue font-semibold hover:shadow-xl transition"
            >
              {amount}
            </motion.button>
          )
        )}
      </motion.div>

      {/* Donate button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center mb-12"
      >
        <a
            href="https://gofund.me/1e5a55d5e"
            target="_blank"
            rel="noopener noreferrer"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-12 py-4 rounded-2xl text-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg transition"
          >
            {t("donate_button")}
          </motion.button>
        </a>
      </motion.div>

      {/* Donors Wall */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-3xl font-bold mb-8">
          {t("donors_wall_title")}
        </h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-6xl mx-auto"
        >
          {[
            "bg-natly-teal/30",
            "bg-yellow-200/70",
            "bg-natly-blue-light/40",
            "bg-emerald-400/60",
            "bg-orange-400/70",
            "bg-[#F6F2E8]",
            "bg-natly-teal/20",
            "bg-natly-blue/30",
          ].map((bg, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`
                h-18 md:h-28 rounded-xl 
                ${bg}
                shadow-sm
              `}
            />
          ))}
        </motion.div>
      </motion.div>

    </div>
  );
}
