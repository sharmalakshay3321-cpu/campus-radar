
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CrewCallApplications.css";

const CALLS_KEY = "campusRadar_crewCalls";
const APPLICATIONS_KEY = "campusRadar_applications";

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function CrewCallApplications() {
  const { callId } = useParams();
  const navigate = useNavigate();

  const [crewCalls] = useState(readList(CALLS_KEY));
  const [applications, setApplications] = useState(readList(APPLICATIONS_KEY));
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState("review");
  const [message, setMessage] = useState("");

  const crewCall = crewCalls.find((call) => String(call.id) === String(callId));

  const callApplications = useMemo(
    () => applications.filter(
      (application) =>
        String(application.crewCallId ?? application.callId) === String(callId)
    ),
    [applications, callId]
  );

  const visibleApplications = callApplications.filter((application) => {
    if (activeTab === "review") {
      return !["accepted", "rejected", "withdrawn"].includes(application.status);
    }
    if (activeTab === "accepted") return application.status === "accepted";
    if (activeTab === "rejected") {
      return ["rejected", "rejected_pending"].includes(application.status);
    }
    return true;
  });

  const selectedApplication = callApplications.find(
    (application) => String(application.id) === String(selectedId)
  );

  const saveApplications = (updated) => {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(updated));
      setApplications(updated);
      setMessage("Application updated.");
    } catch {
      setMessage("Could not save the change. Please try again.");
    }
  };

  const updateStatus = (application, status) => {
    const updated = applications.map((item) =>
      String(item.id) === String(application.id)
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
            ...(status === "accepted"
              ? { acceptedAt: new Date().toISOString() }
              : {}),
            ...(status === "rejected_pending"
              ? { rejectedAt: new Date().toISOString() }
              : {}),
          }
        : item
    );

    saveApplications(updated);
    setSelectedId(application.id);
  };

  const restoreApplication = (application) => {
    const updated = applications.map((item) =>
      String(item.id) === String(application.id)
        ? { ...item, status: "pending", rejectedAt: null }
        : item
    );

    saveApplications(updated);
    setSelectedId(application.id);
  };

  if (!crewCall) {
    return (
      <main className="crew-apps">
        <button
          className="crew-apps__back"
          onClick={() => navigate("/crew-calls")}
          type="button"
        >
          ← Back to Crew Calls
        </button>
        <div className="crew-apps__empty">
          <h1>Crew Call not found</h1>
          <p>This listing may have been removed or is not available in this browser.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="crew-apps">
      <button
        className="crew-apps__back"
        type="button"
        onClick={() => navigate(`/crew-calls/${callId}`)}
      >
        ← Back to listing
      </button>

      <header className="crew-apps__header">
        <div>
          <span className="crew-apps__eyebrow">YOUR CREW</span>
          <h1>Applications</h1>
          <p>People who want to join <strong>{crewCall.teamName || crewCall.title}</strong>.</p>
        </div>
        <div className="crew-apps__count">
          <strong>{callApplications.length}</strong>
          <span>Total applications</span>
        </div>
      </header>

      <nav className="crew-apps__tabs" aria-label="Application status">
        {[
          ["review", "Needs review"],
          ["accepted", "Accepted"],
          ["rejected", "Rejected"],
          ["all", "All"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={activeTab === value ? "is-active" : ""}
            onClick={() => {
              setActiveTab(value);
              setSelectedId(null);
              setMessage("");
            }}
          >
            {label}
            <span>
              {value === "all"
                ? callApplications.length
                : value === "review"
                  ? callApplications.filter(
                      (a) => !["accepted", "rejected", "rejected_pending", "withdrawn"].includes(a.status)
                    ).length
                  : callApplications.filter((a) =>
                      value === "rejected"
                        ? ["rejected", "rejected_pending"].includes(a.status)
                        : a.status === value
                    ).length}
            </span>
          </button>
        ))}
      </nav>

      {message && <p className="crew-apps__message" role="status">{message}</p>}

      <div className="crew-apps__layout">
        <section className="crew-apps__list" aria-label="Applicants">
          {visibleApplications.length === 0 ? (
            <div className="crew-apps__empty">
              <span className="crew-apps__empty-icon">✳</span>
              <h2>No applications here yet</h2>
              <p>When someone applies to this Crew Call, their application will appear here.</p>
            </div>
          ) : (
            visibleApplications.map((application) => {
              const isSelected = String(selectedId) === String(application.id);
              const skills = Array.isArray(application.skills)
                ? application.skills
                : String(application.skills || "")
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean);

              return (
                <button
                  type="button"
                  key={application.id}
                  className={`crew-apps__person ${isSelected ? "is-selected" : ""} ${
                    application.status === "rejected_pending" ? "is-rejected" : ""
                  }`}
                  onClick={() => setSelectedId(application.id)}
                >
                  <span className="crew-apps__avatar">
                    {(application.name || "S").trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="crew-apps__person-content">
                    <strong>{application.name || "Student applicant"}</strong>
                    <span className="crew-apps__skill-preview">
                      {skills.slice(0, 3).join(" · ") || "Skills not provided"}
                    </span>
                    <span className="crew-apps__reason-preview">
                      {application.reasonToJoin || application.reason || "No introduction provided"}
                    </span>
                  </span>
                  <span className="crew-apps__chevron">›</span>
                </button>
              );
            })
          )}
        </section>

        <section className="crew-apps__detail" aria-label="Application details">
          {!selectedApplication ? (
            <div className="crew-apps__detail-placeholder">
              <span>↖</span>
              <h2>Choose an application</h2>
              <p>Select someone from the list to review their introduction and details.</p>
            </div>
          ) : (
            <>
              <div className="crew-apps__applicant-heading">
                <span className="crew-apps__avatar crew-apps__avatar--large">
                  {(selectedApplication.name || "S").trim().charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="crew-apps__eyebrow">APPLICANT</span>
                  <h2>{selectedApplication.name || "Student applicant"}</h2>
                  <span className={`crew-apps__status crew-apps__status--${selectedApplication.status || "pending"}`}>
                    {selectedApplication.status || "pending"}
                  </span>
                </div>
              </div>

              <div className="crew-apps__detail-section">
                <h3>Why they want to join</h3>
                <p>{selectedApplication.reasonToJoin || selectedApplication.reason || "No reason was provided."}</p>
              </div>

              <div className="crew-apps__detail-section">
                <h3>Skills</h3>
                <div className="crew-apps__skills">
                  {(Array.isArray(selectedApplication.skills)
                    ? selectedApplication.skills
                    : String(selectedApplication.skills || "")
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                  ).map((skill) => <span key={skill}>{skill}</span>)}
                  {!selectedApplication.skills?.length &&
                    !String(selectedApplication.skills || "").trim() &&
                    <span>No skills listed</span>}
                </div>
              </div>

              <div className="crew-apps__detail-section">
                <h3>Additional details</h3>
                <p>
                  <strong>LinkedIn: </strong>
                  {selectedApplication.linkedIn ? (
                    <a href={selectedApplication.linkedIn} target="_blank" rel="noreferrer">
                      View profile ↗
                    </a>
                  ) : "Not provided"}
                </p>
                <p><strong>Remarks: </strong>{selectedApplication.remarks || "None"}</p>
              </div>

              {selectedApplication.status === "accepted" && (
                <div className="crew-apps__contact">
                  <h3>Applicant contact</h3>
                  <p>{selectedApplication.contactInformation || "No contact information was provided."}</p>
                </div>
              )}

              {selectedApplication.status === "pending" ||
              !selectedApplication.status ? (
                <div className="crew-apps__decision">
                  <button
                    type="button"
                    className="crew-apps__reject"
                    onClick={() => updateStatus(selectedApplication, "rejected_pending")}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="crew-apps__accept"
                    onClick={() => updateStatus(selectedApplication, "accepted")}
                  >
                    Accept applicant
                  </button>
                </div>
              ) : selectedApplication.status === "rejected_pending" ? (
                <div className="crew-apps__decision">
                  <p>Rejected for now. Restore this application if you change your mind.</p>
                  <button
                    type="button"
                    className="crew-apps__accept"
                    onClick={() => restoreApplication(selectedApplication)}
                  >
                    Restore application
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default CrewCallApplications;
