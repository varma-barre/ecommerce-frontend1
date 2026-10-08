import { useState } from "react";
import { API_URL } from "../config/api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check phone number
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setMessage(
        data.message || "Registration successful!"
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">

      <h1>Create Account</h1>

      <p className="register-subtitle">
        Register to continue shopping
      </p>


      {/* SUCCESS MESSAGE */}

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}


      {/* ERROR MESSAGE */}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      <form onSubmit={handleSubmit}>

        {/* NAME */}

        <div className="form-group">

          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

        </div>


        {/* EMAIL */}

        <div className="form-group">

          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

        </div>


        {/* PHONE */}

        <div className="form-group">

          <label htmlFor="phone">
            Phone Number
          </label>

          <input
            id="phone"
            type="tel"
            name="phone"
            placeholder="Enter 10-digit phone number"
            value={formData.phone}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            required
          />

        </div>


        {/* PASSWORD */}

        <div className="form-group">

          <label htmlFor="password">
            Password
          </label>

          <div className="password-input-wrapper">

            <input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword ? (

                /* EYE OFF ICON */

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 3l18 18" />

                  <path
                    d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                  />

                  <path
                    d="M9.8 4.3A10.5 10.5 0 0 1 12 4c5.2 0 8.5 3.3 10 8a14.5 14.5 0 0 1-3.2 4.8"
                  />

                  <path
                    d="M6.7 6.7C4.7 8 3.3 10 2 12c1.5 4.7 4.8 8 10 8 1.6 0 3.1-.3 4.4-.9"
                  />
                </svg>

              ) : (

                /* EYE ICON */

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>

              )}

            </button>

          </div>

        </div>


        {/* CONFIRM PASSWORD */}

        <div className="form-group">

          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <div className="password-input-wrapper">

            <input
              id="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >

              {showConfirmPassword ? (

                /* EYE OFF ICON */

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 3l18 18" />

                  <path
                    d="M10.6 10.6a2 2 0 0 0 2.8 2.8"
                  />

                  <path
                    d="M9.8 4.3A10.5 10.5 0 0 1 12 4c5.2 0 8.5 3.3 10 8a14.5 14.5 0 0 1-3.2 4.8"
                  />

                  <path
                    d="M6.7 6.7C4.7 8 3.3 10 2 12c1.5 4.7 4.8 8 10 8 1.6 0 3.1-.3 4.4-.9"
                  />
                </svg>

              ) : (

                /* EYE ICON */

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                  />

                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                  />
                </svg>

              )}

            </button>

          </div>

        </div>


        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Create Account"}
        </button>

      </form>

    </div>
  );
}

export default Register;