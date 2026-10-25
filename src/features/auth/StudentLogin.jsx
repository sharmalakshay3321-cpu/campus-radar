import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Campus Radar Community Logo.png";
import { findStudentByEmail, loginUser } from "../../utils/storage";
import "./auth.css";

function StudentLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!email.trim()) {
      setErrors({ email: "Please enter your email." });
      return;
    }

    if (!password.trim()) {
      setErrors({ password: "Please enter your password." });
      return;
    }

    const student = findStudentByEmail(email);

    if (!student) {
      setErrors({
        email: "Account not found. Please sign up first.",
      });
      return;
    }

    try {
      loginUser(student);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({
        general: "Something went wrong. Please try again.",
      });
    }
  };

  // Open the student signup page
  const handleSignupClick = (e) => {
    e.preventDefault();
    navigate("/signup/student");
  };

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-brand">
        <h2>Your Campus. Your Community.</h2>

        <p>
          Discover events, connect with students, and explore everything
          happening around your campus.
        </p>
      </div>

      {/* Right login panel */}
      <div className="auth-column">
        <div className="auth-card">
          <div className="auth-header">
            <img
              src={logo}
              alt="Campus Radar Logo"
              className="auth-logo"
            />

            <p className="auth-eyebrow">Welcome back</p>

            <h1 className="auth-title">
              Log in to your account
            </h1>

            <p className="auth-subtitle">
              Stay connected with everything happening on campus.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <div className="auth-field">
              <label htmlFor="student-email">Email</label>

              <input
                id="student-email"
                type="email"
                className={`auth-input ${
                  errors.email ? "has-error" : ""
                }`}
                placeholder="Enter your email id"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({});
                }}
              />

              {errors.email && (
                <p className="auth-error" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="student-password">
                  Password
                </label>
              </div>

              <div className="auth-input-wrap">
                <input
                  id="student-password"
                  type={showPassword ? "text" : "password"}
                  className={`auth-input has-toggle ${
                    errors.password ? "has-error" : ""
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({});
                  }}
                />

                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {errors.password && (
                <p className="auth-error" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember me */}
            <label className="auth-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) =>
                  setRemember(e.target.checked)
                }
              />

              Remember me
            </label>

            {errors.general && (
              <p className="auth-error" role="alert">
                {errors.general}
              </p>
            )}

            <button type="submit" className="auth-button">
              Log In →
            </button>
          </form>

          {/* Signup navigation */}
          <p className="auth-switch">
            Don't have an account?{" "}
            <Link
              to="/signup/student"
              className="auth-link"
              onClick={handleSignupClick}
            >
              Sign up
            </Link>
          </p>

          <p className="auth-tagline">
            Discover. Connect. Belong.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;