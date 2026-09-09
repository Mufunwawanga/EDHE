import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState("en");
  const [profile, setProfile] = useState({
    isConfigured: true,
    businessName: "Zwix Business",
  });
  const [screen, setScreen] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      profile,
      setProfile,
      screen,
      setScreen,
      isLoggedIn,
      setIsLoggedIn,
    }),
    [language, profile, screen, isLoggedIn],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
}
