import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import POS from "./components/POS";
import TradeView from "./components/TradeView";
import StockView from "./components/StockView";
import Reviews from "./components/Reviews";
import CreditId from "./components/CreditId";
import { LanguageSelection, BusinessRegistration, LockScreen } from "./components/Onboarding";
import Modals from "./components/Modals";
import { AnimatePresence, motion } from "framer-motion";

function PhoneWrapper({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-2 sm:p-4">
      {/* Smartphone Frame Container */}
      <div className="relative mx-auto my-6 w-full max-w-[400px] h-[844px] max-h-[calc(100vh-3rem)] rounded-[48px] border-[5px] border-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden bg-slate-50 flex flex-col">
        {children}
      </div>
    </div>
  );
}

function MainApp() {
  const { language, profile, isLoggedIn, screen, setScreen } = useApp();

  if (!language) {
    return (
      <PhoneWrapper>
        <LanguageSelection />
      </PhoneWrapper>
    );
  }

  if (!profile?.isConfigured) {
    return (
      <PhoneWrapper>
        <BusinessRegistration />
      </PhoneWrapper>
    );
  }

  if (!isLoggedIn) {
    return (
      <PhoneWrapper>
        <LockScreen />
      </PhoneWrapper>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
      case "trade":
      case "pos":
        return <TradeView key="trade" />;
      case "stock":
      case "inventory":
        return <StockView key="stock" />;
      case "creditId":
      case "access":
        return <CreditId key="creditId" />;
      case "reviews":
        return <Reviews key="reviews" />;
      default:
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
    }
  };

  return (
    <PhoneWrapper>
      <Header />

      <main className="flex-1 overflow-y-auto relative bg-slate-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="min-h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
      <Modals />
    </PhoneWrapper>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
