
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCrewCall.css";

const STORAGE_KEY = "campusRadar_crewCalls";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

const categories = [
  "Competition",
  "Project",
  "Club",
  "Research",
  "Startup",
  "Hackathon",
  "Other",
];

function getStoredListings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("campusRadar_currentUser") || "null");
  } catch {
    return null;
  }
}

function CreateCrewCall() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [form, setForm] = useState({
    title: "",
    teamName: "",
    categories: [],
    otherCategory: "",
    description: "",
    currentTeamSize: "1",
    openings: "1",
    requiredSkills: "",
    preferredRoles: "",
    deadline: "",
    deadlineApproximate: false,
    leaderLinkedIn: "",
    contactInformation: "",
    remarks: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleCategory(category) {
    setForm((previous) => {
      const selected = previous.categories.includes(category);

      return {
        ...previous,
        categories: selected
          ? previous.categories.filter((item) => item !== category)
          : [...previous.categories, category],
      };
    });
  }

  function handleFileChange(event) {
    setError("");

    const file = event.target.files?.[0];

    if (!file) {
      setAttachment(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("The attachment must be 2 MB or smaller.");
      event.target.value = "";
      setAttachment(null);
      return;
    }

    setAttachment(file);
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read the attachment."));

      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const title = form.title.trim();
    const teamName = form.teamName.trim();
    const description = form.description.trim();
    const openings = Number(form.openings);
    const currentTeamSize = Number(form.currentTeamSize);

    if (!title || !teamName || !description) {
      setError("Please complete the title, team name, and description.");
      return;
    }

    if (form.categories.length === 0) {
      setError("Please select at least one category.");
      return;
    }

    if (form.categories.includes("Other") && !form.otherCategory.trim()) {
      setError("Please specify your other category.");
      return;
    }

    if (
      !Number.isInteger(currentTeamSize) ||
      currentTeamSize < 1
    ) {
      setError("Current team size must be a positive whole number.");
      return;
    }

    if (!Number.isInteger(openings) || openings < 1) {
      setError("You can't enter 0 openings. Enter a number greater than 0.");
      return;
    }

    if (
      form.deadline &&
      Number.isNaN(Date.parse(form.deadline))
    ) {
      setError("Please enter a valid project deadline.");
      return;
    }

    setSaving(true);

    try {
      let savedAttachment = null;

      if (attachment) {
        const dataUrl = await readFileAsDataURL(attachment);

        savedAttachment = {
          name: attachment.name,
          type: attachment.type || "application/octet-stream",
          size: attachment.size,
          dataUrl,
        };
      }

      const storedListings = getStoredListings();

      const user = currentUser || {};

      // Personal posts link to the user; club posts link to the club.
      const isClub = Boolean(
        user.clubId ||
        user.accountType === "club" ||
        user.role === "club"
      );

      const posterId = isClub
        ? user.clubId || user.id || user._id
        : user.id || user._id;

      const posterName = isClub
        ? user.clubName || user.name || user.username || "Campus Club"
        : user.name || user.fullName || user.username || "Campus Student";

      const newCrewCall = {
        id: `crew-${Date.now()}`,
        title,
        teamName,
        category: form.categories.includes("Other")
          ? [
              ...form.categories.filter((item) => item !== "Other"),
              form.otherCategory.trim(),
            ]
          : form.categories,
        categories: form.categories.includes("Other")
          ? [
              ...form.categories.filter((item) => item !== "Other"),
              form.otherCategory.trim(),
            ]
          : form.categories,
        description,
        currentTeamSize,
        openings,
        requiredSkills: form.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        preferredRoles: form.preferredRoles
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean),
        deadline: form.deadline || "",
        deadlineApproximate: Boolean(
          form.deadline && form.deadlineApproximate
        ),
        leaderLinkedIn: form.leaderLinkedIn.trim(),
        contactInformation: form.contactInformation.trim(),
        remarks: form.remarks.trim(),
        attachment: savedAttachment,

        // Ownership information
        posterId: posterId || null,
        posterName,
        posterType: isClub ? "club" : "user",
        createdBy: user.id || user._id || null,

        // Initial listing state
        status: "open",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([newCrewCall, ...storedListings])
      );

      navigate(`/crew-calls/${newCrewCall.id}`);
    } catch (err) {
      console.error("Could not create Crew Call:", err);
      setError(
        "Could not save this listing. Try a smaller attachment or remove the file and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="create-crew-call-page">
      <button
        type="button"
        className="create-back-button"
        onClick={() => navigate("/crew-calls")}
      >
        ← Back to Crew Calls
      </button>

      <div className="create-crew-call-heading">
        <p className="create-eyebrow">THE CAMPUS COLLABORATION CORNER</p>
        <h1>Create a Crew Call</h1>
        <p>Every idea needs a crew. Tell people what you're building.</p>
      </div>

      <form className="create-crew-call-form" onSubmit={handleSubmit}>
        <section className="create-form-section">
          <h2>About your opportunity</h2>

          <div className="create-field">
            <label htmlFor="title">Listing title *</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={updateField}
              placeholder="e.g. Looking for a team for a hackathon"
              maxLength={100}
              required
            />
          </div>

          <div className="create-field">
            <label htmlFor="teamName">Team or project name *</label>
            <input
              id="teamName"
              name="teamName"
              value={form.teamName}
              onChange={updateField}
              placeholder="e.g. Team Nova"
              maxLength={100}
              required
            />
          </div>

          <div className="create-field">
            <label>Categories * (select all that apply)</label>
            <div className="create-category-options">
              {categories.map((category) => (
                <label className="create-category-option" key={category}>
                  <input
                    type="checkbox"
                    checked={form.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {form.categories.includes("Other") && (
            <div className="create-field">
              <label htmlFor="otherCategory">Specify category *</label>
              <input
                id="otherCategory"
                name="otherCategory"
                value={form.otherCategory}
                onChange={updateField}
                placeholder="Enter your category"
                required
              />
            </div>
          )}

          <div className="create-field">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="What are you working on, and what should interested students know?"
              rows={5}
              maxLength={3000}
              required
            />
          </div>
        </section>

        <section className="create-form-section">
          <h2>Your team</h2>

          <div className="create-field-row">
            <div className="create-field">
              <label htmlFor="currentTeamSize">Current team size *</label>
              <input
                id="currentTeamSize"
                name="currentTeamSize"
                type="number"
                min="1"
                step="1"
                value={form.currentTeamSize}
                onChange={updateField}
                required
              />
            </div>

            <div className="create-field">
              <label htmlFor="openings">People needed (openings) *</label>
              <input
                id="openings"
                name="openings"
                type="number"
                min="1"
                step="1"
                value={form.openings}
                onChange={updateField}
                required
              />
              <small>Enter a number greater than zero.</small>
            </div>
          </div>

          <div className="create-field">
            <label htmlFor="requiredSkills">Required skills *</label>
            <input
              id="requiredSkills"
              name="requiredSkills"
              value={form.requiredSkills}
              onChange={updateField}
              placeholder="e.g. React, Python, UI design"
              required
            />
            <small>Separate skills with commas.</small>
          </div>

          <div className="create-field">
            <label htmlFor="preferredRoles">Preferred roles (optional)</label>
            <input
              id="preferredRoles"
              name="preferredRoles"
              value={form.preferredRoles}
              onChange={updateField}
              placeholder="e.g. Frontend developer, Designer"
            />
            <small>Separate roles with commas.</small>
          </div>
        </section>

        <section className="create-form-section">
          <h2>Deadline and additional details</h2>

          <div className="create-field">
            <label htmlFor="deadline">Project or event deadline (optional)</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={updateField}
            />
            <small>This is the project deadline, not an application deadline.</small>
          </div>

          {form.deadline && (
            <label className="create-checkbox-row">
              <input
                type="checkbox"
                name="deadlineApproximate"
                checked={form.deadlineApproximate}
                onChange={updateField}
              />
              <span>This deadline is approximate</span>
            </label>
          )}

          <div className="create-field">
            <label htmlFor="leaderLinkedIn">LinkedIn profile (optional)</label>
            <input
              id="leaderLinkedIn"
              name="leaderLinkedIn"
              type="url"
              value={form.leaderLinkedIn}
              onChange={updateField}
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>

          <div className="create-field">
            <label htmlFor="contactInformation">
              Contact information (optional)
            </label>
            <textarea
              id="contactInformation"
              name="contactInformation"
              value={form.contactInformation}
              onChange={updateField}
              placeholder="e.g. Instagram username or email"
              rows={2}
            />
            <small>
              Contact information should only be shown to accepted applicants.
            </small>
          </div>

          <div className="create-field">
            <label htmlFor="remarks">Additional remarks (optional)</label>
            <textarea
              id="remarks"
              name="remarks"
              value={form.remarks}
              onChange={updateField}
              placeholder="Anything else interested students should know?"
              rows={3}
            />
          </div>
        </section>

        <section className="create-form-section">
          <h2>Attachment (optional)</h2>
          <p className="create-section-description">
            Add a brief, document, or other useful file related to your
            opportunity. It will appear as a file attachment in the listing.
          </p>

          <div className="create-field">
            <label htmlFor="crewCallAttachment">Choose a file</label>
            <input
              id="crewCallAttachment"
              type="file"
              accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
              onChange={handleFileChange}
            />
            <small>Maximum file size: 2 MB.</small>
          </div>

          {attachment && (
            <div className="create-selected-file">
              <span className="create-file-icon">📎</span>
              <div className="create-file-info">
                <strong>{attachment.name}</strong>
                <small>{(attachment.size / 1024).toFixed(0)} KB</small>
              </div>
              <button
                type="button"
                className="create-remove-file"
                onClick={() => setAttachment(null)}
              >
                Remove
              </button>
            </div>
          )}
        </section>

        {error && (
          <p className="create-form-error" role="alert">
            {error}
          </p>
        )}

        <div className="create-form-actions">
          <button
            type="button"
            className="create-cancel-button"
            onClick={() => navigate("/crew-calls")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-submit-button"
            disabled={saving}
          >
            {saving ? "Publishing..." : "Publish Crew Call"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCrewCall;
