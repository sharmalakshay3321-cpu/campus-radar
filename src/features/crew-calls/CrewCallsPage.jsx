
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Sidebar from "../dashboard/Sidebar";
import "./CrewCallsPage.css";
import crewCallsBanner from "../../assets/crew-calls-banner.png";

const STORAGE_KEY = "campusRadar_crewCalls";

/* ========================================
   HELPER FUNCTIONS
======================================== */

const readCalls = () => {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

const getCategories = (call) => {
  const value = call.categories ?? call.category ?? [];

  return Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];
};

const getSkills = (call) => {
  const value = call.requiredSkills ?? call.skills ?? [];

  return Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];
};

const getTitle = (call) =>
  call.title ?? call.teamName ?? call.name ?? "Untitled Crew Call";

const getDescription = (call) =>
  call.description ?? call.whatLookingFor ?? call.remarks ?? "";

const getId = (call) => call.id ?? call._id;

const isActive = (call) => {
  const status = String(call.status ?? "active").toLowerCase();

  return (
    !call.archived &&
    !call.deleted &&
    !call.isDeleted &&
    !["archived", "deleted", "closed", "filled", "inactive"].includes(
      status
    )
  );
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/* ========================================
   CREW CALL CARD
======================================== */

function CrewCallCard({ call, index, onOpen }) {
  const categories = getCategories(call);
  const skills = getSkills(call);
  const title = getTitle(call);
  const description = getDescription(call);

  const image = call.image ?? call.bannerImage ?? call.imageUrl;

  const openings = Number(
    call.openings ?? call.openPositions ?? 0
  );

  const deadline = formatDate(
    call.deadline ?? call.projectDeadline
  );

  const colourClasses = [
    "crew-call-card__art--lavender",
    "crew-call-card__art--yellow",
    "crew-call-card__art--coral",
    "crew-call-card__art--sage",
  ];

  return (
    <article className="crew-call-card">
      <div
        className={`crew-call-card__art ${
          colourClasses[index % colourClasses.length]
        } ${image ? "crew-call-card__art--with-image" : ""}`}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="crew-call-card__image"
          />
        ) : (
          <>
            <span className="crew-call-card__art-category">
              {categories[0] ?? "CREW CALL"}
            </span>

            <span className="crew-call-card__art-title">
              {title}
            </span>
          </>
        )}
      </div>

      <div className="crew-call-card__content">
        <div className="crew-call-card__categories">
          {categories.map((category, i) => (
            <span
              className="crew-call-card__category"
              key={`${category}-${i}`}
            >
              {category}
            </span>
          ))}
        </div>

        <h2 className="crew-call-card__title">
          <button type="button" onClick={() => onOpen(call)}>
            {title}
          </button>
        </h2>

        <p className="crew-call-card__description">
          {description ||
            "Open this listing to learn more about the opportunity."}
        </p>

        {skills.length > 0 && (
          <div className="crew-call-card__skills">
            {skills.slice(0, 4).map((skill, i) => (
              <span
                className="crew-call-card__skill"
                key={`${skill}-${i}`}
              >
                {skill}
              </span>
            ))}

            {skills.length > 4 && (
              <span className="crew-call-card__skill">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="crew-call-card__footer">
          <div className="crew-call-card__meta">
            {call.leaderName && (
              <span>Posted by {call.leaderName}</span>
            )}

            {openings > 0 && (
              <span>
                {openings}{" "}
                {openings === 1 ? "opening" : "openings"}
              </span>
            )}

            {deadline && (
              <span>
                Deadline: {deadline}
                {call.deadlineApproximate ? " (approx.)" : ""}
              </span>
            )}
          </div>

          <button
            type="button"
            className="crew-call-card__open-button"
            onClick={() => onOpen(call)}
          >
            View details <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ========================================
   CREW CALLS PAGE
======================================== */

export default function CrewCallsPage() {
  const navigate = useNavigate();

  const [calls, setCalls] = useState(readCalls);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  /* Refresh listings when the page regains focus */
  useEffect(() => {
    const refresh = () => {
      setCalls(readCalls());
    };

    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  /* Get available categories */
  const categories = useMemo(() => {
    const unique = calls
      .filter(isActive)
      .flatMap(getCategories)
      .filter(Boolean);

    return ["All", ...new Set(unique)];
  }, [calls]);

  /* Search, filter and sort listings */
  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    return calls
      .filter(isActive)
      .filter((call) => {
        return (
          selectedCategory === "All" ||
          getCategories(call).some(
            (category) => category === selectedCategory
          )
        );
      })
      .filter((call) => {
        if (!query) return true;

        const searchable = [
          getTitle(call),
          getDescription(call),
          ...getCategories(call),
          ...getSkills(call),
          call.teamName,
          call.leaderName,
          call.preferredRoles,
        ]
          .flat()
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt ?? a.created_at ?? 0
        ).getTime();

        const dateB = new Date(
          b.createdAt ?? b.created_at ?? 0
        ).getTime();

        return sortOrder === "newest"
          ? dateB - dateA
          : dateA - dateB;
      });
  }, [calls, search, selectedCategory, sortOrder]);

  /* Open a listing's detail page */
  const openCall = (call) => {
    const id = getId(call);

    if (id == null || id === "") return;

    navigate(`/crew-calls/${encodeURIComponent(String(id))}`);
  };

  /* ========================================
     PAGE JSX
  ======================================== */

  return (
    <div className="crew-calls-layout">
      <Sidebar />

      <main className="crew-calls-page">
        <img
          src={crewCallsBanner}
          alt="Crew Calls banner"
          className="crew-calls-page__banner"
        />

        <section className="crew-calls-page__intro">
          <span className="crew-calls-page__eyebrow">
            THE CAMPUS COLLABORATION CORNER
          </span>

          <h1>Every idea needs a crew.</h1>

          <p>
            Find teammates, share skills, and bring your next big
            idea to life.
          </p>

          <Link
            to="/crew-calls/create"
            className="crew-calls-page__create-button"
          >
            Create a Crew Call <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <section className="crew-calls-page__body">
          <div className="crew-calls-page__section-heading">
            <div>
              <h2>Explore Crew Calls</h2>

              <p>
                Good ideas grow when the right people come together.
              </p>
            </div>

            <span className="crew-calls-page__result-count">
              {filteredCalls.length}{" "}
              {filteredCalls.length === 1 ? "listing" : "listings"}
            </span>
          </div>

          <div className="crew-calls-page__toolbar">
            <label className="crew-calls-page__search">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search teams, skills, categories..."
                aria-label="Search Crew Calls"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </label>

            <label className="crew-calls-page__sort">
              <span>Sort</span>

              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>

          <div
            className="crew-calls-page__filters"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={
                  selectedCategory === category
                    ? "crew-calls-page__filter crew-calls-page__filter--active"
                    : "crew-calls-page__filter"
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category === "All" ? "All categories" : category}
              </button>
            ))}
          </div>

          {filteredCalls.length > 0 ? (
            <div className="crew-calls-page__list">
              {filteredCalls.map((call, index) => (
                <CrewCallCard
                  key={getId(call) ?? index}
                  call={call}
                  index={index}
                  onOpen={openCall}
                />
              ))}
            </div>
          ) : (
            <div className="crew-calls-page__empty">
              <h3>No Crew Calls found</h3>

              <p>
                {search || selectedCategory !== "All"
                  ? "Try a different search or category."
                  : "Be the first to share an opportunity with your campus."}
              </p>

              {(search || selectedCategory !== "All") && (
                <button
                  type="button"
                  className="crew-calls-page__reset-button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear filters
                </button>
              )}

              {!search && selectedCategory === "All" && (
                <Link
                  to="/crew-calls/create"
                  className="crew-calls-page__create-button"
                >
                  Create a Crew Call
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
