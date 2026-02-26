import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import facebookIcon from "../assets/icon/facebook.webp";
import tiktokIcon from "../assets/icon/tiktok.webp";
import youtubeIcon from "../assets/icon/youtube.webp";
import instagramIcon from "../assets/icon/instagram.webp";
import emailIcon from "../assets/icon/email.webp";
import mascotFlying from "../assets/natly-flying.webp";

export default function Footer() {
  const { t } = useTranslation("footer");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <footer className="relative overflow-hidden">
      
      {/* Sky Background - Natly Blue */}
      <div 
        className="relative pt-20 pb-12"
        style={{
          background: 'linear-gradient(to bottom, #0a3978 0%, #1e5fa8 50%, #e0f2fe 100%)'
        }}
      >
        
        {/* 20 Animated Clouds - Moving left to right */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Layer 1 - Large clouds */}
          <div className="absolute top-8 text-8xl opacity-40 animate-cloud-1">☁️</div>
          <div className="absolute top-12 text-7xl opacity-35 animate-cloud-2">☁️</div>
          <div className="absolute top-16 text-9xl opacity-30 animate-cloud-3">☁️</div>
          <div className="absolute top-20 text-7xl opacity-35 animate-cloud-4">☁️</div>
          
          {/* Layer 2 - Medium clouds */}
          <div className="absolute top-24 text-6xl opacity-30 animate-cloud-5">☁️</div>
          <div className="absolute top-28 text-5xl opacity-25 animate-cloud-6">☁️</div>
          <div className="absolute top-32 text-6xl opacity-35 animate-cloud-7">☁️</div>
          <div className="absolute top-36 text-7xl opacity-30 animate-cloud-8">☁️</div>
          <div className="absolute top-40 text-5xl opacity-25 animate-cloud-9">☁️</div>
          
          {/* Layer 3 - Small clouds */}
          <div className="absolute top-44 text-4xl opacity-20 animate-cloud-10">☁️</div>
          <div className="absolute top-48 text-5xl opacity-25 animate-cloud-11">☁️</div>
          <div className="absolute top-52 text-4xl opacity-20 animate-cloud-12">☁️</div>
          <div className="absolute top-56 text-6xl opacity-30 animate-cloud-13">☁️</div>
          
          {/* Layer 4 - Bottom clouds */}
          <div className="absolute top-60 text-7xl opacity-25 animate-cloud-14">☁️</div>
          <div className="absolute top-64 text-5xl opacity-20 animate-cloud-15">☁️</div>
          <div className="absolute top-68 text-6xl opacity-25 animate-cloud-16">☁️</div>
          <div className="absolute top-72 text-4xl opacity-15 animate-cloud-17">☁️</div>
          
          {/* Layer 5 - Extra clouds */}
          <div className="absolute top-76 text-8xl opacity-30 animate-cloud-18">☁️</div>
          <div className="absolute top-80 text-5xl opacity-20 animate-cloud-19">☁️</div>
          <div className="absolute top-84 text-7xl opacity-25 animate-cloud-20">☁️</div>
        </div>

        {/* Flying Natly - BEHIND text (z-index lower) */}
        <div className="absolute top-16 left-0 w-full h-32 pointer-events-none z-0 overflow-visible">
          <div className="natly-flying-smooth">
            <img 
              src={mascotFlying} 
              alt="Natly Flying" 
              className="w-20 md:w-32 h-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Newsletter Content - IN FRONT of mascot (z-index higher) */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 overflow-visible">
          
          {/* Main Title - White text */}
          <div className="text-center mb-8">
            <h3 className="text-4xl sm:text-5xl font-black text-white mb-3 drop-shadow-lg">
              {t("newsletter.title", "¡Vuela Alto en tu Examen!")}
            </h3>
            <p className="text-xl text-white/90 font-semibold">
              {t("newsletter.subtitle", "Suscríbete para recibir noticias y actualizaciones")}
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="relative">
            <form 
              onSubmit={handleSubmit}
              className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border-4 border-natly-yellow transform hover:scale-[1.02] transition-all duration-300"
            >
              
              {/* Decorative Envelope Icon */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-natly-yellow rounded-full p-5 shadow-lg">
                <img src={emailIcon} alt="Email Icon" className="w-12 h-8" />
              </div>

              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  {/* Email Input */}
                  <div className="flex-1 relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("newsletter.placeholder", "tu@email.com")}
                      required
                      disabled={status === "loading" || status === "success"}
                      className="w-full px-6 py-4 rounded-2xl border-3 border-natly-blue-soft text-natly-blue-dark text-lg font-semibold focus:outline-none focus:border-natly-blue focus:ring-4 focus:ring-natly-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:border-natly-blue"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-2xl animate-bounce">✨</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="relative px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-natly-yellow to-amber-400 text-natly-blue-dark text-lg font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === "loading" 
                        ? <>
                            <span className="animate-spin">⏳</span>
                            {t("newsletter.sending", "Enviando...")}
                          </>
                        : status === "success"
                        ? <>
                            <span className="animate-bounce">🎉</span>
                            {t("newsletter.success", "¡Suscrito!")}
                          </>
                        : <>
                            {t("newsletter.button", "Suscribirme Gratis")}
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </>
                      }
                    </span>
                  </button>
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-xl animate-slide-up">
                    <p className="text-center text-green-700 font-bold flex items-center justify-center gap-2">
                      <span className="text-2xl animate-bounce">🎊</span>
                      {t("newsletter.successMessage", "¡Genial! Revisa tu email para confirmar.")}
                      <span className="text-2xl animate-bounce animation-delay-100">🎊</span>
                    </p>
                  </div>
                )}
                
                {status === "error" && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 rounded-xl animate-shake">
                    <p className="text-center text-red-700 font-bold">
                      ❌ {t("newsletter.errorMessage", "Algo salió mal. Intenta de nuevo.")}
                    </p>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 text-sm font-semibold text-natly-blue">
                  <div className="flex items-center gap-2 bg-natly-blue-soft/20 px-3 sm:px-4 py-2 rounded-full hover:bg-natly-blue-soft/30 transition-colors">
                    <span className="text-lg">✓</span>
                    <span className="text-xs sm:text-sm">100% Gratis</span>
                  </div>
                  <div className="flex items-center gap-2 bg-natly-blue-soft/20 px-3 sm:px-4 py-2 rounded-full hover:bg-natly-blue-soft/30 transition-colors">
                    <span className="text-lg">✓</span>
                    <span className="text-xs sm:text-sm">Sin Spam</span>
                  </div>
                  <div className="flex items-center gap-2 bg-natly-blue-soft/20 px-3 sm:px-4 py-2 rounded-full hover:bg-natly-blue-soft/30 transition-colors">
                    <span className="text-lg">✓</span>
                    <span className="text-xs sm:text-sm">Cancela Cuando Quieras</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Social Proof - YELLOW text */}
          <div className="text-center mt-8 mb-2">
            <p className="text-black font-bold text-base sm:text-lg drop-shadow">
              {t("newsletter.socialProof", "Únete a más de 500 personas preparándose para la ciudadanía")}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 120" className="w-full h-16 sm:h-20 fill-white">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-white pb-6">
        
        {/* Social Icons - NO drop-shadow */}
        <div className="flex gap-4 sm:gap-6 justify-center mb-6">
          <a 
            href="https://www.tiktok.com/@natlyofficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-125 hover:-rotate-12 transition-all duration-300"
          >
            <img src={tiktokIcon} className="w-14 sm:w-16" alt="TikTok" />
          </a>
          <a 
            href="https://www.facebook.com/natlyofficial/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-125 hover:rotate-12 transition-all duration-300"
          >
            <img src={facebookIcon} className="w-14 sm:w-16" alt="Facebook" />
          </a>
          <a 
            href="https://www.youtube.com/@NatlyOfficial" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-125 hover:-rotate-12 transition-all duration-300"
          >
            <img src={youtubeIcon} className="w-14 sm:w-16" alt="YouTube" />
          </a>
          <a 
            href="https://www.instagram.com/natly.official/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transform hover:scale-125 hover:rotate-12 transition-all duration-300"
          >
            <img src={instagramIcon} className="w-14 sm:w-16" alt="Instagram" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-base sm:text-lg font-bold text-natly-gray">
          {t("rights", "© 2025 Natly. Todos los derechos reservados.")}
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        /* Natly Flying - Smooth bidirectional flight */
        .natly-flying-smooth {
          animation: fly-wave 35s ease-in-out infinite;
        }

        @keyframes fly-wave {
          0% {
            transform: translateX(0vw) translateY(0) scaleX(1);
          }
          10% {
            transform: translateX(15vw) translateY(-45px) scaleX(1);
          }
          20% {
            transform: translateX(30vw) translateY(50px) scaleX(1);
          }
          30% {
            transform: translateX(46vw) translateY(-55px) scaleX(1);
          }
          40% {
            transform: translateX(66vw) translateY(5px) scaleX(1);
          }
          45% {
            transform: translateX(78vw) translateY(-30px) scaleX(1);
          }
          50% {
            transform: translateX(93vw) translateY(25px) scaleX(1);
          }
          55% {
            transform: translateX(100vw) translateY(20px) scaleX(-1);
          }
          60% {
            transform: translateX(0vw) translateY(15px) scaleX(-1);
          }
          70% {
            transform: translateX(-15vw) translateY(-20px) scaleX(-1);
          }
          80% {
            transform: translateX(-27vw) translateY(20px) scaleX(-1);
          }
          85% {
            transform: translateX(-46vw) translateY(-35px) scaleX(-1);
          }
          90% {
            transform: translateX(-66vw) translateY(25px) scaleX(-1);
          }
          95% {
            transform: translateX(-86vw) translateY(-25px) scaleX(-1);
          }
          100% {
            transform: translateX(-100vw) translateY(0) scaleX(-1);
          }
        }

        /* Cloud animations - Continuous loop */
        @keyframes cloud-loop {
          0% {
            transform: translateX(-15%);
            opacity: 0;
          }
          5% {
            opacity: var(--cloud-opacity);
          }
          95% {
            opacity: var(--cloud-opacity);
          }
          100% {
            transform: translateX(115vw);
            opacity: 0;
          }
        }

        /* Individual cloud animations */
        .animate-cloud-1 { animation: cloud-loop 40s linear infinite; --cloud-opacity: 0.4; }
        .animate-cloud-2 { animation: cloud-loop 45s linear infinite; --cloud-opacity: 0.35; animation-delay: -5s; }
        .animate-cloud-3 { animation: cloud-loop 50s linear infinite; --cloud-opacity: 0.3; animation-delay: -10s; }
        .animate-cloud-4 { animation: cloud-loop 42s linear infinite; --cloud-opacity: 0.35; animation-delay: -15s; }
        .animate-cloud-5 { animation: cloud-loop 48s linear infinite; --cloud-opacity: 0.3; animation-delay: -20s; }
        .animate-cloud-6 { animation: cloud-loop 52s linear infinite; --cloud-opacity: 0.25; animation-delay: -25s; }
        .animate-cloud-7 { animation: cloud-loop 44s linear infinite; --cloud-opacity: 0.35; animation-delay: -30s; }
        .animate-cloud-8 { animation: cloud-loop 49s linear infinite; --cloud-opacity: 0.3; animation-delay: -35s; }
        .animate-cloud-9 { animation: cloud-loop 55s linear infinite; --cloud-opacity: 0.25; animation-delay: -40s; }
        .animate-cloud-10 { animation: cloud-loop 41s linear infinite; --cloud-opacity: 0.2; animation-delay: -2s; }
        .animate-cloud-11 { animation: cloud-loop 47s linear infinite; --cloud-opacity: 0.25; animation-delay: -7s; }
        .animate-cloud-12 { animation: cloud-loop 43s linear infinite; --cloud-opacity: 0.2; animation-delay: -12s; }
        .animate-cloud-13 { animation: cloud-loop 51s linear infinite; --cloud-opacity: 0.3; animation-delay: -17s; }
        .animate-cloud-14 { animation: cloud-loop 46s linear infinite; --cloud-opacity: 0.25; animation-delay: -22s; }
        .animate-cloud-15 { animation: cloud-loop 53s linear infinite; --cloud-opacity: 0.2; animation-delay: -27s; }
        .animate-cloud-16 { animation: cloud-loop 39s linear infinite; --cloud-opacity: 0.25; animation-delay: -32s; }
        .animate-cloud-17 { animation: cloud-loop 54s linear infinite; --cloud-opacity: 0.15; animation-delay: -37s; }
        .animate-cloud-18 { animation: cloud-loop 38s linear infinite; --cloud-opacity: 0.3; animation-delay: -42s; }
        .animate-cloud-19 { animation: cloud-loop 56s linear infinite; --cloud-opacity: 0.2; animation-delay: -4s; }
        .animate-cloud-20 { animation: cloud-loop 57s linear infinite; --cloud-opacity: 0.25; animation-delay: -9s; }

        /* Success/Error animations */
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.6s ease-out;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </footer>
  );
}