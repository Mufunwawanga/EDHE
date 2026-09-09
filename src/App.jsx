import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "./context/AppContextFresh";

function Shell({ title, children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white shadow-xl overflow-hidden">
        <header className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Zwix</p>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
        <main className="min-h-[720px] bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

function HomeScreen() {
  const { setScreen } = useApp();

  return (
    <div className="p-5 space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-5 text-white shadow-md">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Overview</p>
        <h2 className="mt-2 text-3xl font-bold">Cash2Cred</h2>
        <p className="mt-2 text-sm text-slate-200">Your business cashflow overview and credit activity dashboard.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {{
          Dashboard: "home",
          POS: "pos",
          Inventory: "inventory",
          Reviews: "reviews",
        }}
      </div>
    </div>
  );
}

function PosScreen() {
  return (
    <div className="p-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Point of Sale</h2>
        <p className="mt-2 text-sm text-slate-600">Sales tracking and quick checkout workflow are ready for the next product iteration.</p>
      </div>
    </div>
  );
}

function InventoryScreen() {
  return (
    <div className="p-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Inventory</h2>
        <p className="mt-2 text-sm text-slate-600">Stock snapshots and restock planning can be connected into the app state as needed.</p>
      </div>
    </div>
  );
}

function ReviewsScreen() {
  return (
    <div className="p-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">Reviews</h2>
        <p className="mt-2 text-sm text-slate-600">Customer sentiment and feedback monitoring can be surfaced here.</p>
      </div>
    </div>
  );
}

function MainApp() {
  const { language, profile, isLoggedIn, screen, setScreen } = useApp();

  if (!language) {
    return (
      <Shell title="Language">
        <div className="p-5">
          <p className="mb-3 text-sm text-slate-600">Choose a language to continue.</p>
          <div className="space-y-3">
            {["English", "Afrikaans", "Zulu", "Sesotho"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setScreen("home")}
                className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-slate-700 shadow-sm"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  if (!profile?.isConfigured) {
    return (
      <Shell title="Setup">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-slate-800">Business registration</h2>
          <p className="mt-2 text-sm text-slate-600">Complete your onboarding steps to start using the app.</p>
        </div>
      </Shell>
    );
  }

  if (!isLoggedIn) {
    return (
      <Shell title="Security">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-slate-800">Locked</h2>
          <p className="mt-2 text-sm text-slate-600">Sign in to access your business workspace.</p>
        </div>
      </Shell>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "pos":
        return <PosScreen />;
      case "inventory":
        return <InventoryScreen />;
      case "reviews":
        return <ReviewsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <Shell title="Dashboard">
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

      <div className="border-t border-slate-200 bg-white px-3 py-3">
        <div className="grid grid-cols-4 gap-2">
          {{
            home: "Home",
            pos: "POS",
            inventory: "Stock",
            reviews: "Reviews",
          }}
        </div>
      </div>
    </Shell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
