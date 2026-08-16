import "../styles/Settings.css";
import { useEffect, useState } from "react";

function Settings() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

      setDarkMode(true);

      document.body.classList.add("dark-theme");

    }

  }, []);

  const toggleTheme = () => {

    if (darkMode) {

      document.body.classList.remove("dark-theme");

      localStorage.setItem("theme","light");

    } else {

      document.body.classList.add("dark-theme");

      localStorage.setItem("theme","dark");

    }

    setDarkMode(!darkMode);

  };

  return (

    <div className="settings-page">

      <div className="settings-card">

        <h1>⚙ Settings</h1>

        <div className="setting-item">

          <div>

            <h3>Dark Theme</h3>

            <p>Enable or Disable Dark Mode</p>

          </div>

          <label className="switch">

            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleTheme}
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>

    </div>

  );

}

export default Settings;