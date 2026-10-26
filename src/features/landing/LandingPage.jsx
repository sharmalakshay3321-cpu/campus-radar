import { useEffect } from "react";
import "./LandingPage.css";

import logo from "../../assets/logo.png";
import eventsMascot from "../../assets/Event guy hero page pose.png";
import gatherMascot from "../../assets/Gather girl hero page pose.png";
import crewMascot from "../../assets/Crew calls girl hero page pose.png";
import clubsMascot from "../../assets/L&F guy hero page pose.png";

const features = [
  {
    id: "events",
    number: "01",
    name: "Events",
    heading: "Find your next campus moment.",
    description:
      "Discover events, activities, workshops, competitions and the things worth showing up for.",
    action: "See what's happening",
    image: eventsMascot,
    imageAlt: "Events mascot",
    className: "cr-feature--events",
    href: "/events",
  },
  {
    id: "gather",
    number: "02",
    name: "Gather",
    heading: "Ask. Discuss. Share.",
    description:
      "A campus conversation for questions, opinions, ideas, polls and the thoughts you don't want to keep to yourself.",
    action: "Join the conversation",
    image: gatherMascot,
    imageAlt: "Gather mascot",
    className: "cr-feature--gather",
    href: "/gather",
  },
  {
    id: "crew-calls",
    number: "03",
    name: "Crew Calls",
    heading: "Every idea needs a crew.",
    description:
      "Find students with the skills, interests and energy to turn a 'what if?' into something real.",
    action: "Find your people",
    image: crewMascot,
    imageAlt: "Crew Calls mascot",
    className: "cr-feature--crew",
    href: "/crew-calls",
  },
  {
    id: "clubs",
    number: "04",
    name: "Clubs",
    heading: "Find your kind of people.",
    description:
      "Explore campus clubs, discover shared interests and find a community where you belong.",
    action: "Explore clubs",
    image: clubsMascot,
    imageAlt: "Clubs mascot",
    className: "cr-feature--clubs",
    href: "/clubs",
  },
];

function LandingPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".cr-reveal");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) =>
        element.classList.add("cr-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cr-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="campus-radar-landing">
      <nav className="cr-nav" aria-label="Main navigation">
        <a
          className="cr-logo-slot"
          href="/"
          aria-label="Campus Radar home"
        >
          <img src={logo} alt="Campus Radar logo" />
        </a>

        <div className="cr-nav-links">
          <a href="#events">Events</a>
          <a href="#gather">Gather</a>
          <a href="#crew-calls">Crew Calls</a>
          <a href="#clubs">Clubs</a>
        </div>

        <a className="cr-login-link" href="/login-selection">
          Login
        </a>
      </nav>

      <section className="cr-hero" id="top">
        <div className="cr-hero-content">
          <p className="cr-eyebrow">Your campus, connected.</p>

          <h1 className="cr-hero-title">
            Discover.
            <br />
            <em>Connect.</em>
            <br />
            Be part of it.
          </h1>

          <p className="cr-hero-description">
            One place for the moments, conversations, people and little
            discoveries that make campus feel like yours.
          </p>

          <div className="cr-hero-actions">
            <a className="cr-button cr-button--dark" href="#features">
              Explore Campus Radar
            </a>

            <a className="cr-button" href="#events">
              See what's happening
            </a>
          </div>
        </div>
      </section>

      <section className="cr-features-section" id="features">
        {features.map((feature, index) => (
          <div key={feature.id}>
            <article
              id={feature.id}
              className={`cr-feature ${feature.className} cr-reveal`}
            >
              <div className="cr-feature-copy">
                <p className="cr-feature-label">
                  {feature.number} / {feature.name}
                </p>

                <h2>{feature.heading}</h2>

                <p className="cr-feature-description">
                  {feature.description}
                </p>

                <a className="cr-feature-link" href={feature.href}>
                  {feature.action}
                  <span aria-hidden="true"> →</span>
                </a>
              </div>

              <div className="cr-feature-image">
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  loading="lazy"
                />
              </div>
            </article>

            {index < features.length - 1 && (
              <div className="cr-bridge cr-reveal">
                {index === 0 && (
                  <p>
                    Different corners of campus.
                    <br />
                    <span>One place to find them.</span>
                  </p>
                )}

                {index === 1 && (
                  <p>
                    Have an idea?
                    <br />
                    <span>Don't build it alone.</span>
                  </p>
                )}

                {index === 2 && (
                  <p>
                    Find your people.
                    <br />
                    <span>Find your place.</span>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="cr-final cr-reveal">
        <div className="cr-final-content">
          <h2>
            Campus
            <br />
            Radar
          </h2>

          <p>Discover. Connect. Be part of it.</p>

          <a className="cr-button cr-button--dark" href="/login">
            Find your place on campus
          </a>
        </div>
      </section>

      <footer className="cr-footer">
        <span>© 2026 Campus Radar</span>
        <span>Discover. Connect. Be part of it.</span>
      </footer>
    </main>
  );
}

export default LandingPage;