import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useAnalytics from "../hooks/useAnalytics";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

<GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
  <Outlet />
</GoogleReCaptchaProvider>

export default function MainLayout() {
  useAnalytics();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
