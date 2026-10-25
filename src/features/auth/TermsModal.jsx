import { useEffect } from "react";
import "./TermsModal.css";

function TermsModal({ onClose, onAccept }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    // Prevent background scrolling while the popup is open.
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="terms-modal-backdrop"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        {/* Popup header */}
        <header className="terms-modal-header">
          <div>
            <span className="terms-modal-eyebrow">
              CAMPUS RADAR
            </span>

            <h2 id="terms-modal-title">
              Legal Center
            </h2>

            <p>
              Guidelines for a safe, fair, and useful campus community.
            </p>
          </div>

          <button
            type="button"
            className="terms-modal-close"
            onClick={onClose}
            aria-label="Close Terms and Conditions"
          >
            ×
          </button>
        </header>

        {/* Scrollable legal content */}
        <div className="terms-modal-content">
          <div className="terms-welcome">
            <h3>Welcome to Campus Radar!</h3>

            <p>
              Campus Radar is an independent, student-led platform
              created to help students discover campus events, clubs,
              activities, and connect with their campus community.
            </p>

            <p>
              Please read the following policies and guidelines
              before using the platform.
            </p>
          </div>

          <section className="terms-section">
            <h3>I. Platform Identity &amp; Purpose</h3>

            <article className="terms-card">
              <h4>1. Independent Student Initiative</h4>

              <p>
                Campus Radar is an independent, student-led platform
                created by students of Chitkara University, CUIET.
                It is designed to help students discover campus events,
                clubs, activities, and connect with their campus
                community.
              </p>

              <p>
                Campus Radar is not officially affiliated with,
                endorsed by, or operated by Chitkara University,
                unless explicitly stated otherwise.
              </p>
            </article>

            <article className="terms-card">
              <h4>2. Platform Purpose</h4>

              <p>
                Campus Radar provides a centralized platform for
                students to discover events and clubs, connect with
                other students, find teammates through Crew Calls,
                participate in Gather discussions, and stay updated
                with campus activities.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>II. Financial Disclaimer</h3>

            <article className="terms-card">
              <h4>3. Payments &amp; Financial Responsibility</h4>

              <p>
                Campus Radar does not charge users or clubs a service
                commission unless explicitly stated. Any event-related
                payments, refunds, or cancellations are the
                responsibility of the respective club or event
                organizer.
              </p>

              <p>
                Campus Radar is not responsible for financial disputes
                between students and event organizers.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>III. Access, Data &amp; Privacy</h3>

            <article className="terms-card">
              <h4>4. Eligibility &amp; Access</h4>

              <p>
                Campus Radar is primarily intended for students of
                Chitkara University, CUIET. Access may require account
                or university email verification, and Campus Radar may
                modify or restrict access when necessary.
              </p>
            </article>

            <article className="terms-card">
              <h4>5. Data &amp; Privacy</h4>

              <p>
                Campus Radar collects information required to provide
                its features, such as name, email, college information,
                profile details, and content submitted by users.
              </p>

              <p>
                This information may be used to manage accounts,
                provide events and community features, send
                notifications, and improve the platform. Personal
                information is not sold or commercially distributed.
                Information may be shared with relevant organizers
                when necessary for event registration or participation.
              </p>
            </article>

            <article className="terms-card">
              <h4>6. Data Protection</h4>

              <p>
                We take reasonable measures to protect user information
                and maintain platform security. However, no online
                platform can guarantee complete security. Users are
                responsible for keeping their account credentials
                secure.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>IV. Responsibilities &amp; Liabilities</h3>

            <article className="terms-card">
              <h4>7. Club &amp; Event Responsibility</h4>

              <p>
                Clubs and event organizers are responsible for their
                event information, execution, schedules, certificates,
                refunds, cancellations, and participant arrangements.
              </p>

              <p>
                Campus Radar provides the digital platform and is not
                responsible for event cancellations, incorrect
                information, event quality, organizer actions, injuries,
                damages, or losses related to events.
              </p>
            </article>

            <article className="terms-card">
              <h4>8. Certificates &amp; Badges</h4>

              <p>
                Certificates and badges may depend on attendance
                verification and approval from the respective club
                or organizer.
              </p>

              <p>
                Campus Radar does not guarantee the issuance of
                certificates or badges without confirmation from the
                relevant organizer.
              </p>
            </article>

            <article className="terms-card">
              <h4>9. Limitation of Liability</h4>

              <p>
                Campus Radar is not responsible for technical outages,
                data loss beyond reasonable control, third-party
                service failures, or actions of users and organizers.
              </p>

              <p>
                Users access and use the platform at their own
                discretion.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>V. Platform Policies &amp; Conduct</h3>

            <article className="terms-card">
              <h4>10. Platform Modifications</h4>

              <p>
                Campus Radar may add, remove, or modify features,
                update policies, restrict access, or suspend certain
                services as the platform develops.
              </p>
            </article>

            <article className="terms-card">
              <h4>11. User Conduct</h4>

              <p>
                Users must use Campus Radar responsibly and must not:
              </p>

              <ul>
                <li>Misuse the platform.</li>
                <li>Upload harmful or illegal content.</li>
                <li>Impersonate others.</li>
                <li>Harass or spam users.</li>
                <li>
                  Attempt to exploit or damage platform systems.
                </li>
              </ul>

              <p className="terms-warning">
                Violation of any rule or misuse of the platform will
                lead to suspension of the account.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>VI. Intellectual Property</h3>

            <article className="terms-card">
              <h4>12. Intellectual Property</h4>

              <p>
                Campus Radar's original design, code, branding,
                graphics, and content belong to Campus Radar where
                applicable. Club logos, event posters, and other
                third-party materials remain the property of their
                respective owners.
              </p>

              <p>
                Users are responsible for ensuring they have
                permission to upload or share content.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>VII. Acceptance of Terms</h3>

            <article className="terms-card">
              <h4>13. Acceptance of Terms</h4>

              <p>
                By accessing or using Campus Radar, users agree to
                follow these policies and guidelines and are
                responsible for their activity on the platform.
              </p>

              <p>
                If you do not agree with these terms, please
                discontinue use of Campus Radar.
              </p>
            </article>
          </section>

          <section className="terms-section">
            <h3>VIII. Community Features</h3>

            <article className="terms-card">
              <h4>14. Lost &amp; Found</h4>

              <p>
                The Lost &amp; Found feature helps students report and
                locate missing items. Users should provide accurate
                information and avoid sharing unnecessary personal
                or sensitive details.
              </p>

              <p>
                Campus Radar helps connect users but does not
                guarantee the recovery of lost items.
              </p>
            </article>

            <article className="terms-card">
              <h4>15. Messages, Gather &amp; Crew Calls</h4>

              <p>
                These features are provided to help students
                communicate, discuss ideas, and collaborate.
              </p>

              <p>
                Users should communicate respectfully, avoid spam
                or harassment, and not share another person's private
                information without permission.
              </p>
            </article>
          </section>

          <section className="terms-contact">
            <h3>Contact Us</h3>

            <p>
              Have a question or concern about Campus Radar?
            </p>

            <p>
              For privacy, event, account, content, or platform-related
              concerns, contact the Campus Radar team.
            </p>

            <p className="terms-warning">
              Violation of any rule or misuse of the platform will
              lead to suspension of the account.
            </p>
          </section>

          <footer className="terms-footer">
            <h3>💜 Campus Radar</h3>
            <p>Discover. Connect. Be part of it.</p>
          </footer>
        </div>

        {/* Popup footer */}
        <footer className="terms-modal-footer">
          <p>
            Please read the terms before accepting them.
          </p>

          <div className="terms-modal-actions">
            <button
              type="button"
              className="terms-close-button"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="terms-accept-button"
              onClick={onAccept}
            >
              Accept Terms ✓
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default TermsModal;