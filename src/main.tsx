import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import "./i18n";

import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import FAQ from './pages/FAQ'
import Flashcard from './pages/Flashcard'
import Quiz from './pages/Quiz'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Error404 from './pages/Error404'
import ReactGA from "react-ga4";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import emailjs from "@emailjs/browser";

if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleReCaptchaProvider
      reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
      }}
    >
      <BrowserRouter>
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
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GoogleReCaptchaProvider>
  </StrictMode>
)
