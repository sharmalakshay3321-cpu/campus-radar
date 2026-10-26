
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
