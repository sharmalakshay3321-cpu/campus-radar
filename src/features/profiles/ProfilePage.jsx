import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import EditProfileModal from "./EditProfileModal";
import AvatarSelection from "./AvatarSelection";

import { getAvatar, PLACEHOLDER_AVATAR } from "./avatars";

import {
  CONTENT_TYPES,
  getArchivedItems,
  getCurrentUser,
  getMyPosts,
  getSavedItems,
  normalizeProfile,
  saveCurrentUser,
}  from "./profileStorage";

import "./ProfilePage.css";

const TABS = [
  { id: "posts", label: "My Posts" },
  { id: "saved", label: "Saved" },
  { id: "archived", label: "Archived" },
];

const EMPTY_MESSAGES = {
  posts: "You haven't created any posts yet.",
  saved: "You haven't saved anything yet.",
  archived: "You haven't archived anything yet.",
};

const ITEM_ROUTES = {
  event: (id) => `/events/${id}`,
  crewCall: (id) => `/crew-calls/${id}`,
  gatherPost: (id) => `/gather/${id}`,
};

function loadProfile() {
  const user = getCurrentUser();

  if (!user || user.userType !== "student") {
    return normalizeProfile({
      userType: "student",
      name: "",
      email: "",
      course: "",
      branch: "",
      year: "",
      semester: "",
      bio: "",
      skills: [],
      interests: [],
      avatarId: "a1",
    });
  }

  return normalizeProfile(user);
}

function ChipList({ items, emptyText }) {
  if (!items?.length) {
    return <p className="sprof-muted">{emptyText}</p>;
  }

  return (
    <div className="sprof-chip-list">
      {items.map((item, index) => (
        <span className="sprof-chip" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="sprof-empty">
      <div className="sprof-empty-icon">✦</div>
      <h3>Nothing here yet</h3>
      <p>{message}</p>
    </div>
  );
}

function ActivityCard({ entry }) {
  const item = entry.data ?? {};
  const typeInfo = CONTENT_TYPES[entry.type];

  const title =
    item.title ||
    item.name ||
    item.eventName ||
    typeInfo?.label ||
    "Untitled activity";

  const description =
    item.description ||
    item.about ||
    "No description available.";

  const date =
    item.date ||
    item.eventDate ||
    item.startDate ||
    item.createdAt;

  const location = item.venue || item.location;

  const routeBuilder = ITEM_ROUTES[entry.type];

  const route = routeBuilder
    ? routeBuilder(entry.id ?? item.id)
    : null;

  return (
    <article className="sprof-activity-card">
      <div className="sprof-activity-icon">
        {entry.type === "event"
          ? "📅"
          : entry.type === "crewCall"
            ? "🤝"
            : "💬"}
      </div>

      <div className="sprof-activity-content">
        <div className="sprof-activity-top">
          <span className="sprof-activity-type">
            {typeInfo?.label || "Activity"}
          </span>

          {date && (
            <span className="sprof-activity-date">
              {String(date)}
            </span>
          )}
        </div>

        <h3>{title}</h3>
        <p>{description}</p>

        {location && (
          <span className="sprof-location">
            📍 {location}
          </span>
        )}

        {route && (
          <Link className="sprof-view-link" to={route}>
            View details →
          </Link>
        )}
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState(loadProfile);

  const [activeTab, setActiveTab] = useState("posts");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarSelection, setShowAvatarSelection] =
    useState(false);

  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const posts = useMemo(
    () => getMyPosts(profile.id),
    [profile.id, refreshKey]
  );

  const savedItems = useMemo(
    () => getSavedItems(profile.id),
    [profile.id, refreshKey]
  );

  const archivedItems = useMemo(
    () => getArchivedItems(profile.id),
    [profile.id, refreshKey]
  );

  const activityCollections = {
    posts,
    saved: savedItems,
    archived: archivedItems,
  };

  const currentItems = activityCollections[activeTab] || [];

  const avatar = getAvatar(profile.avatarId);

  function updateProfile(changes) {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.userType !== "student") {
      setNotice("Please log in with your student account first.");
      return false;
    }

    const updatedProfile = normalizeProfile({
      ...currentUser,
      ...profile,
      ...changes,
      id: currentUser.id,
      userType: currentUser.userType,
    });

    const saved = saveCurrentUser(updatedProfile);

    if (!saved) {
      setNotice("Could not save your changes. Please log in again.");
      return false;
    }

    setProfile(updatedProfile);
    setNotice("Profile updated successfully!");
    setRefreshKey((value) => value + 1);

    return true;
  }

  function handleEditSave(changes) {
    const saved = updateProfile(changes);

    if (saved) {
      setShowEditModal(false);
    }
  }

  function handleAvatarSelect(avatarId) {
    const saved = updateProfile({ avatarId });

    if (saved) {
      setNotice("Avatar updated successfully!");
      setShowAvatarSelection(false);
    }
  }

  return (
    <main className="sprof-page">
      <div className="sprof-container">

        {/* Campus Radar Banner */}
        <section className="sprof-banner">
          <div className="sprof-banner-content">
            <span className="sprof-eyebrow">
            </span>
          </div>

          <div
            className="sprof-banner-decoration"
            aria-hidden="true"
          >
            <span>✦</span>
            <span>✧</span>
            <span>✦</span>
          </div>
        </section>

        {/* Success and Error Messages */}
        {notice && (
          <div className="sprof-notice" role="status">
            <span>{notice}</span>

            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Student Profile Header */}
        <section className="sprof-profile-header">
          <div className="sprof-avatar-wrap">
            <img
              className="sprof-avatar"
              src={avatar?.src || PLACEHOLDER_AVATAR}
              alt={
                profile.name
                  ? `${profile.name}'s avatar`
                  : "Student avatar"
              }
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = PLACEHOLDER_AVATAR;
              }}
            />

            <button
              type="button"
              className="sprof-change-avatar"
              onClick={() => {
                setNotice("");
                setShowAvatarSelection(true);
              }}
              aria-label="Change profile avatar"
              title="Change profile avatar"
            >
              ✎
            </button>
          </div>

          <div className="sprof-profile-intro">
            <span className="sprof-eyebrow">
              STUDENT PROFILE
            </span>

            <h1>{profile.name || "Your Name"}</h1>

            <p className="sprof-subtitle">
              {[profile.course, profile.branch]
                .filter(Boolean)
                .join(" · ") || "Add your academic information"}
            </p>

            <span className="sprof-badge">
              ✦ Campus Explorer
            </span>
          </div>

          <button
            type="button"
            className="sprof-edit-button"
            onClick={() => {
              setNotice("");
              setShowEditModal(true);
            }}
          >
            ✎ Edit Profile
          </button>
        </section>

        {/* Main Profile Information */}
        <div className="sprof-main-grid">

          {/* Academic Information */}
          <section className="sprof-card sprof-info-card">
            <span className="sprof-eyebrow">
              YOUR EDUCATION
            </span>

            <h2>Academic Information</h2>

            <div className="sprof-academic-grid">
              <div>
                <span>Course</span>
                <strong>{profile.course || "Not added"}</strong>
              </div>

              <div>
                <span>Year</span>
                <strong>{profile.year || "Not added"}</strong>
              </div>
            </div>
          </section>

          {/* About Me */}
          <section className="sprof-card sprof-info-card">
            <span className="sprof-eyebrow">
              GET TO KNOW ME
            </span>

            <h2>About Me</h2>

            <p className="sprof-bio">
              {profile.bio ||
                "Tell the campus community about yourself."}
            </p>
          </section>

          {/* Skills */}
          <section className="sprof-card sprof-info-card">
            <span className="sprof-eyebrow">
              WHAT I CAN DO
            </span>

            <h2>Skills</h2>

            <ChipList
              items={profile.skills}
              emptyText="No skills added yet."
            />
          </section>

          {/* Interests */}
          <section className="sprof-card sprof-info-card">
            <span className="sprof-eyebrow">
              WHAT I ENJOY
            </span>

            <h2>Interests</h2>

            <ChipList
              items={profile.interests}
              emptyText="No interests added yet."
            />
          </section>
        </div>

        {/* My Activity: Full Width */}
        <section className="sprof-card sprof-activity-section">
          <div className="sprof-activity-heading">
            <div>
              <span className="sprof-eyebrow">
                YOUR CAMPUS LIFE
              </span>

              <h2>My Activity</h2>

              <p className="sprof-muted">
                Your events, crew calls, and gather calls.
              </p>
            </div>

            <span className="sprof-total-count">
              {currentItems.length} items
            </span>
          </div>

          {/* Activity Tabs — Counts Removed */}
          <div className="sprof-tabs" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={
                  activeTab === tab.id
                    ? "sprof-tab sprof-tab-active"
                    : "sprof-tab"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity List */}
          <div className="sprof-activity-list">
            {currentItems.length > 0 ? (
              currentItems.map((entry, index) => (
                <ActivityCard
                  key={`${entry.type}-${entry.id ?? index}`}
                  entry={entry}
                />
              ))
            ) : (
              <EmptyState message={EMPTY_MESSAGES[activeTab]} />
            )}
          </div>
        </section>

        {/* Footer */}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onSave={handleEditSave}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Avatar Selection */}
      {showAvatarSelection && (
        <AvatarSelection
          selectedAvatarId={profile.avatarId}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelection(false)}
        />
      )}
    </main>
  );
}