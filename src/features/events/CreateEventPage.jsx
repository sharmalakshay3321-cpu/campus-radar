
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateEventPage.css";

const EVENTS_KEY = "campusRadar_events";
const CURRENT_USER_KEY = "campusRadar_currentUser";

const INITIAL_FORM = {
  title: "",
  category: "Hackathon",
  date: "",
  time: "",
  location: "",
  description: "",
};

const CATEGORIES = [
  "Hackathon",
  "Sports",
  "Cultural",
  "Workshop",
  "Technology",
  "Career",
  "Other",
];

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  } catch {
    return null;
  }
}

function readEvents() {
  try {
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

function createEventId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function CreateEventPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentUser(readCurrentUser());
  }, []);

  const isClub = currentUser?.userType === "club";
  const currentUserId = currentUser?.id;

  useEffect(() => {
    if (currentUser !== null && !isClub) {
      navigate("/events", { replace: true });
    }
  }, [currentUser, isClub, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const user = readCurrentUser();

    if (user?.userType !== "club" || !user?.id) {
      setError(
        "Only signed-in club accounts with a valid account ID can create events."
      );
      return;
    }

    const title = form.title.trim();
    const location = form.location.trim();
    const description = form.description.trim();

    if (!title || !form.date || !form.time || !location || !description) {
      setError("Please complete all the fields before publishing.");
      return;
    }

    if (form.date < new Date().toLocaleDateString("en-CA")) {
      setError("Please choose today or a future date.");
      return;
    }

    setIsSaving(true);

    try {
      const existingEvents = readEvents();

      const newEvent = {
        id: createEventId(),
        title,
        category: form.category,
        date: form.date,
        time: form.time,
        location,
        description,
        organizer:
          user.clubName ||
          user.name ||
          user.fullName ||
          user.username ||
          "Campus Club",
        createdById: user.id,
        createdByType: "club",
        createdAt: new Date().toISOString(),
      };

      const updatedEvents = [...existingEvents, newEvent];

      localStorage.setItem(EVENTS_KEY, JSON.stringify(updatedEvents));

      navigate(`/events/${newEvent.id}`);
    } catch {
      setError(
        "The event could not be saved. Please check your browser's local storage and try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!currentUser || !isClub) {
    return (
      <main className="create-event-page">
        <div className="create-event-access">
          <span className="create-event-access__icon" aria-hidden="true">
            🔒
          </span>
          <h1>Club access required</h1>
          <p>
            Sign in with an authorized club account to create a campus event.
          </p>
          <Link to="/events" className="create-event-secondary-button">
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="create-event-page">
      <div className="create-event-container">
        <Link to="/events" className="create-event-back">
          <span aria-hidden="true">←</span> Back to events
        </Link>

        <header className="create-event-header">
          <span className="create-event-eyebrow">
            CAMPUS RADAR / CLUB STUDIO
          </span>
          <h1>Bring your event to life.</h1>
          <p>
            Share your idea with campus. Add the details so students know
            when and where to join.
          </p>
        </header>

        <form className="create-event-form" onSubmit={handleSubmit}>
          <div className="create-event-form__heading">
            <div>
              <span className="create-event-form__step">EVENT DETAILS</span>
              <h2>Create an event</h2>
            </div>
            <span className="create-event-form__badge">
              <span aria-hidden="true">✦</span> Club post
            </span>
          </div>

          {error && (
            <div className="create-event-error" role="alert">
              {error}
            </div>
          )}

          <div className="create-event-field">
            <label htmlFor="event-title">Event name *</label>
            <input
              id="event-title"
              name="title"
              type="text"
              placeholder="e.g. Campus Code Clash"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="create-event-field">
            <label htmlFor="event-category">Category *</label>
            <select
              id="event-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="create-event-form__row">
            <div className="create-event-field">
              <label htmlFor="event-date">Event date *</label>
              <input
                id="event-date"
                name="date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-event-field">
              <label htmlFor="event-time">Start time *</label>
              <input
                id="event-time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="create-event-field">
            <label htmlFor="event-location">Venue / location *</label>
            <input
              id="event-location"
              name="location"
              type="text"
              placeholder="e.g. Babbage Block, Main Auditorium"
              value={form.location}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="create-event-field">
            <label htmlFor="event-description">About this event *</label>
            <textarea
              id="event-description"
              name="description"
              placeholder="What is happening? Who can participate? What should students know?"
              value={form.description}
              onChange={handleChange}
              rows={5}
              maxLength={1500}
              required
            />
            <span className="create-event-character-count">
              {form.description.length}/1500 characters
            </span>
          </div>

          <div className="create-event-note">
            <span aria-hidden="true">ⓘ</span>
            <p>
              Your event will be stored in this browser's local storage for
              the Campus Radar prototype. It is not published to a server.
            </p>
          </div>

          <div className="create-event-form__actions">
            <Link to="/events" className="create-event-cancel">
              Cancel
            </Link>

            <button
              type="submit"
              className="create-event-publish"
              disabled={isSaving}
            >
              {isSaving ? "Publishing..." : "Publish event"}
              <span aria-hidden="true">↗</span>
            </button>
          </div>
        </form>

        <p className="create-event-footer">
          CAMPUS RADAR <span>·</span> MAKE SOMETHING HAPPEN
        </p>
      </div>
    </main>
  );
}

export default CreateEventPage;
