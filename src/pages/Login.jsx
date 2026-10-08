import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =========================================================
  // EMAIL CHANGE
  // =========================================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };


  // =========================================================
  // PASSWORD CHANGE
  // =========================================================

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };


  // =========================================================
  // LOGIN SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");


    // =======================================================
    // VALIDATION
    // =======================================================

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }


    try {
      setLoading(true);


      // =====================================================
      // LOGIN API
      // =====================================================

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );


      // =====================================================
      // READ RESPONSE
      // =====================================================

      const text = await response.text();

      console.log("STATUS:", response.status);

      let result;

      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error(
          "Backend returned non-JSON:",
          text
        );

        throw new Error(
          "Server returned an invalid response. Please check the login API."
        );
      }

      console.log("LOGIN RESULT:", result);


      // =====================================================
      // BACKEND ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Invalid email or password"
        );
      }


      // =====================================================
      // TOKEN VALIDATION
      // =====================================================

      if (!result.token) {
        throw new Error(
          result.message ||
          "Login successful, but token was not received"
        );
      }


      // =====================================================
      // USER VALIDATION
      // =====================================================

      if (!result.user) {
        throw new Error(
          "Login successful, but user information was not received"
        );
      }


      // =====================================================
      // GET USER ROLE
      // =====================================================

      const userRole = result.user.role;


      // =====================================================
      // SAVE AUTHENTICATION DATA
      // =====================================================

      login(
        result.user,
        result.token
      );


      // =====================================================
      // SUCCESS MESSAGE
      // =====================================================

      setSuccess(
        result.message ||
        "Login successful"
      );


      // =====================================================
      // ROLE-BASED NAVIGATION
      //
      // ADMIN  -> ADMIN DASHBOARD
      // USER   -> PRODUCTS
      // =====================================================

      if (userRole === "admin") {

        navigate("/admin/dashboard");

      } else {

        navigate("/products");

      }

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );

      setError(
        error.message ||
        "Unable to login. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // COMPONENT
  // =========================================================

  return (
    <div className="login-page">

      <div className="login-wrapper">


        {/* =====================================================
            LEFT BRAND SECTION
        ====================================================== */}

        <div className="login-brand-panel">

          <div className="login-brand-content">


            {/* BRAND LOGO */}

            <div className="login-brand-logo">
              ProductsHub
            </div>


            {/* BADGE */}

            <span className="login-brand-badge">
              WELCOME BACK
            </span>


            {/* MAIN HEADING */}

            <h1>
              Shop smarter.
              <br />

              <span>
                Live better.
              </span>
            </h1>


            {/* DESCRIPTION */}

            <p>
              Discover products you'll love,
              enjoy secure shopping and experience
              a simpler way to shop online.
            </p>


            {/* =================================================
                SHOPPING VISUAL
            ================================================== */}

            <div className="login-shopping-visual">

              <div className="login-orbit orbit-one"></div>

              <div className="login-orbit orbit-two"></div>


              <div className="login-product-card">

                <div className="login-product-icon">

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M6 8h12l1 12H5L6 8Z" />

                    <path
                      d="M9 8V6a3 3 0 0 1 6 0v2"
                    />
                  </svg>

                </div>


                <div>

                  <strong>
                    ProductsHub
                  </strong>

                  <span>
                    Everything you need
                  </span>

                </div>

              </div>

            </div>


            {/* =================================================
                BENEFITS
            ================================================== */}

            <div className="login-benefits">

              <div>

                <span className="benefit-check">
                  ✓
                </span>

                Secure shopping

              </div>


              <div>

                <span className="benefit-check">
                  ✓
                </span>

                Quality products

              </div>


              <div>

                <span className="benefit-check">
                  ✓
                </span>

                Easy checkout

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT LOGIN SECTION
        ====================================================== */}

        <div className="login-form-panel">

          <div className="login-form-container">


            {/* MOBILE LOGO */}

            <div className="login-mobile-logo">
              MyStore
            </div>


            {/* =================================================
                LOGIN HEADING
            ================================================== */}

            <div className="login-heading">

              <span>
                ACCOUNT ACCESS
              </span>

              <h2>
                Welcome back
              </h2>

              <p>
                Sign in to continue shopping with ProductsHub.
              </p>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================== */}

            {success && (
              <div className="login-success">

                <span>
                  ✓
                </span>

                {success}

              </div>
            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (
              <div className="login-error">

                <span>
                  !
                </span>

                {error}

              </div>
            )}


            {/* =================================================
                LOGIN FORM
            ================================================== */}

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >


              {/* =================================================
                  EMAIL
              ================================================== */}

              <div className="login-field">

                <label htmlFor="login-email">
                  Email address
                </label>


                <div className="login-input-wrapper">

                  <span className="login-input-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >

                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="m3 7 9 6 9-6" />

                    </svg>

                  </span>


                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div className="login-field">

                <div className="login-password-label">

                  <label htmlFor="login-password">
                    Password
                  </label>


                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => {
                      setError(
                        "Forgot password functionality is not available yet."
                      );
                    }}
                  >
                    Forgot password?
                  </button>

                </div>


                <div className="login-input-wrapper">


                  {/* PASSWORD ICON */}

                  <span className="login-input-icon">

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >

                      <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                      />

                      <path
                        d="M8 10V7a4 4 0 0 1 8 0v3"
                      />

                    </svg>

                  </span>


                  {/* PASSWORD INPUT */}

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    disabled={loading}
                  />


                  {/* SHOW / HIDE PASSWORD */}

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

                      /* HIDE ICON */

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

                      /* SHOW ICON */

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


              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span className="login-spinner"></span>

                    Signing in...
                  </>

                ) : (

                  <>
                    Sign in

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >

                      <path d="M5 12h14" />

                      <path d="m13 6 6 6-6 6" />

                    </svg>

                  </>

                )}

              </button>

            </form>


            {/* =================================================
                REGISTER
            ================================================== */}

            <div className="login-register">

              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create an account
              </Link>

            </div>


            {/* =================================================
                SECURITY
            ================================================== */}

            <div className="login-security">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >

                <path
                  d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6l-7-3Z"
                />

                <path
                  d="m9 12 2 2 4-4"
                />

              </svg>

              Secure & protected login

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;