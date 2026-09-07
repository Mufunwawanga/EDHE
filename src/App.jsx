import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import POS from "./components/POS";
import Inventory from "./components/Inventory";
import Reviews from "./components/Reviews";
import CreditId from "./components/CreditId";
import { LanguageSelection, BusinessRegistration, LockScreen } from "./components/Onboarding";
import Modals from "./components/Modals";
import { AnimatePresence, motion } from "framer-motion";

function MainApp() {
  const { language, profile, isLoggedIn, screen, setScreen } = useApp();

  if (!language) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start md:py-6">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[844px] md:h-[844px] md:rounded-[32px] md:shadow-2xl md:border-4 md:border-[#152449] flex flex-col relative overflow-hidden">
          <LanguageSelection />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start md:py-6">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[844px] md:h-[844px] md:rounded-[32px] md:shadow-2xl md:border-4 md:border-[#152449] flex flex-col relative overflow-hidden">
          <BusinessRegistration />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start md:py-6">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[844px] md:h-[844px] md:rounded-[32px] md:shadow-2xl md:border-4 md:border-[#152449] flex flex-col relative overflow-hidden">
          <LockScreen />
        </div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
      case "pos":
        return <POS key="pos" />;
      case "inventory":
        return <Inventory key="inventory" />;
      case "reviews":
        return <Reviews key="reviews" />;
      case "access":
      case "creditId":
        return <CreditId key="access" />;
      default:
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start md:py-6">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-[844px] md:h-[844px] md:rounded-[32px] md:shadow-2xl md:border-4 md:border-[#152449] flex flex-col relative overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-20 relative bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <BottomNav />
        <Modals />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
