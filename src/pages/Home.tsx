import mascot from "../assets/mascota-natly.webp";
import deviceses from "../assets/deviceses.webp";
import devicesen from "../assets/devicesen.webp";
import flashcardes from "../assets/flashcardes.webp";
import flashcarden from "../assets/flashcarden.webp";
import officialquestionen from "../assets/officialquestionen.webp";
import officialquestiones from "../assets/officialquestiones.webp";
import quizen from "../assets/quizen.webp";
import quizes from "../assets/quizes.webp";
import mascotheart from "../assets/mascota-natly-heart.webp";
import { useNavigate } from "react-router-dom";
import { IconChecklist, IconGrowth, IconPlay } from "../natly-icons";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Home() {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();

  const devicesImage = i18n.language === "es" ? deviceses : devicesen;
  const flashcardImage = i18n.language === "es" ? flashcardes : flashcarden;
  const officialQuestionImage = i18n.language === "es" ? officialquestiones : officialquestionen;
  const quizImage = i18n.language === "es" ? quizes : quizen;

  const exploreItems = [
    {
      img: flashcardImage,
      titleKey: "feature_cards_title",
      descKey: "feature_cards_desc",
      size: "w-80 sm:w-66"
    },
    {
      img: officialQuestionImage,
      titleKey: "feature_questions_title",
      descKey: "feature_questions_desc",
      size: "w-24 sm:w-30"
    },
    {
      img: quizImage,
      titleKey: "feature_quiz_title",
      descKey: "feature_quiz_desc",
      size: "w-24 sm:w-30"
    },
  ];

  return (
    <div className="mt-8">

      {/* Top banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-natly-blue max-w-7xl mx-auto text-center py-2 px-4 shadow-sm text-white font-medium"
      >
        {t("free_platform_title")}
      </motion.div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center md:text-left"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-natly-blue leading-tight mb-4">
            {t("welcome_title")}
          </h1>

          <p className="text-lg text-natly-gray mb-5 md:pr-10 whitespace-pre-line">
            {t("welcome_subtitle")}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/flashcard")}
            className="bg-natly-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-natly-blue-dark transition"
          >
            {t("cta_start")}
          </motion.button>
        </motion.div>

        <div className="flex justify-center md:justify-end animate-fade-in">
          <img
            src={mascot}
            alt="Natly mascot"
            className="w-64 md:w-80"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* HOW IT WORKS */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-natly-blue text-center mb-6">
          {t("how_it_works_title")}
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid md:grid-cols-3 gap-10 text-center"
        >
          {[ 
            { icon: <IconPlay size={90} />, title: "lessons_title", desc: "lessons_desc" },
            { icon: <IconChecklist size={90} />, title: "quiz_title", desc: "quiz_desc" },
            { icon: <IconGrowth size={90} />, title: "progress_title", desc: "progress_desc" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <div className="flex justify-center items-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-natly-blue">
                {t(item.title)}
              </h3>
              <p className="text-natly-gray mt-2">
                {t(item.desc)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* WHAT IS NATLY */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-natly-blue-dark text-white px-2 py-1 inline-block">
              {t("what_is_natly_title")}
            </h2>

            <p className="text-lg text-justify mb-6 leading-relaxed whitespace-pre-line">
              {t("what_is_natly_desc")}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <img src={devicesImage} alt="Natly on multiple devices" className="w-full max-w-md" />
          </motion.div>
        </div>
      </motion.div>

      {/* EXPLORE */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-14 items-start"
      >
        {/* LEFT */}
        <div className="lg:col-span-2">
          <h2 className="text-4xl font-bold text-natly-blue mb-4">
            {t("explore_title")}
          </h2>

          <p className="text-natly-gray mb-10 max-w-2xl">
            {t("explore_subtitle")}
          </p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {exploreItems.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl p-6 border-4 border-natly-yellow shadow-sm hover:shadow-lg transition text-center flex flex-col items-center"
              >
                <div className="mb-5 flex justify-center items-center h-36 ">
                  <img
                    src={item.img}
                    alt={t(item.titleKey)}
                    className={`h-auto ${item.size} rounded-xl`}
                  />
                </div>

                <h3 className="text-lg font-semibold text-natly-blue mb-2">
                  {t(item.titleKey)}
                </h3>

                <p className="text-sm text-natly-gray">
                  {t(item.descKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/flashcard")}
            className="bg-natly-blue text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-natly-blue-dark transition shadow-md"
          >
            {t("cta_study_free")}
          </motion.button>
        </div>

        {/* COMMUNITY */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white p-10 text-center shadow-2xl"
        >
          <img src={mascotheart} alt="Natly mascot with heart" className="w-40 mx-auto mb-6" />

          <h3 className="text-2xl font-bold text-natly-blue mb-4">
            {t("community_title")}
          </h3>

          <p className="text-natly-gray mb-8">
            {t("community_desc")}
          </p>

          <a
            href="https://gofund.me/1e5a55d5e"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="text-white px-8 py-4 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 transition shadow-sm"
            >
              {t("cta_support_natly")}
            </motion.button>
          </a>

          <p className="text-sm text-natly-gray mt-4">
            {t("donation_note")}
          </p>
        </motion.div>
      </motion.div>

    </div>
  );
}
