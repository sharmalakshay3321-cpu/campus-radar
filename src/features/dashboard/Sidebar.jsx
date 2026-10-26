
import React from "react";
import { NavLink, Link } from "react-router-dom";
const iconPaths = {
  Home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></>,
  CalendarDays: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></>,
  Users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  Phone: <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7 10a16 16 0 0 0 7 7l1.8-1.9a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.7 2Z"/></>,
  MessageCircle: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></>,
  Bookmark: <><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4z"/></>,
  Archive: <><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/></>,
  FileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
  UserRound: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
  Settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z"/></>,
};
const makeIcon = (name) => function SidebarIcon({ size = 21, strokeWidth = 1.8, className }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
};
const Home = makeIcon("Home");
const CalendarDays = makeIcon("CalendarDays");
const Users = makeIcon("Users");
const Phone = makeIcon("Phone");
const MessageCircle = makeIcon("MessageCircle");
const Bookmark = makeIcon("Bookmark");
const Archive = makeIcon("Archive");
const FileText = makeIcon("FileText");
const UserRound = makeIcon("UserRound");
const Settings = makeIcon("Settings");

import "./Sidebar.css";
import logo from "../../assets/logo.png";

const navigationSections = [
  {
    title: "Main Menu",
    items: [
      { label: "Home", path: "/dashboard", icon: Home, end: true },
      { label: "Events", path: "/events", icon: CalendarDays },
      { label: "Crew Calls", path: "/crew-calls", icon: Phone },
      { label: "Gather", path: "/gather", icon: MessageCircle },
      { label: "Clubs", path: "/clubs", icon: Users },
    ],
  },
  {
    title: "Your Space",
    items: [
      { label: "Saved", path: "/saved", icon: Bookmark, end: true },
      { label: "Archive", path: "/archive", icon: Archive, end: true },
      { label: "My Posts", path: "/my-posts", icon: FileText },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", path: "/profile", icon: UserRound },
      { label: "Settings", path: "/settings", icon: Settings, end: true },
    ],
  },
];

export default function Sidebar({
  account,
  profilePath = "/profile",
  onNavigate,
  onClose,
}) {
  const accountName =
    account?.displayName ||
    account?.name ||
    account?.clubName ||
    "Account";

  const accountType =
    account?.accountType || account?.type || "";

  const accountLabel =
    accountType.toLowerCase() === "club"
      ? "Club"
      : accountType.toLowerCase() === "student"
        ? "Student"
        : "";

  const avatar =
    account?.avatarUrl ||
    account?.profileImage ||
    account?.avatar ||
    null;

  const handleNavigation = (label) => {
    onNavigate?.(label);
    onClose?.();
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <Link
        to="/dashboard"
        className="sidebar-brand"
        aria-label="Campus Radar home"
        onClick={() => handleNavigation("Home")}
      >
        <img
          src={logo}
          alt="Campus Radar"
          className="sidebar-logo"
        />
      </Link>

      {/* Navigation */}
      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        {navigationSections.map((section) => (
          <section
            className="sidebar-section"
            key={section.title}
          >
            <h2 className="sidebar-section-title">
              {section.title}
            </h2>

            <div className="sidebar-menu">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end ?? false}
                    className={({ isActive }) =>
                      `sidebar-link${isActive ? " active" : ""}`
                    }
                    onClick={() => handleNavigation(item.label)}
                  >
                    <Icon
                      className="sidebar-icon"
                      size={21}
                      strokeWidth={1.8}
                    />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      {/* Current account */}
      <Link
        to={profilePath}
        className="sidebar-account"
        onClick={() => handleNavigation("Profile")}
        aria-label={`Open ${accountName}'s profile`}
      >
        <div className="sidebar-avatar">
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <UserRound size={22} strokeWidth={1.8} />
          )}
        </div>

        <div className="sidebar-account-info">
          <span className="sidebar-account-name">
            {accountName}
          </span>

          {accountLabel && (
            <span className="sidebar-account-type">
              {accountLabel}
            </span>
          )}
        </div>
      </Link>
    </aside>
  );
}
