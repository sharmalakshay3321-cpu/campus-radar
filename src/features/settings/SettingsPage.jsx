import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

const DEFAULT_SETTINGS = {
  theme: "light",
  eventNotifications: true,
  campusNotifications: true,
  profileVisibility: "public",
};

function readSettings() {
  try {
    const saved = localStorage.getItem("campusRadar_settings");

    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Could not load settings:", error);
  }

  return DEFAULT_SETTINGS;
}

function readCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem("campusRadar_currentUser") || "null"
    );
  } catch {
    return null;
  }
}

function SettingsPage() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(readSettings);
  const [currentUser] = useState(readCurrentUser);
  const [savedMessage, setSavedMessage] = useState("");

  // Save settings whenever a preference changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        "campusRadar_settings",
        JSON.stringify(settings)
      );

      // This attribute can also be used by your global CSS.
      document.documentElement.dataset.theme = settings.theme;
    } catch (error) {
      console.error("Could not save settings:", error);
    }
  }, [settings]);

  // Update one setting.
  function updateSetting(key, value) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSavedMessage("Settings saved");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 2000);
  }

  // Navigate to the existing Profile page.
  function handleProfile() {
    navigate("/profile");
  }

  const displayName =
    currentUser?.name ||
    currentUser?.username ||
    "Campus Radar Student";

  const displayEmail =
    currentUser?.email ||
    "Account information is not available";

  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <main
      className={`settings-page ${
        settings.theme === "dark" ? "settings-dark" : ""
      }`}
    >
      {/* Return to the teammate's Dashboard page. */}
      <div className="settings-topbar">
        <button
          type="button"
          className="settings-back-home"
          onClick={() => navigate("/dashboard")}
        >
          <span aria-hidden="true">←</span>
          Back to home
        </button>
      </div>

      {/* =========================
          PAGE HEADER
      ========================= */}
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">CAMPUS RADAR</p>

          <h1>Settings</h1>

          <p className="settings-subtitle">
            Manage your preferences and account.
          </p>
        </div>

        <div className="settings-header-icon" aria-hidden="true">
          ⚙
        </div>
      </header>

      {savedMessage && (
        <div className="settings-save-message" role="status">
          ✓ {savedMessage}
        </div>
      )}

      <div className="settings-layout">

        {/* =========================
            MAIN SETTINGS CONTENT
            Sections appear in the
            requested order.
        ========================= */}
        <div className="settings-content">

          {/* 1. ACCOUNT */}
          <section
            className="settings-card"
            id="account"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ◎
              </div>

              <div>
                <h2>Account</h2>
                <p>Your Campus Radar account information.</p>
              </div>
            </div>

            <div className="settings-account">
              <div className="settings-avatar">
                {avatarLetter}
              </div>

              <div className="settings-account-info">
                <h3>{displayName}</h3>
                <p>{displayEmail}</p>
              </div>
            </div>

          </section>

          
          <section
            className="settings-card"
            id="profile-navigation"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ♙
              </div>

              <div>
                <h2>Profile</h2>
                <p>View and manage your personal profile.</p>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <h3>Your Campus Radar profile</h3>
                <p>
                  View your profile and personal information.
                </p>
              </div>

              <button
                type="button"
                className="settings-profile-button"
                onClick={handleProfile}
              >
                View profile ↗
              </button>
            </div>
          </section>

          {/* 3. NOTIFICATIONS */}
          <section
            className="settings-card"
            id="notifications"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ♧
              </div>

              <div>
                <h2>Notifications</h2>
                <p>Choose which campus updates you prefer.</p>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <h3>Event updates</h3>
                <p>
                  Preferences for college event announcements.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.eventNotifications}
                aria-label="Event notifications"
                className={`settings-toggle ${
                  settings.eventNotifications ? "on" : ""
                }`}
                onClick={() =>
                  updateSetting(
                    "eventNotifications",
                    !settings.eventNotifications
                  )
                }
              >
                <span />
              </button>
            </div>

            <div className="settings-divider" />

            <div className="settings-option-row">
              <div>
                <h3>Campus activity</h3>
                <p>
                  Preferences for clubs and crew calls.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={settings.campusNotifications}
                aria-label="Campus activity notifications"
                className={`settings-toggle ${
                  settings.campusNotifications ? "on" : ""
                }`}
                onClick={() =>
                  updateSetting(
                    "campusNotifications",
                    !settings.campusNotifications
                  )
                }
              >
                <span />
              </button>
            </div>

            <p className="settings-note">
              These switches save your preferences locally.
              Actual notifications will need to be connected
              to the relevant features.
            </p>
          </section>

          {/* 4. APPEARANCE */}
          <section
            className="settings-card"
            id="appearance"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ◐
              </div>

              <div>
                <h2>Appearance</h2>
                <p>Choose your preferred color theme.</p>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <h3>Color theme</h3>
                <p>
                  Switch between light and dark mode.
                </p>
              </div>

              <div className="theme-options">
                <button
                  type="button"
                  className={`theme-option ${
                    settings.theme === "light" ? "selected" : ""
                  }`}
                  onClick={() =>
                    updateSetting("theme", "light")
                  }
                  aria-pressed={settings.theme === "light"}
                >
                  <span className="theme-preview light-preview">
                    ☀
                  </span>
                  Light
                </button>

                <button
                  type="button"
                  className={`theme-option ${
                    settings.theme === "dark" ? "selected" : ""
                  }`}
                  onClick={() =>
                    updateSetting("theme", "dark")
                  }
                  aria-pressed={settings.theme === "dark"}
                >
                  <span className="theme-preview dark-preview">
                    ☾
                  </span>
                  Dark
                </button>
              </div>
            </div>

            <p className="settings-note">
              Your preference is saved in this browser.
              The theme currently applies to this Settings page;
              other pages need to support the same theme setting.
            </p>
          </section>

          {/* 5. PRIVACY */}
          <section
            className="settings-card"
            id="privacy"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ◈
              </div>

              <div>
                <h2>Privacy</h2>
                <p>Manage your profile visibility preference.</p>
              </div>
            </div>

            <div className="settings-option-row">
              <div>
                <h3>Profile visibility</h3>
                <p>
                  Choose your preferred visibility setting.
                </p>
              </div>

              <select
                className="settings-select"
                value={settings.profileVisibility}
                onChange={(event) =>
                  updateSetting(
                    "profileVisibility",
                    event.target.value
                  )
                }
                aria-label="Profile visibility"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <p className="settings-note">
              This preference is saved locally. It will not
              change who can view your profile until the Profile
              page and the rest of the app use this setting.
            </p>
          </section>

          {/* 6. ABOUT CAMPUS RADAR */}
          <section
            className="settings-card about-card"
            id="about"
          >
            <div className="settings-section-heading">
              <div className="settings-section-icon">
                ⓘ
              </div>

              <div>
                <h2>About Campus Radar</h2>
                <p>Everything you need to know about us.</p>
              </div>
            </div>

            <div className="about-content">
              <h3>Explore your campus.</h3>

              <p>
                Campus Radar is a student-focused platform
                designed to bring campus life together in one
                place. It helps students discover what's
                happening around their college and stay
                connected with their campus community.
              </p>

              <p>
                From college events and club activities to crew
                calls and campus updates, Campus Radar makes it
                easier to discover opportunities, participate
                in activities, and connect with fellow students.
              </p>

              <p>
                Our goal is simple: to help students explore
                more, get involved, and make the most of their
                college experience.
              </p>

              <div className="about-tagline">
                <span>Campus Radar</span>
                <span>Make campus life count.</span>
              </div>
            </div>
          </section>

          {/* FOOTER */}
          <footer className="settings-footer">
            <span>Campus Radar</span>
            <span>Make campus life count.</span>
          </footer>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;