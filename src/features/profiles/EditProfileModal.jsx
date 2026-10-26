import { useEffect, useState } from "react";
import { toList } from "./profileStorage";
import "./EditProfileModal.css";

export default function EditProfileModal({
  profile,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    course: profile.course || "",
    branch: profile.branch || "",
    year: profile.year || "",
    semester: profile.semester || "",
    bio: profile.bio || "",
    skills: (profile.skills || []).join(", "),
    interests: (profile.interests || []).join(", "),
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, saving]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const course = form.course.trim();
    const bio = form.bio.trim();

    if (name.length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    if (!course) {
      setError("Please enter your course.");
      return;
    }

    if (!form.semester.trim()) {
      setError("Please select your semester.");
      return;
    }

    if (bio.length > 300) {
      setError("Your bio must be 300 characters or fewer.");
      return;
    }

    setSaving(true);

    try {
      onSave({
        name,
        course,
        branch: form.branch.trim(),
        year: form.year.trim(),
        semester: form.semester.trim(),
        bio,
        skills: toList(form.skills),
        interests: toList(form.interests),
      });

      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div
      className="sprof-edit-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        className="sprof-edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sprof-edit-title"
      >
        <header className="sprof-edit-header">
          <div>
            <span className="sprof-edit-eyebrow">
              YOUR ACCOUNT
            </span>
            <h2 id="sprof-edit-title">Edit Profile</h2>
            <p>Keep your student information up to date.</p>
          </div>

          <button
            type="button"
            className="sprof-edit-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close edit profile"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="sprof-edit-body">
            <div className="sprof-edit-field">
              <label htmlFor="sprof-name">Full name *</label>
              <input
                id="sprof-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="sprof-edit-field">
              <label htmlFor="sprof-email">Email address</label>
              <input
                id="sprof-email"
                name="email"
                type="email"
                value={form.email}
                disabled
              />
              <small>Email cannot be changed here.</small>
            </div>

            <div className="sprof-edit-row">
              <div className="sprof-edit-field">
                <label htmlFor="sprof-course">Course *</label>
                <input
                  id="sprof-course"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech"
                  required
                />
              </div>

              <div className="sprof-edit-field">
                <label htmlFor="sprof-branch">Branch</label>
                <input
                  id="sprof-branch"
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  placeholder="e.g. CSE"
                />
              </div>
            </div>

            <div className="sprof-edit-row">
              <div className="sprof-edit-field">
                <label htmlFor="sprof-year">Year</label>
                <select
                  id="sprof-year"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                >
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sprof-edit-field">
                <label htmlFor="sprof-semester">
                  Semester *
                </label>
                <select
                  id="sprof-semester"
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select semester</option>
                  {Array.from({ length: 8 }, (_, index) => (
                    <option
                      key={index + 1}
                      value={`${index + 1}${[
                        "st",
                        "nd",
                        "rd",
                      ][index] || "th"} Semester`}
                    >
                      {index + 1}
                      {["st", "nd", "rd"][index] || "th"} Semester
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sprof-edit-field">
              <label htmlFor="sprof-bio">About me</label>
              <textarea
                id="sprof-bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell people a little about yourself..."
                rows={4}
                maxLength={300}
              />
              <small>{form.bio.length}/300 characters</small>
            </div>

            <div className="sprof-edit-field">
              <label htmlFor="sprof-skills">
                Skills
              </label>
              <input
                id="sprof-skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="Java, React, Design"
              />
              <small>Separate each skill with a comma.</small>
            </div>

            <div className="sprof-edit-field">
              <label htmlFor="sprof-interests">
                Interests
              </label>
              <input
                id="sprof-interests"
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="Technology, Music, Sports"
              />
              <small>Separate each interest with a comma.</small>
            </div>

            {error && (
              <p className="sprof-edit-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <footer className="sprof-edit-footer">
            <button
              type="button"
              className="sprof-edit-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="sprof-edit-save"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}