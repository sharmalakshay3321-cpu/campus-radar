import React from "react";
import { Link } from "react-router-dom";
import "./LoginSelection.css";

function LoginSelection() {
  return (
    <div className="selection-page">

      {/* Left White Panel */}
      <div className="selection-left">
      

        <h2>Your Campus.<br />Your Community.</h2>

        <p>
          Connect with your campus community, discover clubs,
          and find opportunities to participate.
        </p>
      </div>

      {/* Right Selection Panel */}
      <div className="selection-right">

        <div className="selection-content">

          <h1>Welcome to Campus Radar!</h1>

          <p className="selection-subtitle">
            Choose how you want to continue.
          </p>

          {/* Student Card */}
          <div className="selection-card">
            <div className="selection-icon">🎓</div>

            <div className="selection-card-text">
              <h2>I'm a Student</h2>
              <p>
                Discover campus events, join clubs,
                and connect with fellow students.
              </p>
            </div>

            <Link
              to="/login/student"
              className="selection-button"
            >
              Continue as Student →
            </Link>
          </div>

          {/* Club Card */}
          <div className="selection-card">
            <div className="selection-icon">🏛️</div>

            <div className="selection-card-text">
              <h2>I'm a Club</h2>
              <p>
                Manage your club profile and connect
                with students across campus.
              </p>
            </div>

            <Link
              to="/login/club"
              className="selection-button"
            >
              Continue as Club →
            </Link>
          </div>

          <p className="selection-footer">
            Connecting campus communities, one step at a time.
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginSelection;