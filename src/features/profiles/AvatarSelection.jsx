import { useEffect, useState } from "react";
import {
  AVATARS,
  PLACEHOLDER_AVATAR,
} from "./avatars";
import "./AvatarSelection.css";

export default function AvatarSelection({
  selectedAvatarId,
  onSelect,
  onClose,
}) {
  const [selectedId, setSelectedId] = useState(
    selectedAvatarId || "a1"
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleConfirm() {
    onSelect(selectedId);
  }

  return (
    <div
      className="sprof-avatar-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="sprof-avatar-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sprof-avatar-title"
      >
        <header className="sprof-avatar-header">
          <div>
            <span className="sprof-avatar-eyebrow">
              PERSONALIZE YOUR PROFILE
            </span>

            <h2 id="sprof-avatar-title">
              Choose Your Avatar
            </h2>

            <p>Select an avatar to represent you on campus.</p>
          </div>

          <button
            type="button"
            className="sprof-avatar-close"
            onClick={onClose}
            aria-label="Close avatar selection"
          >
            ×
          </button>
        </header>

        <div className="sprof-avatar-grid">
          {AVATARS.map((avatar) => (
            <button
              type="button"
              key={avatar.id}
              className={
                selectedId === avatar.id
                  ? "sprof-avatar-option sprof-avatar-selected"
                  : "sprof-avatar-option"
              }
              onClick={() => setSelectedId(avatar.id)}
              aria-pressed={selectedId === avatar.id}
              aria-label={`Choose ${avatar.name}`}
            >
              <img
                src={avatar.src || PLACEHOLDER_AVATAR}
                alt=""
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = PLACEHOLDER_AVATAR;
                }}
              />

              <span>{avatar.name}</span>

              {selectedId === avatar.id && (
                <span className="sprof-avatar-check">✓</span>
              )}
            </button>
          ))}
        </div>

        <footer className="sprof-avatar-footer">
          <button
            type="button"
            className="sprof-avatar-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="sprof-avatar-confirm"
            onClick={handleConfirm}
          >
            Use This Avatar
          </button>
        </footer>
      </section>
    </div>
  );
}