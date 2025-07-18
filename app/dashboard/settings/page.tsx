"use client";

import React, { useState } from "react";
import styles from "./settings.module.css";

const Settings: React.FC = () => {
  const [user, setUser] = useState({
    name: "Oprah Lewis",
    email: "oprahlewis22@gmsil.com",
    phone: "+255 657 374 405",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: false,
  });
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({ ...preferences, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saving settings:", { user, notifications, security, preferences });
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    alert("Logged out successfully!");
    
  };

  return (
    <div className={styles.container}>
      
      
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>User Profile</h2>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleProfileChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleProfileChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleProfileChange}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Notification Preferences</h2>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="email"
              checked={notifications.email}
              onChange={handleNotificationChange}
            />{" "}
            Email Notifications
          </label>
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="sms"
              checked={notifications.sms}
              onChange={handleNotificationChange}
            />{" "}
            SMS Notifications
          </label>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Security Settings</h2>
        <div className={styles.formGroup}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={security.currentPassword}
            onChange={handleSecurityChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={security.newPassword}
            onChange={handleSecurityChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={security.confirmPassword}
            onChange={handleSecurityChange}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              name="twoFactor"
              checked={security.twoFactor}
              onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
            />{" "}
            Enable Two-Factor Authentication
          </label>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Application Preferences</h2>
        <div className={styles.formGroup}>
          <label>Theme</label>
          <select
            name="theme"
            value={preferences.theme}
            onChange={handlePreferenceChange}
            className={styles.select}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Language</label>
          <select
            name="language"
            value={preferences.language}
            onChange={handlePreferenceChange}
            className={styles.select}
          >
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.saveButton} onClick={handleSave}>
          Save Changes
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;