import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import avatar from "../../assets/dashboard/campus-mascots.webp";

import campusMascots from "../../assets/dashboard/campus-mascots.webp";
import clubsMascot from "../../assets/dashboard/clubs-mascot.webp";
import crewMascot from "../../assets/dashboard/crew-mascot.webp";
import eventsMascot from "../../assets/dashboard/events-mascot.webp";
import gatherMascot from "../../assets/dashboard/gather-mascot.webp";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

const featureCards = [
  {
    title: "Events",
    description: "Discover exciting events happening around campus.",
    button: "Explore Events",
    footnote: "12+ events today",
    image: eventsMascot,
    theme: "events",
    route: "/events",
  },
  {
    title: "Crew Calls",
    description: "Find teammates, collaborate and build together.",
    button: "Explore Crew Calls",
    footnote: "8 new crew calls posted today",
    image: crewMascot,
    theme: "crew",
    route: "/crew-calls",
  },
  {
    title: "Gather",
    description: "Ask, discuss and share ideas with your campus.",
    button: "Explore Gather",
    footnote: "25+ new discussions this week",
    image: gatherMascot,
    theme: "gather",
    route: "/gather",
  },
  {
    title: "Clubs",
    description: "Discover communities, meet like-minded students, and find your people.",
    button: "Explore Clubs",
    footnote: "Find your campus community",
    image: clubsMascot,
    theme: "clubs",
    route: "/clubs",
  },
];

const activityItems = [
  { icon: "🤖", title: "Robotics Club", detail: "Workshop started", time: "2m ago" },
  { icon: "🎵", title: "Music Club", detail: "Open mic at Auditorium", time: "5m ago" },
  { icon: "🎨", title: "Design Society", detail: "Poster making event", time: "10m ago" },
  { icon: "🏀", title: "Basketball Match", detail: "Starts in 30m", time: "10:15 AM" },
  { icon: "🎤", title: "Tech Talk", detail: "AI in Future – Seminar", time: "18m ago" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    // Search functionality can be connected when the shared search flow is ready.
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-topbar">
        <form className="dashboard-search" onSubmit={handleSearch}>
          <SearchIcon />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search for events, people, clubs, posts..."
            aria-label="Search Campus Radar"
          />
          <span className="dashboard-shortcut">⌘K</span>
        </form>

        <div className="dashboard-topbar-actions">
          <button className="dashboard-icon-button" type="button" aria-label="Notifications">
            <BellIcon />
            <span className="dashboard-badge">4</span>
          </button>
          <button className="dashboard-icon-button" type="button" aria-label="Messages">
            <MessageIcon />
            <span className="dashboard-badge">2</span>
          </button>
          <button className="dashboard-profile-chip" type="button" onClick={() => navigate("/profile")} aria-label="Open profile">
            <img src={avatar} alt="" />
            <span className="dashboard-chevron">⌄</span>
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-main-column">
          <p className="dashboard-greeting"><span aria-hidden="true">👋</span> Good morning!</p>

          <section className="dashboard-hero">
            <div className="dashboard-hero-copy">
              <h1>
                <span>What's</span>
                <span className="dashboard-hero-highlight">Happening</span>
                <span>on Campus?</span>
              </h1>
              <p>Stay in the loop and make the most of every moment.</p>
              <div className="dashboard-composer-actions">
                <button type="button"><span>▧</span> Photo</button>
                <button type="button"><span>▤</span> Poll</button>
                <button type="button"><span>▣</span> Event</button>
                <button type="button"><span>☺</span> Feeling</button>
              </div>
            </div>

            <div className="dashboard-hero-art">
              <div className="dashboard-float-pill dashboard-pill-hackathon"><span>🏆</span><div><strong>Hackathon 2.0</strong><small>Begins in 1h 20m</small></div></div>
              <div className="dashboard-float-pill dashboard-pill-basketball"><span>🏀</span><div><strong>Basketball Match</strong><small>Starts in 30 min</small></div></div>
              <div className="dashboard-float-pill dashboard-pill-coding"><span>💻</span><div><strong>Coding Club</strong><small>Recruitment Drive · 10:00 AM</small></div></div>
              <div className="dashboard-float-pill dashboard-pill-openmic"><span>🎵</span><div><strong>Open Mic Night</strong><small>Tonight, 7:30 PM</small></div></div>
              <img src={campusMascots} alt="Campus Radar students spending time together on campus" />
            </div>
          </section>

          <section className="dashboard-feature-grid" aria-label="Explore Campus Radar">
            {featureCards.map((card) => (
              <article className={`dashboard-feature-card dashboard-card-${card.theme}`} key={card.title}>
                <div className="dashboard-feature-copy">
                  <h2>{card.title}</h2>
                  <p>{card.description}</p>
                  <button type="button" onClick={() => navigate(card.route)}>
                    {card.button}<span aria-hidden="true">→</span>
                  </button>
                  <small>{card.footnote}</small>
                </div>
                <img className="dashboard-feature-mascot" src={card.image} alt="" />
              </article>
            ))}
          </section>
        </section>

        <aside className="dashboard-pulse-column">
          <section className="dashboard-pulse-card">
            <div className="dashboard-pulse-heading">
              <div><span className="dashboard-live-dot" /> <span className="dashboard-pulse-eyebrow">LIVE PULSE</span></div>
              <h2>Real-time campus activity</h2>
            </div>
            <div className="dashboard-activity-list">
              {activityItems.map((item) => (
                <article className="dashboard-activity-item" key={item.title}>
                  <span className="dashboard-activity-icon" aria-hidden="true">{item.icon}</span>
                  <div className="dashboard-activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div>
                  <time>{item.time}</time>
                </article>
              ))}
            </div>
            <button className="dashboard-view-activity" type="button">View all activity <span>→</span></button>
          </section>
        </aside>
      </main>
    </div>
  );
}

export default Dashboard;
