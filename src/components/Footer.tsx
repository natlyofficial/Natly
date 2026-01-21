import facebookIcon from "../assets//icon//facebook.webp";
import tiktokIcon from "../assets//icon//tiktok.webp";
import youtubeIcon from "../assets//icon//youtube.webp";
import instagramIcon from "../assets//icon//instagram.webp";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <footer className="mt-5 mb-3 text-center text-natly-blue">
      <div className="flex gap-6 justify-center text-2xl mb-4">
        <a href="https://www.tiktok.com/@natlyofficial" target="_blank" rel="noopener noreferrer">
          <img src={tiktokIcon} className="w-16"  />          
        </a>
        <a href="https://www.facebook.com/natlyofficial/" target="_blank" rel="noopener noreferrer">
          <img src={facebookIcon} className="w-16" alt="Facebook" />
        </a>
        <a href="https://www.youtube.com/@NatlyOfficial" target="_blank" rel="noopener noreferrer">
          <img src={youtubeIcon} className="w-16" />
        </a>
        <a href="https://www.instagram.com/natly.official/" target="_blank" rel="noopener noreferrer">
          <img src={instagramIcon} className="w-16" />
        </a>
      </div>
      <p className="text-lg font-bold text-natly-gray">{t("rights")}</p>
    </footer>
  );
}