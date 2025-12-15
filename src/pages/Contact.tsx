import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { trackEvent } from "../utils/analytics";

export default function Contact() {
  const { t } = useTranslation("contact");

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = t("error_name");
    }

    if (!form.email.trim()) {
      newErrors.email = t("error_email");
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = t("error_email_invalid");
    }

    if (!form.message.trim()) {
      newErrors.message = t("error_message");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          title: "Contact Form",
          name: form.name,
          email: form.email,
          message: form.message,
        }
      );

      setSent(true);
      setForm({ name: "", email: "", message: "" });

      trackEvent("contact_submit", {
        event_category: "Contact",
        event_label: "Contact Form",
      });
    } catch (err) {
      console.error("Contact form error:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-natly-blue">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-natly-blue-dark">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-natly-gray leading-relaxed">
          {t("subtitle")}
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <span className="h-1 w-6 rounded-full bg-natly-teal" />
          <span className="h-1 w-6 rounded-full bg-natly-blue" />
          <span className="h-1 w-6 rounded-full bg-orange-400" />
        </div>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-12 items-start"
      >
        {/* FORM */}
        <div className="bg-white rounded-3xl border border-natly-blue/20 p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">{t("form_title")}</h2>

          {sent && (
            <p className="mb-4 text-green-600 font-semibold">
              {t("success_message")}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="block mb-1 font-semibold">{t("name")}</label>
              <input
                type="text"
                placeholder={t("name_placeholder")}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-1 font-semibold">{t("email")}</label>
              <input
                type="email"
                placeholder={t("email_placeholder")}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block mb-1 font-semibold">{t("message")}</label>
              <textarea
                rows={4}
                placeholder={t("message_placeholder")}
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className={`w-full rounded-xl border px-4 py-3 focus:outline-none ${
                  errors.message ? "border-red-500" : ""
                }`}
              />
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full mt-4 bg-natly-blue text-white py-3 rounded-xl font-semibold hover:bg-natly-blue-dark transition disabled:opacity-50"
            >
              {sending ? t("sending") : t("send")}
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-3">
              {t("other_ways_title")}
            </h3>
            <p className="text-natly-gray leading-relaxed">
              {t("other_ways_desc")}
            </p>
          </div>

          <div className="rounded-2xl bg-natly-teal/10 p-6">
            <p className="font-semibold">{t("community_note_title")}</p>
            <p className="mt-2 text-natly-gray">
              {t("community_note_text")}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
