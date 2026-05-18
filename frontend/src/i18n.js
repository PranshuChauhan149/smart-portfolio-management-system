import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      "landing": {
        "title": "Manage wealth with intelligent precision",
        "subtitle": "A premium platform designed for modern investors. Track assets, analyze risks, and make data-driven decisions all in one place.",
        "startFree": "Start for free",
        "viewDemo": "View live demo",
        "about": "About Us",
        "contact": "Contact Us",
        "home": "Home",
        "featuresTitle": "Everything you need to succeed",
        "featuresSubtitle": "Powerful tools designed for professional portfolio management."
      },
      "auth": {
        "welcomeBack": "Welcome back",
        "signInSubtitle": "Sign in to manage your investments",
        "createAccount": "Create your account",
        "createSubtitle": "Start managing your investments today",
        "emailLabel": "Email address",
        "passwordLabel": "Password",
        "signInBtn": "Sign In",
        "createBtn": "Create Account"
      },
      "footer": {
        "description": "Premium Smart Portfolio Management System.",
        "rights": "All rights reserved."
      }
    }
  },
  hi: {
    translation: {
      "landing": {
        "title": "बुद्धिमानी और सटीकता से संपत्ति का प्रबंधन करें",
        "subtitle": "आधुनिक निवेशकों के लिए एक प्रीमियम प्लेटफॉर्म। अपनी संपत्तियों को ट्रैक करें, जोखिमों का विश्लेषण करें, और डेटा-आधारित निर्णय लें।",
        "startFree": "मुफ्त शुरू करें",
        "viewDemo": "डेमो देखें",
        "about": "हमारे बारे में",
        "contact": "संपर्क करें",
        "home": "होम",
        "featuresTitle": "सफल होने के लिए वह सब कुछ जो आपको चाहिए",
        "featuresSubtitle": "पेशेवर पोर्टफोलियो प्रबंधन के लिए शक्तिशाली उपकरण।"
      },
      "auth": {
        "welcomeBack": "वापसी पर स्वागत है",
        "signInSubtitle": "अपने निवेश प्रबंधित करने के लिए साइन इन करें",
        "createAccount": "अपना खाता बनाएं",
        "createSubtitle": "आज ही अपने निवेश का प्रबंधन शुरू करें",
        "emailLabel": "ईमेल पता",
        "passwordLabel": "पासवर्ड",
        "signInBtn": "साइन इन करें",
        "createBtn": "खाता बनाएं"
      },
      "footer": {
        "description": "प्रीमियम स्मार्ट पोर्टफोलियो मैनेजमेंट सिस्टम।",
        "rights": "सर्वाधिकार सुरक्षित।"
      }
    }
  },
  es: {
    translation: {
      "landing": {
        "title": "Gestione su patrimonio con precisión inteligente",
        "subtitle": "Una plataforma premium diseñada para inversores modernos. Rastree activos, analice riesgos y tome decisiones basadas en datos.",
        "startFree": "Comience gratis",
        "viewDemo": "Ver demo",
        "about": "Sobre nosotros",
        "contact": "Contáctenos",
        "home": "Inicio",
        "featuresTitle": "Todo lo que necesitas para tener éxito",
        "featuresSubtitle": "Potentes herramientas para la gestión profesional de carteras."
      },
      "auth": {
        "welcomeBack": "Bienvenido de nuevo",
        "signInSubtitle": "Inicia sesión para gestionar tus inversiones",
        "createAccount": "Crea tu cuenta",
        "createSubtitle": "Comienza a gestionar tus inversiones hoy",
        "emailLabel": "Correo electrónico",
        "passwordLabel": "Contraseña",
        "signInBtn": "Iniciar sesión",
        "createBtn": "Crear cuenta"
      },
      "footer": {
        "description": "Sistema premium de gestión de cartera inteligente.",
        "rights": "Todos los derechos reservados."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
