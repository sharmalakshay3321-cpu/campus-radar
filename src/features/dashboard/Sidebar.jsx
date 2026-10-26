/*
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import campusRadarLogo from "../assets/campus-radar-logo.png";

const sidebarItems = [
  { name: "Home", path: "/", icon: "⌂", end: true },
  { name: "Events", path: "/events", icon: "▦" },
  { name: "Crew Calls", path: "/crew-calls", icon: "♧" },
  { name: "Gather", path: "/gather", icon: "◇" },
  { name: "Clubs", path: "/clubs", icon: "♜" },
  { name: "Notifications", path: "/notifications", icon: "♢" },
  { name: "Archive", path: "/archive", icon: "▤" },
  { name: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  return (
    <aside className="cr-sidebar">
      <div className="cr-sidebar__brand">
        <img
          className="cr-sidebar__logo"
          src={campusRadarLogo}
          alt="Campus Radar logo"
        />
      </div>

      <div className="cr-sidebar__divider" />

      <p className="cr-sidebar__heading">EXPLORE YOUR CAMPUS</p>

      <nav className="cr-sidebar__nav" aria-label="Main navigation">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `cr-sidebar__link${isActive ? " active" : ""}`
            }
          >
            <span className="cr-sidebar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="cr-sidebar__label">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
*/


import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  CalendarDays,
  Users,
  Phone,
  MessageCircle,
  Bookmark,
  Archive,
  FileText,
  UserRound,
  Settings,
} from "lucide-react";

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
