import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Campus Radar Community Logo.png";
import "./ClubSignup.css";

const categories = [
  "Technical",
  "Cultural",
  "Sports",
  "Social Service",
  "Arts and Literature",
  "Other",
];

export default function ClubSignup() {
  const [values, setValues] = useState({
    clubName: "",
    email: "",
    category: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!values.clubName.trim()) {
      newErrors.clubName = "Enter your club name.";
    }

    if (!values.email.trim()) {
      newErrors.email = "Enter your club email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!values.category) {
      newErrors.category = "Select a club category.";
    }

    if (!values.description.trim()) {
      newErrors.description = "Enter your club description.";
    }

    if (!values.password) {
      newErrors.password = "Create a password.";
    } else if (values.password.length < 6) {
      newErrors.password = "Use at least 6 characters.";
    }

    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!accepted) {
      newErrors.terms = "Please accept the terms to continue.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // UI prototype only: no account is saved and no password is stored.
      setSuccess(true);
    }
  }

  return (
    <div className="club-signup-page">
      <section className="club-signup-brand">
        <div className="club-signup-brand-inner">
          <h1 className="club-signup-brand-name">
            Campus Radar
          </h1>

          <h2 className="club-signup-headline">
            Your Club.
            <br />
            Your Impact.
          </h2>

          <p className="club-signup-tagline">
            Give your club a voice, grow your community,
            and inspire students to get involved.
          </p>
        </div>
      </section>

      <section className="club-signup-form-panel">
        <div className="club-signup-card">
          <h2 className="club-signup-title">
            Create Your Club Account
          </h2>

          <p className="club-signup-subtitle">
            Bring your campus community together with Campus Radar.
          </p>

          {success ? (
            <div className="club-signup-success">
              <h3>Form completed successfully!</h3>

              <p>
                This is a UI prototype. No account has been
                saved and no password has been stored.
              </p>

              <Link to="/login/club">
                Continue to Club Login
              </Link>
            </div>
          ) : (
            <form
              className="club-signup-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="club-signup-field">
                <label htmlFor="club-signup-name">
                  Club Name
                </label>

                <input
                  id="club-signup-name"
                  name="clubName"
                  value={values.clubName}
                  onChange={handleChange}
                  placeholder="e.g. Robotics Club"
                />

                {errors.clubName && (
                  <p className="club-signup-error">
                    {errors.clubName}
                  </p>
                )}
              </div>

              <div className="club-signup-field">
                <label htmlFor="club-signup-email">
                  Club Email
                </label>

                <input
                  id="club-signup-email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="club@college.edu"
                />

                {errors.email && (
                  <p className="club-signup-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="club-signup-field">
                <label htmlFor="club-signup-category">
                  Club Category
                </label>

                <select
                  id="club-signup-category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className="club-signup-error">
                    {errors.category}
                  </p>
                )}
              </div>

              <div className="club-signup-field">
                <label htmlFor="club-signup-description">
                  Club Description
                </label>

                <textarea
                  id="club-signup-description"
                  name="description"
                  rows="3"
                  value={values.description}
                  onChange={handleChange}
                  placeholder="Tell students about your club..."
                />

                {errors.description && (
                  <p className="club-signup-error">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="club-signup-row">
                <div className="club-signup-field">
                  <label htmlFor="club-signup-password">
                    Password
                  </label>

                  <input
                    id="club-signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                  />

                  {errors.password && (
                    <p className="club-signup-error">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="club-signup-field">
                  <label htmlFor="club-signup-confirm">
                    Confirm Password
                  </label>

                  <input
                    id="club-signup-confirm"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                  />

                  {errors.confirmPassword && (
                    <p className="club-signup-error">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="club-signup-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide passwords" : "Show passwords"}
              </button>

              <div className="club-signup-terms">
                <label>
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                  />

                  <span>
                    I agree to the Terms and Conditions
                  </span>
                </label>

                {errors.terms && (
                  <p className="club-signup-error">
                    {errors.terms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="club-signup-submit"
              >
                Create Club Account
              </button>
            </form>
          )}

          <p className="club-signup-switch">
            Already have a club account?{" "}
            <Link to="/login/club">Sign In</Link>
          </p>

          <p className="club-signup-back">
            <Link to="/login-selection">
              Back to Login Selection
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}