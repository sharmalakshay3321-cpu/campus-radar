
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CrewCallDetail.css";

const LISTINGS_KEY = "campusRadar_crewCalls";
const APPLICATIONS_KEY = "campusRadar_applications";

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function getId(item) {
  return String(item?.id ?? item?._id ?? item?.callId ?? "");
}

function getSkills(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function getAttachment(call) {
  const file =
    call?.attachment ||
    call?.fileAttachment ||
    call?.attachedFile;

  if (file && typeof file === "object") return file;

  if (typeof file === "string") {
    return {
      name: call?.attachmentName || "Attached file",
      dataUrl: file,
    };
  }

  return null;
}

function formatFileSize(bytes) {
  if (!bytes || Number(bytes) <= 0) return "";

  const size = Number(bytes);

  return size < 1024 * 1024
    ? `${Math.round(size / 1024)} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function SkillList({ skills }) {
  const items = getSkills(skills);

  if (!items.length) {
    return <p className="ccd-muted">No specific skills listed.</p>;
  }

  return (
    <div className="ccd-skills">
      {items.map((skill, index) => (
        <span className="ccd-skill" key={`${skill}-${index}`}>
          {skill}
        </span>
      ))}
    </div>
  );
}

function getCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem("campusRadar_currentUser") || "null"
    );
  } catch {
    return null;
  }
}

export default function CrewCallDetail() {
  const { callId } = useParams();
  const navigate = useNavigate();

  const [call, setCall] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);

  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [reason, setReason] = useState("");
  const [contact, setContact] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [remarks, setRemarks] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const found = readArray(LISTINGS_KEY).find(
      (item) => getId(item) === String(callId)
    );

    if (!found) {
      setCall(null);
      setNotFound(true);
      return;
    }

    setCall(found);
    setNotFound(false);
  }, [callId]);

  useEffect(() => {
    if (!showApply) return;

    const user = getCurrentUser();
    setCurrentUser(user);

    setSkills(
      getSkills(user?.skills ?? user?.profile?.skills ?? [])
    );

    setSkillInput("");
    setReason("");
    setContact("");
    setLinkedin("");
    setRemarks("");
    setFormError("");
  }, [showApply]);

  if (notFound) {
    return (
      <main className="ccd-page">
        <div className="ccd-container ccd-empty">
          <Link className="ccd-back-link" to="/crew-calls">
            ← Back to Crew Calls
          </Link>

          <h1>Crew Call not found</h1>
          <p>
            This listing may have been removed or the link may be incorrect.
          </p>

          <Link className="ccd-primary-link" to="/crew-calls">
            Browse Crew Calls
          </Link>
        </div>
      </main>
    );
  }

  if (!call) {
    return (
      <main className="ccd-page">
        <div className="ccd-container ccd-loading">
          Loading Crew Call…
        </div>
      </main>
    );
  }

  const isClub =
    call.createdByType === "club" ||
    call.posterType === "club" ||
    call.isClubPost === true;

  const posterName = isClub
    ? call.clubName || call.posterName || call.createdByName || "Campus club"
    : call.posterName ||
      call.leaderName ||
      call.createdByName ||
      call.authorName ||
      "Student";

  const posterId =
    call.createdById ||
    call.clubId ||
    call.posterId ||
    call.userId;

  const posterLink = isClub
    ? posterId
      ? `/clubs/${posterId}`
      : "/clubs"
    : posterId
      ? `/profile/${posterId}`
      : "/profile";

  const title = call.title || call.teamName || call.name || "Crew Call";

  const category =
    call.category || call.categories?.[0] || "Collaboration";

  const description =
    call.description || call.details || call.whatLookingFor || "";

  const teamSize =
    call.currentMembers ??
    call.existingMembers ??
    call.teamSize ??
    call.currentTeamSize;

  const openings =
    call.openings ??
    call.peopleNeeded ??
    call.numberOfOpenings;

  const requiredSkills =
    call.skillsRequired ??
    call.requiredSkills ??
    call.skills ??
    [];

  const preferredRoles =
    call.preferredRoles ??
    call.roles ??
    [];

  const hasPreferredRoles = getSkills(preferredRoles).length > 0;

  const deadline =
    call.projectDeadline ||
    call.deadline ||
    call.eventDate ||
    call.projectDate;

  const isApproximate = Boolean(
    call.deadlineApproximate ??
    call.isDeadlineApproximate ??
    call.approximateDeadline
  );

  const additionalRemarks =
    call.additionalRemarks ||
    call.remarks ||
    call.extraNotes;

  const attachment = getAttachment(call);

  const isClosed = Boolean(
    call.status === "closed" ||
    call.status === "archived" ||
    call.isClosed ||
    call.closed === true ||
    call.archived === true ||
    call.isArchived === true
  );

  const applications = readArray(APPLICATIONS_KEY);

  const userId =
    currentUser?.id ??
    currentUser?._id ??
    currentUser?.userId;

  const alreadyApplied = applications.some((application) => {
    const applicationCallId =
      application.crewCallId ??
      application.callId ??
      application.listingId;

    const applicantId =
      application.applicantId ??
      application.userId ??
      application.createdById;

    const status = String(application.status || "pending").toLowerCase();

    const isActive = ![
      "withdrawn",
      "deleted",
      "rejected",
    ].includes(status);

    return (
      String(applicationCallId) === String(callId) &&
      isActive &&
      userId != null &&
      String(applicantId) === String(userId)
    );
  });

  function addSkill() {
    const value = skillInput.trim();

    if (
      value &&
      !skills.some(
        (skill) => skill.toLowerCase() === value.toLowerCase()
      )
    ) {
      setSkills((previous) => [...previous, value]);
    }

    setSkillInput("");
  }

  function submitApplication(event) {
    event.preventDefault();
    setFormError("");

    const user = getCurrentUser();

    if (!user) {
      setFormError("Please log in before applying.");
      return;
    }

    if (!reason.trim() || !contact.trim()) {
      setFormError(
        "Please complete your reason to join and contact information."
      );
      return;
    }

    const existing = readArray(APPLICATIONS_KEY);

    const applicantId =
      user.id ?? user._id ?? user.userId ?? null;

    const duplicate = existing.some((application) => {
      const linkedCallId =
        application.crewCallId ??
        application.callId ??
        application.listingId;

      const linkedApplicantId =
        application.applicantId ??
        application.userId ??
        application.createdById;

      const status = String(application.status || "pending").toLowerCase();

      const isActive = ![
        "withdrawn",
        "deleted",
        "rejected",
      ].includes(status);

      return (
        String(linkedCallId) === String(callId) &&
        isActive &&
        applicantId != null &&
        String(linkedApplicantId) === String(applicantId)
      );
    });

    if (duplicate) {
      setFormError(
        "You already have an active application for this listing."
      );
      return;
    }

    const application = {
      id: `application-${Date.now()}`,
      crewCallId: String(callId),
      applicantId,
      applicantName:
        user.name || user.fullName || user.username || "Student",
      skills,
      reasonToJoin: reason.trim(),
      contactInformation: contact.trim(),
      linkedin: linkedin.trim(),
      additionalRemarks: remarks.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        APPLICATIONS_KEY,
        JSON.stringify([...existing, application])
      );

      setShowApply(false);

      navigate("/crew-calls/applications", {
        state: { submitted: true },
      });
    } catch {
      setFormError(
        "Could not save your application. Please try again."
      );
    }
  }

  return (
    <main className="ccd-page">
      <div className="ccd-container">
        <Link className="ccd-back-link" to="/crew-calls">
          ← Back to Crew Calls
        </Link>

        <article className="ccd-detail-card">
          {/* Listing title and status */}
          <header className="ccd-header">
            <div className="ccd-eyebrow">
              THE CAMPUS COLLABORATION CORNER
            </div>

            <div className="ccd-heading-row">
              <h1>{title}</h1>

              <span
                className={`ccd-status ${
                  isClosed ? "ccd-status-closed" : ""
                }`}
              >
                {isClosed ? "Closed listing" : "Open listing"}
              </span>
            </div>

            <span className="ccd-category">{category}</span>
          </header>

          {/* Opportunity description */}
          <section className="ccd-section">
            <h2>About this opportunity</h2>
            <p className="ccd-description">
              {description || "No description has been added yet."}
            </p>
          </section>

          {/* Team overview */}
          <section className="ccd-section">
            <h2>Team overview</h2>

            <div className="ccd-overview-grid">
              <div className="ccd-overview-item">
                <span className="ccd-overview-label">
                  Current team size
                </span>
                <strong>{teamSize ?? "Not specified"}</strong>
              </div>

              <div className="ccd-overview-item">
                <span className="ccd-overview-label">
                  Openings
                </span>
                <strong>{openings ?? "Not specified"}</strong>
              </div>
            </div>
          </section>

          {/* Required skills */}
          <section className="ccd-section">
            <h2>Required skills</h2>
            <SkillList skills={requiredSkills} />
          </section>

          {/* Optional preferred roles */}
          {hasPreferredRoles && (
            <section className="ccd-section">
              <h2>Preferred roles</h2>
              <SkillList skills={preferredRoles} />
            </section>
          )}

          {/* Project deadline */}
          {deadline && (
            <section className="ccd-section">
              <h2>Project / event deadline</h2>

              <p className="ccd-deadline">
                <span>{String(deadline)}</span>

                {isApproximate && (
                  <span className="ccd-approximate">
                    Approximate
                  </span>
                )}
              </p>
            </section>
          )}

          {/* Optional remarks */}
          {additionalRemarks && (
            <section className="ccd-section">
              <h2>Additional remarks</h2>
              <p className="ccd-description">{additionalRemarks}</p>
            </section>
          )}

          {/* Attachment is displayed as a file, never as an image preview */}
          {attachment?.dataUrl && (
            <section className="ccd-section">
              <h2>Attachment</h2>

              <a
                className="ccd-attachment"
                href={attachment.dataUrl}
                download={attachment.name || "crew-call-attachment"}
                target="_blank"
                rel="noreferrer"
              >
                <span className="ccd-file-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 3.75h7l4 4v12.5H7a2 2 0 0 1-2-2v-12.5a2 2 0 0 1 2-2Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 3.75v4h4M8.5 13h7M8.5 16h7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>

                <span className="ccd-attachment-copy">
                  <strong>
                    {attachment.name || "Attached file"}
                  </strong>

                  <span>
                    {attachment.type || "File attachment"}
                    {attachment.size
                      ? ` · ${formatFileSize(attachment.size)}`
                      : ""}
                  </span>
                </span>

                <span className="ccd-download-label">
                  Open file ↗
                </span>
              </a>
            </section>
          )}

          {/* Optional LinkedIn */}
          {call.linkedin && (
            <section className="ccd-section">
              <h2>LinkedIn</h2>

              <a
                className="ccd-text-link"
                href={call.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                View LinkedIn profile ↗
              </a>
            </section>
          )}

          {/* Poster profile */}
          <section className="ccd-poster-section">
            <div className="ccd-poster-mark" aria-hidden="true">
              {isClub
                ? "C"
                : posterName.trim().charAt(0).toUpperCase() || "S"}
            </div>

            <div className="ccd-poster-copy">
              <span className="ccd-overview-label">Posted by</span>
              <strong>{posterName}</strong>
              <span>
                {isClub ? "Club profile" : "Student profile"}
              </span>
            </div>

            <Link className="ccd-profile-link" to={posterLink}>
              View profile ↗
            </Link>
          </section>

          {/* Apply action stays at the bottom */}
          <footer className="ccd-actions">
            {isClosed ? (
              <p className="ccd-closed-note">
                This listing is closed and is no longer accepting applications.
              </p>
            ) : alreadyApplied ? (
              <p className="ccd-closed-note">
                You already have an active application for this listing.
              </p>
            ) : (
              <button
                className="ccd-apply-button"
                type="button"
                onClick={() => setShowApply(true)}
              >
                Apply to Join <span aria-hidden="true">→</span>
              </button>
            )}
          </footer>
        </article>
      </div>

      {/* Centred application modal */}
      {showApply && (
        <div
          className="ccd-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowApply(false);
            }
          }}
        >
          <section
            className="ccd-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ccd-apply-title"
          >
            <button
              className="ccd-modal-close"
              type="button"
              aria-label="Close application form"
              onClick={() => setShowApply(false)}
            >
              ×
            </button>

            <div className="ccd-eyebrow">TAKE THE NEXT STEP</div>
            <h2 id="ccd-apply-title">Apply to join</h2>

            <p className="ccd-modal-intro">
              Tell the poster about yourself and why you would like
              to join this opportunity.
            </p>

            <form
              className="ccd-application-form"
              onSubmit={submitApplication}
            >
              <label>
                Your name
                <input
                  type="text"
                  value={
                    currentUser?.name ||
                    currentUser?.fullName ||
                    currentUser?.username ||
                    ""
                  }
                  readOnly
                  placeholder="Your profile name"
                />
              </label>

              <div className="ccd-form-field">
                <span className="ccd-field-label">Your skills</span>

                <div className="ccd-skill-editor">
                  {skills.map((skill) => (
                    <span className="ccd-editable-skill" key={skill}>
                      {skill}

                      <button
                        type="button"
                        aria-label={`Remove ${skill}`}
                        onClick={() =>
                          setSkills((items) =>
                            items.filter((item) => item !== skill)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  <div className="ccd-add-skill">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(event) =>
                        setSkillInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill"
                    />

                    <button type="button" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <label>
                Reason to join <span className="ccd-required">*</span>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows="4"
                  required
                  placeholder="What interests you about this opportunity?"
                />
              </label>

              <label>
                Contact information{" "}
                <span className="ccd-required">*</span>

                <input
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  required
                  placeholder="Email, Instagram, phone, etc."
                />

                <small>
                  Your contact details should only be shared with the
                  poster after you are accepted.
                </small>
              </label>

              <label>
                LinkedIn <span className="ccd-optional">(optional)</span>

                <input
                  type="url"
                  value={linkedin}
                  onChange={(event) => setLinkedin(event.target.value)}
                  placeholder="https://linkedin.com/in/…"
                />
              </label>

              <label>
                Extra remarks{" "}
                <span className="ccd-optional">(optional)</span>

                <textarea
                  value={remarks}
                  onChange={(event) => setRemarks(event.target.value)}
                  rows="3"
                  placeholder="Anything else you want the poster to know?"
                />
              </label>

              {formError && (
                <p className="ccd-form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="ccd-modal-actions">
                <button
                  className="ccd-cancel-button"
                  type="button"
                  onClick={() => setShowApply(false)}
                >
                  Cancel
                </button>

                <button className="ccd-apply-button" type="submit">
                  Submit application <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
