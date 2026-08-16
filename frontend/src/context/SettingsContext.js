import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved !== "light"; // Default to dark (true) if nothing saved, or if "dark" is saved
  });

  const [notificationEnabled, setNotificationEnabled] = useState(
    JSON.parse(localStorage.getItem("notification") ?? "true")
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const value = !darkMode;
    setDarkMode(value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  const toggleNotification = () => {

    const value = !notificationEnabled;

    setNotificationEnabled(value);

    localStorage.setItem(
      "notification",
      JSON.stringify(value)
    );

  };

  return (

    <SettingsContext.Provider
      value={{
        darkMode,
        toggleTheme,
        notificationEnabled,
        toggleNotification,
      }}
    >
      {children}
    </SettingsContext.Provider>

  );

};

export const useSettings = () =>
  useContext(SettingsContext);