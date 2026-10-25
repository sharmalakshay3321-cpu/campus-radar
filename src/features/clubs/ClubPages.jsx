import { useState } from "react";
import { Link } from "react-router-dom";
import { CLUBS } from "./ClubsData";
import "./ClubPage.css";
import clubsBanner from "../assets/clubs-banner.png";

const TOTAL_CARDS = 12;

const CATEGORIES = [
  "All",
  "Music",
  "Dance",
  "Technical",
  "Cultural",
  "Sports",
  "Literary",
  "Social Service",
];

function ClubPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const q = search.trim().toLowerCase();

  // Filter clubs by search text and selected category
  const matches = CLUBS.filter((club) => {
    const matchesSearch = [
      club.name,
      club.category,
      club.tagline,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);

    const matchesCategory =
      activeCategory === "All" ||
      club.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Show empty placeholders only when no search or category filter is active
  const emptySlots =
    q === "" && activeCategory === "All"
      ? Math.max(TOTAL_CARDS - CLUBS.length, 0)
      : 0;

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  return (
    <main className="club-page">
      {/* Reserved banner space for the team's banner image */}
     <section className="club-page__banner">
  <img
    src={clubsBanner}
    alt="Explore Campus Clubs"
    className="club-page__banner-image"
  />
</section>

      {/* Page introduction */}
      <section className="club-page__intro">
        <p className="club-page__eyebrow">CAMPUS RADAR</p>

        <h1>Explore Campus Clubs</h1>

        <p className="club-page__intro-text">
          Find your community, explore your interests, and connect
          with people who share your passion.
        </p>
      </section>

      {/* Search bar and category filters */}
      <section className="club-page__controls">
        <label className="club-page__search">
          <span
            className="club-page__search-icon"
            aria-hidden="true"
          >
            ⌕
          </span>

          <span className="club-page__sr">
            Search clubs
          </span>

          <input
            type="search"
            placeholder="Search clubs by name or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="club-page__clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </label>

        {/* Category filters */}
        <div
          className="club-page__categories"
          aria-label="Filter clubs by category"
        >
          <p className="club-page__categories-label">
            Browse by Category
          </p>

          <div className="club-page__category-list">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`club-page__category-chip ${
                  activeCategory === category ? "is-active" : ""
                }`}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Club directory */}
      <section className="club-page__directory">
        <div className="club-page__section-heading">
          <div>
            <p className="club-page__eyebrow">
              DISCOVER YOUR COMMUNITY
            </p>

            <h2>Our Clubs</h2>
          </div>
        </div>

        <div className="club-page__grid">
          {/* Actual club cards */}
          {matches.map((club) => (
            <Link
              key={club.id}
              to={`/clubs/${club.id}`}
              className="club-page__card club-page__card--featured"
            >
              <div className="club-page__card-art">
                <span
                  className="club-page__card-decoration"
                  aria-hidden="true"
                >
                  ✦
                </span>

                <span className="club-page__club-logo">
                  {club.short}
                </span>
              </div>

              <div className="club-page__card-content">
                <p className="club-page__card-category">
                  {club.category}
                </p>

                <h3>{club.name}</h3>

                <p className="club-page__card-description">
                  {club.tagline}
                </p>

                <span className="club-page__card-link">
                  View Club Details{" "}
                  <span aria-hidden="true">↗</span>
                </span>
              </div>
            </Link>
          ))}

          {/* Empty placeholders for future clubs */}
          {Array.from({ length: emptySlots }, (_, i) => (
            <div
              className="club-page__empty-card"
              key={`empty-${i}`}
              aria-hidden="true"
            >
              <div className="club-page__empty-card-art">
                <span>＋</span>
              </div>

              <div className="club-page__empty-card-body">
                <div className="club-page__empty-line" />

                <div className="club-page__empty-line club-page__empty-line--short" />
              </div>
            </div>
          ))}
        </div>

        {/* No matching clubs */}
        {matches.length === 0 && (
          <div className="club-page__no-results">
            <h3>No matching clubs</h3>

            <p>
              Try another search or select a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Apply to start a club banner — at the bottom */}
      <section className="club-page__apply-banner">
        <div className="club-page__apply-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 21V19C16 16.79 14.21 15 12 15H6C3.79 15 2 16.79 2 19V21"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <circle
              cx="9"
              cy="7"
              r="4"
              stroke="currentColor"
              strokeWidth="1.8"
            />

            <path
              d="M22 21V19C22 17.14 20.72 15.58 19 15.13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M16 3.13C17.72 3.58 19 5.14 19 7C19 8.86 17.72 10.42 16 10.87"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="club-page__apply-content">
          <h2>Can't find your club?</h2>

          <p>
            Apply to start a new club and get it reviewed by your
            managing office.
          </p>
        </div>

        {/* Replace this destination with your teammate's application route when available */}
        <Link
          to="/clubs"
          className="club-page__apply-button"
          onClick={(e) => {
            e.preventDefault();
            alert("Club application feature is coming soon!");
          }}
        >
          Apply to Start a Club <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

export default ClubPage;