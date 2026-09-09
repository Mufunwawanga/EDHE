import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import POS from "./components/POS";
<<<<<<< HEAD
import TradeView from "./components/TradeView";
import StockView from "./components/StockView";
=======
import Inventory from "./components/Inventory";
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
import Reviews from "./components/Reviews";
import CreditId from "./components/CreditId";
import { LanguageSelection, BusinessRegistration, LockScreen } from "./components/Onboarding";
import Modals from "./components/Modals";
import { AnimatePresence, motion } from "framer-motion";

<<<<<<< HEAD
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

=======
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
function MainApp() {
  const { language, profile, isLoggedIn, screen, setScreen } = useApp();

  if (!language) {
    return (
<<<<<<< HEAD
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
=======
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
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    );
  }

  if (!isLoggedIn) {
    return (
<<<<<<< HEAD
      <PhoneWrapper>
        <LockScreen />
      </PhoneWrapper>
=======
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start md:py-6">
        <div className="w-full max-w-md bg-white min-h-screen md:min-h-[844px] md:h-[844px] md:rounded-[32px] md:shadow-2xl md:border-4 md:border-[#152449] flex flex-col relative overflow-hidden">
          <LockScreen />
        </div>
      </div>
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
<<<<<<< HEAD
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
=======
      case "pos":
        return <POS key="pos" />;
      case "inventory":
        return <Inventory key="inventory" />;
      case "reviews":
        return <Reviews key="reviews" />;
      case "access":
      case "creditId":
        return <CreditId key="access" />;
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
      default:
        return <Dashboard key="home" onNavigateToCreditId={() => setScreen("creditId")} />;
    }
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> a0b6e3b5f37ab32267f7c0ee6c980903100ed02c
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
