import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Campus Radar Community Logo.png";
import TermsModal from "./TermsModal";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../../utils/storage";

function StudentSignup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    // Validate full name
    if (fullName.trim() === "") {
      newErrors.fullName = "Enter your full name.";
    }

    // Validate email
    if (email.trim() === "") {
      newErrors.email = "Enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Validate password
    if (password === "") {
      newErrors.password = "Create a password.";
    } else if (password.length < 8) {
      newErrors.password = "Use at least 8 characters.";
    }

    // Validate confirm password
    if (confirmPassword === "") {
      newErrors.confirmPassword = "Re-enter your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords don't match.";
    }

    // Validate Terms and Conditions
    if (!acceptTerms) {
      newErrors.acceptTerms =
        "Accept the Terms and Conditions to continue.";
    }

    setErrors(newErrors);

    // Continue only when validation succeeds
    if (Object.keys(newErrors).length === 0) {
     const result = registerStudent({
  name: fullName,
  email: email,
  password:password,
});

if (!result.success) {
  setErrors((prev) => ({
    ...prev,
    email: result.message,
  }));
  return;
}

alert("Account created successfully! Please log in.");
navigate("/login/");

      // Connect your existing registration logic here.
      // This validation alone does not create an account.
    }
  }

  return (
    <div className="auth-page signup-page">

      {/* =====================================
          LEFT SIDE: SIGN-UP FORM
      ====================================== */}

      <div className="auth-column signup-column">
        <div className="auth-card">

          {/* Logo and heading */}
          <div className="auth-header">
            <img
              className="auth-logo"
              src={logo}
              alt="Campus Radar"
            />

            <p className="auth-eyebrow">
              Join the campus
            </p>

            <h1 className="auth-title">
              Create your account
            </h1>

            <p className="auth-subtitle">
              Join Campus Radar and discover what's happening
              around you.
            </p>
          </div>

          {/* Signup form */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >

            {/* Full name */}
            <div className="auth-field">
              <label htmlFor="signupFullName">
                Full name
              </label>

              <input
                id="signupFullName"
                type="text"
                autoComplete="name"
                className={
                  errors.fullName
                    ? "auth-input has-error"
                    : "auth-input"
                }
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => {
                  setFullName(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    fullName: "",
                  }));
                }}
              />

              {errors.fullName && (
                <p className="auth-error">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label htmlFor="signupEmail">
                Email
              </label>

              <input
                id="signupEmail"
                type="email"
                autoComplete="email"
                className={
                  errors.email
                    ? "auth-input has-error"
                    : "auth-input"
                }
                placeholder="Enter your email id"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    email: "",
                  }));
                }}
              />

              {errors.email && (
                <p className="auth-error">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="signupPassword">
                Password
              </label>

              <div className="auth-input-wrap">
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className={
                    errors.password
                      ? "auth-input has-toggle has-error"
                      : "auth-input has-toggle"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      password: "",
                    }));
                  }}
                />

                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="auth-error">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="auth-field">
              <label htmlFor="signupConfirmPassword">
                Confirm password
              </label>

              <input
                id="signupConfirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={
                  errors.confirmPassword
                    ? "auth-input has-error"
                    : "auth-input"
                }
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setErrors((previous) => ({
                    ...previous,
                    confirmPassword: "",
                  }));
                }}
              />

              {errors.confirmPassword && (
                <p className="auth-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="auth-terms-wrapper">
              <label className="auth-check">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(event) => {
                    setAcceptTerms(event.target.checked);
                    setErrors((previous) => ({
                      ...previous,
                      acceptTerms: "",
                    }));
                  }}
                />

                <span>
                  I agree to the{" "}

                  <button
                    type="button"
                    className="auth-link auth-terms-trigger"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>

              {errors.acceptTerms && (
                <p className="auth-error">
                  {errors.acceptTerms}
                </p>
              )}
            </div>

            {/* Create account */}
            <button
              type="submit"
              className="auth-button"
            >
              Create Account →
            </button>

          </form>

          {/* Login link */}
          <p className="auth-switch">
            Already have an account?{" "}

            <Link
              to="/login"
              className="auth-link"
            >
              Log in
            </Link>
          </p>

          <p className="auth-tagline">
            Discover. Connect. Belong.
          </p>

        </div>
      </div>

      {/* =====================================
          RIGHT SIDE: CAMPUS RADAR INFORMATION
      ====================================== */}

      <div className="auth-brand signup-brand">

        <p className="signup-brand-eyebrow">
          WELCOME TO CAMPUS RADAR
        </p>

        <h2>
          Your Campus.
          <br />
          Your Community.
        </h2>

        <p className="signup-brand-description">
          Discover events, connect with students, and explore
          everything happening around your campus.
        </p>

        {/* Feature 1 */}
        <div className="signup-feature">
          <div className="signup-feature-icon">
            ✦
          </div>

          <div>
            <h3>Discover Campus Events</h3>

            <p>
              Find exciting events and activities happening
              around your campus.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="signup-feature">
          <div className="signup-feature-icon">
            ♡
          </div>

          <div>
            <h3>Connect With Students</h3>

            <p>
              Meet people, share interests, and build
              your campus community.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="signup-feature">
          <div className="signup-feature-icon">
            ✧
          </div>

          <div>
            <h3>Be Part of Something</h3>

            <p>
              Explore opportunities and make your campus
              experience memorable.
            </p>
          </div>
        </div>

      </div>

      {/* =====================================
          TERMS AND CONDITIONS POPUP
      ====================================== */}

      {showTerms && (
        <TermsModal
          onClose={() => setShowTerms(false)}
        />
      )}

    </div>
  );
}

export default StudentSignup;