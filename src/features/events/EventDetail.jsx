
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./EventDetail.css";

const EVENTS_KEY = "campusRadar_events";
const CURRENT_USER_KEY = "campusRadar_currentUser";

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
  if (!dateValue) return "Date to be announced";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

function EventDetailsPage() {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const events = readArray(EVENTS_KEY);
    const selectedEvent = events.find(
      (item) => String(item.id) === String(eventId)
    );

    setEvent(selectedEvent || null);
    setCurrentUser(readCurrentUser());
    setLoading(false);
  }, [eventId]);

  const isOwner =
    currentUser?.userType === "club" &&
    Boolean(currentUser?.id) &&
    String(currentUser.id) === String(event?.createdById);

  if (loading) {
    return (
      <main className="event-details-page">
        <div className="event-details-message">
          <div className="event-details-loader" />
          <p>Loading event details...</p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <div className="event-details-message">
          <span className="event-details-message__icon" aria-hidden="true">
            ✳
          </span>
          <p className="event-details-eyebrow">EVENT NOT FOUND</p>
          <h1>This event isn't available.</h1>
          <p>
            It may have been removed, or the event link may be incorrect.
          </p>
          <Link to="/events" className="event-details-primary-button">
            Explore events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="event-details-page">
      <div className="event-details-container">
        <nav className="event-details-breadcrumb" aria-label="Breadcrumb">
          <Link to="/events">Events</Link>
          <span aria-hidden="true">/</span>
          <span>{event.category || "Event details"}</span>
        </nav>

        <section className="event-details-hero">
          <div className="event-details-hero__content">
            <span className="event-details-hero__eyebrow">
              CAMPUS RADAR · EVENT SPOTLIGHT
            </span>

            <span className="event-details-category">
              {event.category || "Campus event"}
            </span>

            <h1>{event.title}</h1>

            <p>
              {event.description ||
                "More information about this event will be announced soon."}
            </p>

            <div className="event-details-hero__organizer">
              <span className="event-details-organizer-avatar">
                {(event.organizer || "C").charAt(0).toUpperCase()}
              </span>
              <span>
                <small>Organized by</small>
                <strong>{event.organizer || "Campus Club"}</strong>
              </span>
            </div>
          </div>

          <div
            className={`event-details-art event-details-art--${
              ["Hackathon", "Sports", "Cultural", "Workshop"].indexOf(
                event.category
              ) >= 0
                ? ["Hackathon", "Sports", "Cultural", "Workshop"].indexOf(
                    event.category
                  )
                : 0
            }`}
            aria-hidden="true"
          >
            <span className="event-details-art__ring event-details-art__ring--one" />
            <span className="event-details-art__ring event-details-art__ring--two" />
            <span className="event-details-art__icon">
              {getCategoryIcon(event.category)}
            </span>
            <span className="event-details-art__label">
              MAKE IT HAPPEN
            </span>
          </div>
        </section>

        <div className="event-details-layout">
          <section className="event-details-main">
            <div className="event-details-section-heading">
              <span className="event-details-section-heading__icon">✦</span>
              <div>
                <p className="event-details-eyebrow">THE EXPERIENCE</p>
                <h2>About this event</h2>
              </div>
            </div>

            <p className="event-details-description">
              {event.description ||
                "The organizer will share more information soon."}
            </p>

            <div className="event-details-note">
              <span aria-hidden="true">ⓘ</span>
              <p>
                Check the event information before attending. Any additional
                instructions will need to come from the organizing club.
              </p>
            </div>

            {isOwner && (
              <div className="event-details-owner-note">
                <span aria-hidden="true">✓</span>
                <p>
                  You created this event. This account is recognized as its
                  owner.
                </p>
              </div>
            )}
          </section>

          <aside className="event-details-sidebar">
            <div className="event-details-info-card">
              <p className="event-details-eyebrow">EVENT INFORMATION</p>
              <h2>Save the details</h2>

              <div className="event-details-info-row">
                <span className="event-details-info-icon" aria-hidden="true">
                  ▦
                </span>
                <div>
                  <small>DATE</small>
                  <strong>{formatDate(event.date)}</strong>
                </div>
              </div>

              <div className="event-details-info-row">
                <span className="event-details-info-icon" aria-hidden="true">
                  ◷
                </span>
                <div>
                  <small>TIME</small>
                  <strong>{event.time || "To be announced"}</strong>
                </div>
              </div>

              <div className="event-details-info-row">
                <span className="event-details-info-icon" aria-hidden="true">
                  ⌖
                </span>
                <div>
                  <small>LOCATION</small>
                  <strong>{event.location || "To be announced"}</strong>
                </div>
              </div>

              <div className="event-details-info-row">
                <span className="event-details-info-icon" aria-hidden="true">
                  ✦
                </span>
                <div>
                  <small>CATEGORY</small>
                  <strong>{event.category || "Campus event"}</strong>
                </div>
              </div>

              <Link
                to="/events"
                className="event-details-primary-button event-details-primary-button--full"
              >
                Back to all events <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="event-details-sidebar-note">
              <span aria-hidden="true">♡</span>
              <p>
                Discover more campus experiences and find your next reason to
                get involved.
              </p>
            </div>
          </aside>
        </div>

        <footer className="event-details-footer">
          <span className="event-details-footer__logo"></span>
          <span>From our campus, to the world.</span>
          <Link to="/events">Explore more events ↗</Link>
        </footer>
      </div>
    </main>
  );
}

export default EventDetailsPage;
