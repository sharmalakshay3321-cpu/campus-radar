import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Campus Radar Community Logo.png";
import "./ClubLogin.css";

export default function ClubLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
if (!values.email.trim()) {
  newErrors.email = "Enter your club email.";
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
  newErrors.email = "Enter a valid email address.";
}

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccess(true);
    }
  }

  return (
    <div className="club-login-page">
      <section className="club-login-brand">
        <div className="club-login-brand-inner">
          <h1 className="club-login-brand-name">Campus Radar</h1>

          <h2 className="club-login-headline">
            Your Club.
            <br />
            Your Impact.
          </h2>

          <p className="club-login-tagline">
            Give your club a voice, grow your community,
            and inspire students to get involved.
          </p>
        </div>
      </section>

      <section className="club-login-form-panel">
        <div className="club-login-card">
          <h2 className="club-login-title">
            Welcome Back, Club!
          </h2>

          <p className="club-login-subtitle">
            Sign in to manage your club on Campus Radar.
          </p>

          <form
            className="club-login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="club-login-field">
              <label htmlFor="club-login-email">
                Club Email
              </label>

              <input
                id="club-login-email"
                type="email"
                placeholder="club@college.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSuccess(false);
                }}
              />

              {errors.email && (
                <p className="club-login-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="club-login-field">
              <label htmlFor="club-login-password">
                Password
              </label>

              <div className="club-login-password-wrap">
                <input
                  id="club-login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSuccess(false);
                  }}
                />

                <button
                  type="button"
                  className="club-login-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="club-login-error">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="club-login-options">
              <label className="club-login-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />

                <span>Remember me</span>
              </label>

              <span className="club-login-note">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="club-login-submit"
            >
              Sign In
            </button>

            {success && (
              <p className="club-login-success">
                Form validated successfully! This is a UI
                prototype, not a real login.
              </p>
            )}
          </form>

          <p className="club-login-switch">
            New to Campus Radar?{" "}
            <Link to="/signup/club">
              Register to Club
            </Link>
          </p>

          <p className="club-login-back">
            <Link to="/login-selection">
              Back to Login Selection
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}