import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "./i18n";

import MainLayout from "./layout/MainLayout";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { initAnalytics } from "./lib/analytics";
import { initEmail } from "./lib/email";

import LoadingSpinner from "./components/LoadingSpinner";

initAnalytics();
initEmail();

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Donate = lazy(() => import("./pages/Donate"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Flashcard = lazy(() => import("./pages/Flashcard"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Confirm = lazy(() => import("./pages/Confirm"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));
const Error404 = lazy(() => import("./pages/Error404"));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{ async: true, defer: true }}
    >
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="donate" element={<Donate />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="flashcard" element={<Flashcard />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="confirm" element={<Confirm />} />
              <Route path="unsubscribe" element={<Unsubscribe />} />
              <Route path="*" element={<Error404 />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </StrictMode>
);