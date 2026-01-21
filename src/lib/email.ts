import emailjs from "@emailjs/browser";

export const initEmail = () => {
  emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
};
