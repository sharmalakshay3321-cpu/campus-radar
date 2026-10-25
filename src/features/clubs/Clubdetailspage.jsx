import { Link, useParams } from "react-router-dom";
import { CLUBS } from "./ClubsData";
import "./ClubDetailsPage.css";

const GALLERY_SLOTS = 3;

function ClubDetailsPage() {
const { clubId } = useParams();

const club = CLUBS.find((c) => c.id === clubId);

if (!club) {
return ( <main className="club-details"> 



    <section className="club-details__missing">
      <h1>Club not found</h1>

      <p>
        This club does not exist yet. Head back to see all clubs.
      </p>

      <Link to="/clubs" className="club-details__back">
        Back to all clubs
      </Link>
    </section>
  </main>
);


}

const events = club.events ?? [];

return ( <main className="club-details">
{/* Club banner */}



  {/* Club heading */}
  <header className="club-details__header">
    <span className="club-details__logo">
      {club.short}
    </span>

    <div>
      <span className="club-details__chip">
        {club.category}
      </span>

      <h1>{club.name}</h1>

      <p>{club.tagline}</p>
    </div>
  </header>

  <div className="club-details__layout">
    {/* Main content */}
    <div className="club-details__main">
      {/* About the club */}
      <section className="club-details__panel">
        <h2>About the Club</h2>

        {(club.about ?? []).map((paragraph, index) => (
          <p key={`${index}-${paragraph}`}>
            {paragraph}
          </p>
        ))}
      </section>

      {/* Activities */}
      <section className="club-details__panel">
        <h2>What We Do</h2>

        {(club.activities ?? []).length > 0 ? (
          <ul className="club-details__list">
            {club.activities.map((activity, index) => (
              <li key={`${index}-${activity}`}>
                {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p>Club activities will be announced soon.</p>
        )}
      </section>

      {/* Photo gallery */}
      <section className="club-details__panel">
        <h2>Photo Gallery</h2>

        <div className="club-details__gallery">
          {Array.from(
            { length: GALLERY_SLOTS },
            (_, index) => (
              <div
                key={index}
                className="club-details__photo"
                aria-label={`Photo placeholder ${index + 1}`}
              >
                <span aria-hidden="true">＋</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* Events — appears after the photo gallery */}
      <section className="club-details__panel club-details__events">
        <div className="club-details__events-heading">
          <div>
            <p className="club-details__events-eyebrow">
              WHAT'S HAPPENING
            </p>

            <h2>Club Events</h2>
          </div>

          <span className="club-details__events-count">
            {events.length}{" "}
            {events.length === 1 ? "Event" : "Events"}
          </span>
        </div>

        {events.length > 0 ? (
          <div className="club-details__event-list">
            {events.map((event, index) => (
              <article
                className="club-details__event-card"
                key={event.id ?? `${event.title}-${index}`}
              >
                <div className="club-details__event-art">
                  <span aria-hidden="true">✦</span>
                </div>

                <div className="club-details__event-content">
                  <span className="club-details__event-category">
                    {event.category || "Club Event"}
                  </span>

                  <h3>{event.title}</h3>

                  {event.date && (
                    <p className="club-details__event-detail">
                      <strong>Date:</strong> {event.date}
                    </p>
                  )}

                  {event.time && (
                    <p className="club-details__event-detail">
                      <strong>Time:</strong> {event.time}
                    </p>
                  )}

                  {event.location && (
                    <p className="club-details__event-detail">
                      <strong>Location:</strong> {event.location}
                    </p>
                  )}

                  {event.description && (
                    <p className="club-details__event-description">
                      {event.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="club-details__events-empty">
            <span aria-hidden="true">✦</span>

            <h3>No events yet</h3>

            <p>
              New events organized by {club.name} will appear here.
            </p>
          </div>
        )}
      </section>
    </div>

    {/* Club information sidebar */}
    <aside className="club-details__side">
      <section className="club-details__panel">
        <h2>Club Info</h2>

        <dl>
          <dt>Category</dt>
          <dd>{club.category}</dd>

          <dt>Members</dt>
          <dd>{club.members || "To be announced"}</dd>

          <dt>Contact</dt>
          <dd>{club.contact || "To be announced"}</dd>
        </dl>
      </section>

      <section className="club-details__panel">
        <h2>Club Leader</h2>

        <div className="club-details__leader">
          <span
            className="club-details__avatar"
            aria-hidden="true"
          >
            {club.leader?.initials || "?"}
          </span>

          <div>
            <strong>
              {club.leader?.name || "To be announced"}
            </strong>

            <span>
              {club.leader?.role || "Club Leader"}
            </span>
          </div>
        </div>
      </section>

      <Link to="/clubs" className="club-details__back">
        ← Back to all clubs
      </Link>
    </aside>
  </div>
</main>


);
}

export default ClubDetailsPage;
