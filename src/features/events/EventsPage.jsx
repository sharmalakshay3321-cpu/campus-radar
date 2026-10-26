/*import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import eventsBanner from "../../assets/events-banner.jpg";
import "./EventsPage.css";


const EVENTS_KEY = "campusRadar_events";
const SAVED_KEY = "campusRadar_savedItems";
const CURRENT_USER_KEY = "campusRadar_currentUser";

const DEMO_EVENTS = [
  {
    id: "event-hackathon-01",
    title: "Campus Code Clash",
    category: "Hackathon",
    date: "2026-11-12",
    time: "9:00 AM",
    location: "Babbage Block",
    description: "Build a working solution with a team, solve real-world challenges, and put your coding and problem-solving skills to the test.",
    organizer: "Coding Club",
    createdById: "demo-club-coding",
    createdByType: "club",
  },
  {
    id: "event-cultural-01",
    title: "Rhythm of Campus",
    category: "Cultural",
    date: "2026-11-15",
    time: "4:00 PM",
    location: "Main Auditorium",
    description: "An evening of music, dance, performances, and creativity featuring talented students from across campus.",
    organizer: "Cultural Club",
    createdById: "demo-club-cultural",
    createdByType: "club",
  },
  {
    id: "event-sports-01",
    title: "Inter-Block Sports Meet",
    category: "Sports",
    date: "2026-11-18",
    time: "8:00 AM",
    location: "University Sports Ground",
    description: "Bring your team spirit to a day of friendly competition, athletic challenges, and campus sports.",
    organizer: "Sports Club",
    createdById: "demo-club-sports",
    createdByType: "club",
  },
  {
    id: "event-workshop-01",
    title: "Design Beyond Screens",
    category: "Workshop",
    date: "2026-11-21",
    time: "11:00 AM",
    location: "Innovation Lab",
    description: "Explore UI design principles, user journeys, prototyping, and practical ways to turn ideas into useful digital experiences.",
    organizer: "Design Club",
    createdById: "demo-club-design",
    createdByType: "club",
  },
  {
    id: "event-tech-01",
    title: "Future Tech Forum",
    category: "Technology",
    date: "2026-11-25",
    time: "10:00 AM",
    location: "Turing Block",
    description: "Discover new ideas in artificial intelligence, robotics, software, and emerging technologies through student-led talks.",
    organizer: "Tech Club",
    createdById: "demo-club-tech",
    createdByType: "club",
  },
  {
    id: "event-career-01",
    title: "Career Launchpad",
    category: "Career",
    date: "2026-11-28",
    time: "2:00 PM",
    location: "Seminar Hall",
    description: "Get practical advice on resumes, portfolios, interviews, internships, and preparing for your next career opportunity.",
    organizer: "Career Development Club",
    createdById: "demo-club-career",
    createdByType: "club",
  },
  {
    id: "event-robotics-01",
    title: "Robotics Build Lab",
    category: "Technology",
    date: "2026-12-02",
    time: "10:30 AM",
    location: "Robotics Laboratory",
    description: "See student-built robots in action and learn how sensors, control systems, and code work together in practical projects.",
    organizer: "Robotics Society",
    createdById: "demo-club-robotics",
    createdByType: "club",
  },
  {
    id: "event-startup-01",
    title: "Startup Spark",
    category: "Career",
    date: "2026-12-05",
    time: "12:00 PM",
    location: "Innovation Centre",
    description: "Turn an early idea into a pitch, meet student founders, and learn the basics of validating a startup concept.",
    organizer: "Entrepreneurship Cell",
    createdById: "demo-club-startup",
    createdByType: "club",
  },
  {
    id: "event-gaming-01",
    title: "Game Jam Weekend",
    category: "Hackathon",
    date: "2026-12-08",
    time: "9:30 AM",
    location: "Computer Lab 3",
    description: "Team up to design and build a small game from scratch. Bring your creativity, logic, and love of interactive experiences.",
    organizer: "Game Dev Club",
    createdById: "demo-club-gaming",
    createdByType: "club",
  },
  {
    id: "event-photo-01",
    title: "Frames of Campus",
    category: "Cultural",
    date: "2026-12-11",
    time: "3:00 PM",
    location: "Campus Amphitheatre",
    description: "Join a campus photography walk, practise composition, and share the stories you notice in everyday student life.",
    organizer: "Photography Club",
    createdById: "demo-club-photo",
    createdByType: "club",
  },
  {
    id: "event-green-01",
    title: "Green Campus Challenge",
    category: "Other",
    date: "2026-12-14",
    time: "9:00 AM",
    location: "Central Lawn",
    description: "Work with fellow students on simple sustainability ideas, a campus clean-up activity, and greener everyday habits.",
    organizer: "Eco Club",
    createdById: "demo-club-eco",
    createdByType: "club",
  },
  {
    id: "event-research-01",
    title: "Student Research Showcase",
    category: "Technology",
    date: "2026-12-17",
    time: "11:00 AM",
    location: "Research and Development Centre",
    description: "Explore student projects across computing, electronics, engineering, and design, with time to ask presenters about their work.",
    organizer: "Research Forum",
    createdById: "demo-club-research",
    createdByType: "club",
  },
  {
    id: "event-openmic-01",
    title: "Open Mic Under the Stars",
    category: "Cultural",
    date: "2026-12-20",
    time: "5:30 PM",
    location: "Open-Air Theatre",
    description: "Take the stage or cheer from the audience during an informal evening of poetry, acoustic music, comedy, and storytelling.",
    organizer: "Performing Arts Club",
    createdById: "demo-club-openmic",
    createdByType: "club",
  },
  {
    id: "event-sportsfitness-01",
    title: "Campus Fitness Circuit",
    category: "Sports",
    date: "2027-01-09",
    time: "7:30 AM",
    location: "Athletics Track",
    description: "Try a friendly fitness circuit with warm-ups, team challenges, and beginner-friendly activities led by student volunteers.",
    organizer: "Fitness Club",
    createdById: "demo-club-fitness",
    createdByType: "club",
  },
];

const CATEGORIES = [
  "All events",
  "Hackathon",
  "Sports",
  "Cultural",
  "Workshop",
  "Technology",
  "Career",
  "Other",
];

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function formatDate(dateValue) {
  if (!dateValue) return { day: "TBA", month: "DATE" };
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "TBA", month: "DATE" };
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

function getCategoryIcon(category) {
  const icons = {
    Hackathon: "⌘",
    Sports: "↗",
    Cultural: "♫",
    Workshop: "✳",
    Technology: "⌘",
    Career: "↗",
  };
  return icons[category] || "✦";
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All events");
  const [searchText, setSearchText] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedEvents = readArray(EVENTS_KEY);
    const demoIds = new Set(DEMO_EVENTS.map((event) => event.id));
    const userCreatedEvents = storedEvents.filter((event) => !demoIds.has(event.id));
    const mergedEvents = [...DEMO_EVENTS, ...userCreatedEvents];

    // Keep the demo set up to date without deleting events created by club accounts.
    localStorage.setItem(EVENTS_KEY, JSON.stringify(mergedEvents));
    setEvents(mergedEvents);
    setSavedItems(readArray(SAVED_KEY));
    setCurrentUser(readCurrentUser());
  }, []);

  useEffect(() => {
    const syncAccount = () => {
      setCurrentUser(readCurrentUser());
      setSavedItems(readArray(SAVED_KEY));
    };

    window.addEventListener("storage", syncAccount);
    return () => window.removeEventListener("storage", syncAccount);
  }, []);

  const currentUserId = currentUser?.id;
  const isClub = currentUser?.userType === "club";

  const visibleEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return events
      .filter((event) => {
        const categoryMatch =
          activeCategory === "All events" ||
          String(event.category || "").toLowerCase() === activeCategory.toLowerCase();

        const searchable = [
          event.title,
          event.category,
          event.location,
          event.organizer,
          event.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchMatch = !query || searchable.includes(query);
        const savedMatch =
          !savedOnly ||
          savedItems.some(
            (item) =>
              item.itemType === "event" &&
              item.itemId === event.id &&
              (!currentUserId || item.userId === currentUserId)
          );

        return categoryMatch && searchMatch && savedMatch;
      })
      .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"));
  }, [events, activeCategory, searchText, savedOnly, savedItems, currentUserId]);

  function isSaved(eventId) {
    return savedItems.some(
      (item) =>
        item.itemType === "event" &&
        item.itemId === eventId &&
        (!currentUserId || item.userId === currentUserId)
    );
  }

  function toggleSave(event) {
    if (!currentUserId) {
      window.alert("Please sign in to save events.");
      return;
    }

    const alreadySaved = isSaved(event.id);
    const next = alreadySaved
      ? savedItems.filter(
          (item) =>
            !(
              item.itemType === "event" &&
              item.itemId === event.id &&
              item.userId === currentUserId
            )
        )
      : [
          ...savedItems,
          {
            id: `saved-${Date.now()}`,
            userId: currentUserId,
            itemType: "event",
            itemId: event.id,
            savedAt: new Date().toISOString(),
          },
        ];

    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSavedItems(next);
      setNotice(alreadySaved ? "Removed from your saved events." : "Event saved for later.");
    } catch {
      setNotice("This event could not be saved in this browser.");
    }
  }

  return (
    <main className="events-page">
     {/* Events Page Banner */
  /*   <section
  className="event3s-banner"
  style={{
    backgroundImage: `linear-gradient(
      rgba(10, 15, 30, 0.20),
      rgba(10, 15, 30, 0.20)
    ), url(${eventsBanner})`,
  }}
></section>
<section
  className="events-banner"
  style={{
    backgroundImage: `url(${eventsBanner})`,
  }}
>
  {/* Keep your existing banner content and image-related layout here */
/*</section>

      <section className="events-page__content">
        <div className="events-page__section-heading">
          <div>
            <p className="events-page__eyebrow">CAMPUS EVENTS</p>
            <h2>Find your next campus moment</h2>
            <p className="events-page__muted">Explore workshops, technology, culture, sports, careers, and more.</p>
          </div>

          {isClub && (
            <Link className="events-page__create-button" to="/events/create">
              <span aria-hidden="true">＋</span> Create event
            </Link>
          )}
        </div>

        <div className="events-page__toolbar">
          <label className="events-page__search">
            <span className="events-page__search-icon" aria-hidden="true">⌕</span>
            <span className="events-page__sr-only">Search events</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search events, clubs or places"
            />
          </label>

          <button
            type="button"
            className={`events-page__saved-toggle ${savedOnly ? "is-active" : ""}`}
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
          >
            <span aria-hidden="true">♡</span>
            {savedOnly ? "Showing saved" : "Saved events"}
          </button>
        </div>

        <div className="events-page__filters" aria-label="Filter events by category">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              className={`events-page__filter ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="events-page__results-line" id="all-events">
          <span>{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"}</span>
          <span>Made for campus life <span aria-hidden="true"></span></span>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="events-page__list">
            {visibleEvents.map((event, index) => {
              const date = formatDate(event.date);
              const saved = isSaved(event.id);
              const artCategory = String(event.category || "event")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

              return (
                <article className="events-page__card" key={event.id}>
                  <div className={`events-page__card-art events-page__card-art--${artCategory} events-page__card-art--variant-${index % 4}`}>
                    <span className="events-page__category-tag">{event.category || "Campus event"}</span>

                    <button
                      type="button"
                      className={`events-page__bookmark ${saved ? "is-saved" : ""}`}
                      onClick={() => toggleSave(event)}
                      aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
                      aria-pressed={saved}
                    >
                      {saved ? "♥" : "♡"}
                    </button>

                    <div className="events-page__date-badge">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>

                    <span className="events-page__art-icon" aria-hidden="true">
                      {getCategoryIcon(event.category)}
                    </span>
                    <span className="events-page__art-spark events-page__art-spark--one" aria-hidden="true"></span>
                    <span className="events-page__art-spark events-page__art-spark--two" aria-hidden="true"></span>
                    <span className="events-page__art-shape" aria-hidden="true" />
                  </div>

                  <div className="events-page__card-body">
                    <p className="events-page__organizer">{event.organizer || "Campus community"}</p>
                    <h3>{event.title || "Untitled event"}</h3>
                    <p className="events-page__description">
                      {event.description || "More details about this campus event will be shared soon."}
                    </p>

                    <div className="events-page__meta">
                      <span><span aria-hidden="true">◷</span> {event.time || "Time TBA"}</span>
                      <span><span aria-hidden="true">⌖</span> {event.location || "Location TBA"}</span>
                    </div>

                    <div className="events-page__card-actions">
                      <Link
                        className="events-page__details-link"
                        to={`/events/${encodeURIComponent(event.id)}`}
                      >
                        View details <span aria-hidden="true">↗</span>
                      </Link>
                      <span className="events-page__card-note">Be there. Be part of it.</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="events-page__empty">
            <span className="events-page__empty-icon" aria-hidden="true">✳</span>
            <h3>{savedOnly ? "No saved events yet" : "No events found just yet"}</h3>
            <p>Try another category or search. There’s always room for a new plan.</p>
            <button
              type="button"
              className="events-page__reset-button"
              onClick={() => {
                setActiveCategory("All events");
                setSearchText("");
                setSavedOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {notice && (
          <div className="events-page__notice" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <footer className="events-page__footer">
          <span className="events-page__footer-mark"></span>
          <span>Discover. Connect. Be part of it.</span>
          <span>Campus Radar · Events</span>
        </footer>
      </section>
    </main>
  );
}


*/
/*


import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import eventsBanner from "../../assets/events-banner.jpg";
import "./EventsPage.css";


const EVENTS_KEY = "campusRadar_events";
const SAVED_KEY = "campusRadar_savedItems";
const CURRENT_USER_KEY = "campusRadar_currentUser";

const DEMO_EVENTS = [
  {
    id: "event-hackathon-01",
    clubId:"coding-club",
    title: "Campus Code Clash",
    category: "Hackathon",
    date: "2026-11-12",
    time: "9:00 AM",
    location: "Babbage Block",
    description: "Build a working solution with a team, solve real-world challenges, and put your coding and problem-solving skills to the test.",
    organizer: "Coding Club",
    createdById: "demo-club-coding",
    createdByType: "club",
  },
  {
    id: "event-cultural-01",
    title: "Rhythm of Campus",
    category: "Cultural",
    date: "2026-11-15",
    time: "4:00 PM",
    location: "Main Auditorium",
    description: "An evening of music, dance, performances, and creativity featuring talented students from across campus.",
    organizer: "Cultural Club",
    createdById: "demo-club-cultural",
    createdByType: "club",
  },
  {
    id: "event-sports-01",
    title: "Inter-Block Sports Meet",
    category: "Sports",
    date: "2026-11-18",
    time: "8:00 AM",
    location: "University Sports Ground",
    description: "Bring your team spirit to a day of friendly competition, athletic challenges, and campus sports.",
    organizer: "Sports Club",
    createdById: "demo-club-sports",
    createdByType: "club",
  },
  {
    id: "event-workshop-01",
    title: "Design Beyond Screens",
    category: "Workshop",
    date: "2026-11-21",
    time: "11:00 AM",
    location: "Innovation Lab",
    description: "Explore UI design principles, user journeys, prototyping, and practical ways to turn ideas into useful digital experiences.",
    organizer: "Design Club",
    createdById: "demo-club-design",
    createdByType: "club",
  },
  {
    id: "event-tech-01",
    title: "Future Tech Forum",
    category: "Technology",
    date: "2026-11-25",
    time: "10:00 AM",
    location: "Turing Block",
    description: "Discover new ideas in artificial intelligence, robotics, software, and emerging technologies through student-led talks.",
    organizer: "Tech Club",
    createdById: "demo-club-tech",
    createdByType: "club",
  },
  {
    id: "event-career-01",
    title: "Career Launchpad",
    category: "Career",
    date: "2026-11-28",
    time: "2:00 PM",
    location: "Seminar Hall",
    description: "Get practical advice on resumes, portfolios, interviews, internships, and preparing for your next career opportunity.",
    organizer: "Career Development Club",
    createdById: "demo-club-career",
    createdByType: "club",
  },
  {
    id: "event-robotics-01",
    title: "Robotics Build Lab",
    category: "Technology",
    date: "2026-12-02",
    time: "10:30 AM",
    location: "Robotics Laboratory",
    description: "See student-built robots in action and learn how sensors, control systems, and code work together in practical projects.",
    organizer: "Robotics Society",
    createdById: "demo-club-robotics",
    createdByType: "club",
  },
  {
    id: "event-startup-01",
    title: "Startup Spark",
    category: "Career",
    date: "2026-12-05",
    time: "12:00 PM",
    location: "Innovation Centre",
    description: "Turn an early idea into a pitch, meet student founders, and learn the basics of validating a startup concept.",
    organizer: "Entrepreneurship Cell",
    createdById: "demo-club-startup",
    createdByType: "club",
  },
  {
    id: "event-gaming-01",
    title: "Game Jam Weekend",
    category: "Hackathon",
    date: "2026-12-08",
    time: "9:30 AM",
    location: "Computer Lab 3",
    description: "Team up to design and build a small game from scratch. Bring your creativity, logic, and love of interactive experiences.",
    organizer: "Game Dev Club",
    createdById: "demo-club-gaming",
    createdByType: "club",
  },
  {
    id: "event-photo-01",
    title: "Frames of Campus",
    category: "Cultural",
    date: "2026-12-11",
    time: "3:00 PM",
    location: "Campus Amphitheatre",
    description: "Join a campus photography walk, practise composition, and share the stories you notice in everyday student life.",
    organizer: "Photography Club",
    createdById: "demo-club-photo",
    createdByType: "club",
  },
  {
    id: "event-green-01",
    title: "Green Campus Challenge",
    category: "Other",
    date: "2026-12-14",
    time: "9:00 AM",
    location: "Central Lawn",
    description: "Work with fellow students on simple sustainability ideas, a campus clean-up activity, and greener everyday habits.",
    organizer: "Eco Club",
    createdById: "demo-club-eco",
    createdByType: "club",
  },
  {
    id: "event-research-01",
    title: "Student Research Showcase",
    category: "Technology",
    date: "2026-12-17",
    time: "11:00 AM",
    location: "Research and Development Centre",
    description: "Explore student projects across computing, electronics, engineering, and design, with time to ask presenters about their work.",
    organizer: "Research Forum",
    createdById: "demo-club-research",
    createdByType: "club",
  },
  {
    id: "event-openmic-01",
    title: "Open Mic Under the Stars",
    category: "Cultural",
    date: "2026-12-20",
    time: "5:30 PM",
    location: "Open-Air Theatre",
    description: "Take the stage or cheer from the audience during an informal evening of poetry, acoustic music, comedy, and storytelling.",
    organizer: "Performing Arts Club",
    createdById: "demo-club-openmic",
    createdByType: "club",
  },
  {
    id: "event-sportsfitness-01",
    title: "Campus Fitness Circuit",
    category: "Sports",
    date: "2027-01-09",
    time: "7:30 AM",
    location: "Athletics Track",
    description: "Try a friendly fitness circuit with warm-ups, team challenges, and beginner-friendly activities led by student volunteers.",
    organizer: "Fitness Club",
    createdById: "demo-club-fitness",
    createdByType: "club",
  },
];

const CATEGORIES = [
  "All events",
  "Hackathon",
  "Sports",
  "Cultural",
  "Workshop",
  "Technology",
  "Career",
  "Other",
];

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function formatDate(dateValue) {
  if (!dateValue) return { day: "TBA", month: "DATE" };
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "TBA", month: "DATE" };
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

function getCategoryIcon(category) {
  const icons = {
    Hackathon: "⌘",
    Sports: "↗",
    Cultural: "♫",
    Workshop: "✳",
    Technology: "⌘",
    Career: "↗",
  };
  return icons[category] || "✦";
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All events");
  const [searchText, setSearchText] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedEvents = readArray(EVENTS_KEY);
    const demoIds = new Set(DEMO_EVENTS.map((event) => event.id));
    const userCreatedEvents = storedEvents.filter((event) => !demoIds.has(event.id));
    const mergedEvents = [...DEMO_EVENTS, ...userCreatedEvents];

    // Keep the demo set up to date without deleting events created by club accounts.
    localStorage.setItem(EVENTS_KEY, JSON.stringify(mergedEvents));
    setEvents(mergedEvents);
    setSavedItems(readArray(SAVED_KEY));
    setCurrentUser(readCurrentUser());
  }, []);

  useEffect(() => {
    const syncAccount = () => {
      setCurrentUser(readCurrentUser());
      setSavedItems(readArray(SAVED_KEY));
    };

    window.addEventListener("storage", syncAccount);
    return () => window.removeEventListener("storage", syncAccount);
  }, []);

  const currentUserId = currentUser?.id;
  const isClub = currentUser?.userType === "club";

  const visibleEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return events
      .filter((event) => {
        const categoryMatch =
          activeCategory === "All events" ||
          String(event.category || "").toLowerCase() === activeCategory.toLowerCase();

        const searchable = [
          event.title,
          event.category,
          event.location,
          event.organizer,
          event.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchMatch = !query || searchable.includes(query);
        const savedMatch =
          !savedOnly ||
          savedItems.some(
            (item) =>
              item.itemType === "event" &&
              item.itemId === event.id &&
              (!currentUserId || item.userId === currentUserId)
          );

        return categoryMatch && searchMatch && savedMatch;
      })
      .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"));
  }, [events, activeCategory, searchText, savedOnly, savedItems, currentUserId]);

  function isSaved(eventId) {
    return savedItems.some(
      (item) =>
        item.itemType === "event" &&
        item.itemId === eventId &&
        (!currentUserId || item.userId === currentUserId)
    );
  }

  function toggleSave(event) {
    if (!currentUserId) {
      window.alert("Please sign in to save events.");
      return;
    }

    const alreadySaved = isSaved(event.id);
    const next = alreadySaved
      ? savedItems.filter(
          (item) =>
            !(
              item.itemType === "event" &&
              item.itemId === event.id &&
              item.userId === currentUserId
            )
        )
      : [
          ...savedItems,
          {
            id: `saved-${Date.now()}`,
            userId: currentUserId,
            itemType: "event",
            itemId: event.id,
            savedAt: new Date().toISOString(),
          },
        ];

    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSavedItems(next);
      setNotice(alreadySaved ? "Removed from your saved events." : "Event saved for later.");
    } catch {
      setNotice("This event could not be saved in this browser.");
    }
  }

  return (
    <div className="events-layout">
      <Sidebar account={currentUser} />
      <main className="events-page">
      
        <section
          className="events-banner"
          role="img"
          aria-label="Campus events banner"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.20), rgba(10, 15, 30, 0.20)), url(${eventsBanner})`,
          }}
        />

      <section className="events-page__content">
        <div className="events-page__section-heading">
          <div>
            <p className="events-page__eyebrow">CAMPUS EVENTS</p>
            <h2>Find your next campus moment</h2>
            <p className="events-page__muted">Explore workshops, technology, culture, sports, careers, and more.</p>
          </div>

          {isClub && (
            <Link className="events-page__create-button" to="/events/create">
              <span aria-hidden="true">＋</span> Create event
            </Link>
          )}
        </div>

        <div className="events-page__toolbar">
          <label className="events-page__search">
            <span className="events-page__search-icon" aria-hidden="true">⌕</span>
            <span className="events-page__sr-only">Search events</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search events, clubs or places"
            />
          </label>

          <button
            type="button"
            className={`events-page__saved-toggle ${savedOnly ? "is-active" : ""}`}
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
          >
            <span aria-hidden="true">♡</span>
            {savedOnly ? "Showing saved" : "Saved events"}
          </button>
        </div>

        <div className="events-page__filters" aria-label="Filter events by category">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              className={`events-page__filter ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="events-page__results-line" id="all-events">
          <span>{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"}</span>
          <span>Made for campus life <span aria-hidden="true"></span></span>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="events-page__list">
            {visibleEvents.map((event, index) => {
              const date = formatDate(event.date);
              const saved = isSaved(event.id);
              const artCategory = String(event.category || "event")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

              return (
                <article className="events-page__card" key={event.id}>
                  <div className={`events-page__card-art events-page__card-art--${artCategory} events-page__card-art--variant-${index % 4}`}>
                    <span className="events-page__category-tag">{event.category || "Campus event"}</span>

                    <button
                      type="button"
                      className={`events-page__bookmark ${saved ? "is-saved" : ""}`}
                      onClick={() => toggleSave(event)}
                      aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
                      aria-pressed={saved}
                    >
                      {saved ? "♥" : "♡"}
                    </button>

                    <div className="events-page__date-badge">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>

                    <span className="events-page__art-icon" aria-hidden="true">
                      {getCategoryIcon(event.category)}
                    </span>
                    <span className="events-page__art-spark events-page__art-spark--one" aria-hidden="true"></span>
                    <span className="events-page__art-spark events-page__art-spark--two" aria-hidden="true"></span>
                    <span className="events-page__art-shape" aria-hidden="true" />
                  </div>

                  <div className="events-page__card-body">
                    <p className="events-page__organizer">{event.organizer || "Campus community"}</p>
                    <h3>{event.title || "Untitled event"}</h3>
                    <p className="events-page__description">
                      {event.description || "More details about this campus event will be shared soon."}
                    </p>

                    <div className="events-page__meta">
                      <span><span aria-hidden="true">◷</span> {event.time || "Time TBA"}</span>
                      <span><span aria-hidden="true">⌖</span> {event.location || "Location TBA"}</span>
                    </div>

                    <div className="events-page__card-actions">
                      <Link
                        className="events-page__details-link"
                        to={`/events/${encodeURIComponent(event.id)}`}
                      >
                        View details <span aria-hidden="true">↗</span>
                      </Link>
                      <span className="events-page__card-note">Be there. Be part of it.</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="events-page__empty">
            <span className="events-page__empty-icon" aria-hidden="true">✳</span>
            <h3>{savedOnly ? "No saved events yet" : "No events found just yet"}</h3>
            <p>Try another category or search. There’s always room for a new plan.</p>
            <button
              type="button"
              className="events-page__reset-button"
              onClick={() => {
                setActiveCategory("All events");
                setSearchText("");
                setSavedOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {notice && (
          <div className="events-page__notice" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <footer className="events-page__footer">
          <span className="events-page__footer-mark"></span>
          <span>Discover. Connect. Be part of it.</span>
          <span>Campus Radar · Events</span>
        </footer>
      </section>
      </main>
    </div>
  );
}



*/









import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import eventsBanner from "../../assets/events-banner.jpg";
import "./EventsPage.css";


const EVENTS_KEY = "campusRadar_events";
const SAVED_KEY = "campusRadar_savedItems";
const CURRENT_USER_KEY = "campusRadar_currentUser";

const DEMO_EVENTS = [
  {
    id: "event-hackathon-01",
    clubId:"coding-club",
    title: "Campus Code Clash",
    category: "Hackathon",
    date: "2026-11-12",
    time: "9:00 AM",
    location: "Babbage Block",
    description: "Build a working solution with a team, solve real-world challenges, and put your coding and problem-solving skills to the test.",
    organizer: "Coding Club",
    createdById: "demo-club-coding",
    createdByType: "club",
  },
  {
    id: "event-cultural-01",
    title: "Rhythm of Campus",
    category: "Cultural",
    date: "2026-11-15",
    time: "4:00 PM",
    location: "Main Auditorium",
    description: "An evening of music, dance, performances, and creativity featuring talented students from across campus.",
    organizer: "Cultural Club",
    createdById: "demo-club-cultural",
    createdByType: "club",
  },
  {
    id: "event-sports-01",
    title: "Inter-Block Sports Meet",
    category: "Sports",
    date: "2026-11-18",
    time: "8:00 AM",
    location: "University Sports Ground",
    description: "Bring your team spirit to a day of friendly competition, athletic challenges, and campus sports.",
    organizer: "Sports Club",
    createdById: "demo-club-sports",
    createdByType: "club",
  },
  {
    id: "event-workshop-01",
    title: "Design Beyond Screens",
    category: "Workshop",
    date: "2026-11-21",
    time: "11:00 AM",
    location: "Innovation Lab",
    description: "Explore UI design principles, user journeys, prototyping, and practical ways to turn ideas into useful digital experiences.",
    organizer: "Design Club",
    createdById: "demo-club-design",
    createdByType: "club",
  },
  {
    id: "event-tech-01",
    title: "Future Tech Forum",
    category: "Technology",
    date: "2026-11-25",
    time: "10:00 AM",
    location: "Turing Block",
    description: "Discover new ideas in artificial intelligence, robotics, software, and emerging technologies through student-led talks.",
    organizer: "Tech Club",
    createdById: "demo-club-tech",
    createdByType: "club",
  },
  {
    id: "event-career-01",
    title: "Career Launchpad",
    category: "Career",
    date: "2026-11-28",
    time: "2:00 PM",
    location: "Seminar Hall",
    description: "Get practical advice on resumes, portfolios, interviews, internships, and preparing for your next career opportunity.",
    organizer: "Career Development Club",
    createdById: "demo-club-career",
    createdByType: "club",
  },
  {
    id: "event-robotics-01",
    title: "Robotics Build Lab",
    category: "Technology",
    date: "2026-12-02",
    time: "10:30 AM",
    location: "Robotics Laboratory",
    description: "See student-built robots in action and learn how sensors, control systems, and code work together in practical projects.",
    organizer: "Robotics Society",
    createdById: "demo-club-robotics",
    createdByType: "club",
  },
  {
    id: "event-startup-01",
    title: "Startup Spark",
    category: "Career",
    date: "2026-12-05",
    time: "12:00 PM",
    location: "Innovation Centre",
    description: "Turn an early idea into a pitch, meet student founders, and learn the basics of validating a startup concept.",
    organizer: "Entrepreneurship Cell",
    createdById: "demo-club-startup",
    createdByType: "club",
  },
  {
    id: "event-gaming-01",
    title: "Game Jam Weekend",
    category: "Hackathon",
    date: "2026-12-08",
    time: "9:30 AM",
    location: "Computer Lab 3",
    description: "Team up to design and build a small game from scratch. Bring your creativity, logic, and love of interactive experiences.",
    organizer: "Game Dev Club",
    createdById: "demo-club-gaming",
    createdByType: "club",
  },
  {
    id: "event-photo-01",
    title: "Frames of Campus",
    category: "Cultural",
    date: "2026-12-11",
    time: "3:00 PM",
    location: "Campus Amphitheatre",
    description: "Join a campus photography walk, practise composition, and share the stories you notice in everyday student life.",
    organizer: "Photography Club",
    createdById: "demo-club-photo",
    createdByType: "club",
  },
  {
    id: "event-green-01",
    title: "Green Campus Challenge",
    category: "Other",
    date: "2026-12-14",
    time: "9:00 AM",
    location: "Central Lawn",
    description: "Work with fellow students on simple sustainability ideas, a campus clean-up activity, and greener everyday habits.",
    organizer: "Eco Club",
    createdById: "demo-club-eco",
    createdByType: "club",
  },
  {
    id: "event-research-01",
    title: "Student Research Showcase",
    category: "Technology",
    date: "2026-12-17",
    time: "11:00 AM",
    location: "Research and Development Centre",
    description: "Explore student projects across computing, electronics, engineering, and design, with time to ask presenters about their work.",
    organizer: "Research Forum",
    createdById: "demo-club-research",
    createdByType: "club",
  },
  {
    id: "event-openmic-01",
    title: "Open Mic Under the Stars",
    category: "Cultural",
    date: "2026-12-20",
    time: "5:30 PM",
    location: "Open-Air Theatre",
    description: "Take the stage or cheer from the audience during an informal evening of poetry, acoustic music, comedy, and storytelling.",
    organizer: "Performing Arts Club",
    createdById: "demo-club-openmic",
    createdByType: "club",
  },
  {
    id: "event-sportsfitness-01",
    title: "Campus Fitness Circuit",
    category: "Sports",
    date: "2027-01-09",
    time: "7:30 AM",
    location: "Athletics Track",
    description: "Try a friendly fitness circuit with warm-ups, team challenges, and beginner-friendly activities led by student volunteers.",
    organizer: "Fitness Club",
    createdById: "demo-club-fitness",
    createdByType: "club",
  },
];

const CATEGORIES = [
  "All events",
  "Hackathon",
  "Sports",
  "Cultural",
  "Workshop",
  "Technology",
  "Career",
  "Other",
];

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function formatDate(dateValue) {
  if (!dateValue) return { day: "TBA", month: "DATE" };
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) return { day: "TBA", month: "DATE" };
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
  };
}

function getCategoryIcon(category) {
  const icons = {
    Hackathon: "⌘",
    Sports: "↗",
    Cultural: "♫",
    Workshop: "✳",
    Technology: "⌘",
    Career: "↗",
  };
  return icons[category] || "✦";
}

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All events");
  const [searchText, setSearchText] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const storedEvents = readArray(EVENTS_KEY);
    const demoIds = new Set(DEMO_EVENTS.map((event) => event.id));
    const userCreatedEvents = storedEvents.filter((event) => !demoIds.has(event.id));
    const mergedEvents = [...DEMO_EVENTS, ...userCreatedEvents];

    // Keep the demo set up to date without deleting events created by club accounts.
    localStorage.setItem(EVENTS_KEY, JSON.stringify(mergedEvents));
    setEvents(mergedEvents);
    setSavedItems(readArray(SAVED_KEY));
    setCurrentUser(readCurrentUser());
  }, []);

  useEffect(() => {
    const syncAccount = () => {
      setCurrentUser(readCurrentUser());
      setSavedItems(readArray(SAVED_KEY));
    };

    window.addEventListener("storage", syncAccount);
    return () => window.removeEventListener("storage", syncAccount);
  }, []);

  const currentUserId = currentUser?.id;
  const isClub = currentUser?.userType === "club";

  const visibleEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return events
      .filter((event) => {
        const categoryMatch =
          activeCategory === "All events" ||
          String(event.category || "").toLowerCase() === activeCategory.toLowerCase();

        const searchable = [
          event.title,
          event.category,
          event.location,
          event.organizer,
          event.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const searchMatch = !query || searchable.includes(query);
        const savedMatch =
          !savedOnly ||
          savedItems.some(
            (item) =>
              item.itemType === "event" &&
              item.itemId === event.id &&
              (!currentUserId || item.userId === currentUserId)
          );

        return categoryMatch && searchMatch && savedMatch;
      })
      .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31"));
  }, [events, activeCategory, searchText, savedOnly, savedItems, currentUserId]);

  function isSaved(eventId) {
    return savedItems.some(
      (item) =>
        item.itemType === "event" &&
        item.itemId === eventId &&
        (!currentUserId || item.userId === currentUserId)
    );
  }

  function toggleSave(event) {
    if (!currentUserId) {
      window.alert("Please sign in to save events.");
      return;
    }

    const alreadySaved = isSaved(event.id);
    const next = alreadySaved
      ? savedItems.filter(
          (item) =>
            !(
              item.itemType === "event" &&
              item.itemId === event.id &&
              item.userId === currentUserId
            )
        )
      : [
          ...savedItems,
          {
            id: `saved-${Date.now()}`,
            userId: currentUserId,
            itemType: "event",
            itemId: event.id,
            savedAt: new Date().toISOString(),
          },
        ];

    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      setSavedItems(next);
      setNotice(alreadySaved ? "Removed from your saved events." : "Event saved for later.");
    } catch {
      setNotice("This event could not be saved in this browser.");
    }
  }

  return (
    <div className="events-layout">
      <Sidebar account={currentUser} />
      <main className="events-page">
        {/* Events banner image */}
        <section
          className="events-banner"
          role="img"
          aria-label="Campus events banner"
          style={{
            backgroundImage: `linear-gradient(rgba(10, 15, 30, 0.20), rgba(10, 15, 30, 0.20)), url(${eventsBanner})`,
          }}
        />

      <section className="events-page__content">
        <div className="events-page__section-heading">
          <div>
            <p className="events-page__eyebrow">CAMPUS EVENTS</p>
            <h2>Find your next campus moment</h2>
            <p className="events-page__muted">Explore workshops, technology, culture, sports, careers, and more.</p>
          </div>

          {isClub && (
            <Link className="events-page__create-button" to="/events/create">
              <span aria-hidden="true">＋</span> Create event
            </Link>
          )}
        </div>

        <div className="events-page__toolbar">
          <label className="events-page__search">
            <span className="events-page__search-icon" aria-hidden="true">⌕</span>
            <span className="events-page__sr-only">Search events</span>
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search events, clubs or places"
            />
          </label>

          <button
            type="button"
            className={`events-page__saved-toggle ${savedOnly ? "is-active" : ""}`}
            onClick={() => setSavedOnly((value) => !value)}
            aria-pressed={savedOnly}
          >
            <span aria-hidden="true">♡</span>
            {savedOnly ? "Showing saved" : "Saved events"}
          </button>
        </div>

        <div className="events-page__filters" aria-label="Filter events by category">
          {CATEGORIES.map((category) => (
            <button
              type="button"
              key={category}
              className={`events-page__filter ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="events-page__results-line" id="all-events">
          <span>{visibleEvents.length} {visibleEvents.length === 1 ? "event" : "events"}</span>
          <span>Made for campus life <span aria-hidden="true"></span></span>
        </div>

        {visibleEvents.length > 0 ? (
          <div className="events-page__list">
            {visibleEvents.map((event, index) => {
              const date = formatDate(event.date);
              const saved = isSaved(event.id);
              const artCategory = String(event.category || "event")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-");

              return (
                <article className="events-page__card" key={event.id}>
                  <div className={`events-page__card-art events-page__card-art--${artCategory} events-page__card-art--variant-${index % 4}`}>
                    <span className="events-page__category-tag">{event.category || "Campus event"}</span>

                    <button
                      type="button"
                      className={`events-page__bookmark ${saved ? "is-saved" : ""}`}
                      onClick={() => toggleSave(event)}
                      aria-label={saved ? `Unsave ${event.title}` : `Save ${event.title}`}
                      aria-pressed={saved}
                    >
                      {saved ? "♥" : "♡"}
                    </button>

                    <div className="events-page__date-badge">
                      <strong>{date.day}</strong>
                      <span>{date.month}</span>
                    </div>
                  </div>

                  <div className="events-page__card-body">
                    <p className="events-page__organizer">{event.organizer || "Campus community"}</p>
                    <h3>{event.title || "Untitled event"}</h3>
                    <p className="events-page__description">
                      {event.description || "More details about this campus event will be shared soon."}
                    </p>

                    <div className="events-page__meta">
                      <span><span aria-hidden="true">◷</span> {event.time || "Time TBA"}</span>
                      <span><span aria-hidden="true">⌖</span> {event.location || "Location TBA"}</span>
                    </div>

                    <div className="events-page__card-actions">
                      <Link
                        className="events-page__details-link"
                        to={`/events/${encodeURIComponent(event.id)}`}
                      >
                        View details <span aria-hidden="true">↗</span>
                      </Link>
                      <span className="events-page__card-note">Be there. Be part of it.</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="events-page__empty">
            <span className="events-page__empty-icon" aria-hidden="true">✳</span>
            <h3>{savedOnly ? "No saved events yet" : "No events found just yet"}</h3>
            <p>Try another category or search. There’s always room for a new plan.</p>
            <button
              type="button"
              className="events-page__reset-button"
              onClick={() => {
                setActiveCategory("All events");
                setSearchText("");
                setSavedOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
        )}

        {notice && (
          <div className="events-page__notice" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        <footer className="events-page__footer">
          <span className="events-page__footer-mark"></span>
          <span>Discover. Connect. Be part of it.</span>
          <span>Campus Radar · Events</span>
        </footer>
      </section>
      </main>
    </div>
  );
}
