
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  defaultAddress: {
    address: "",
    city: "",
    state: "",
    pincode: "",
  },
};

function Profile() {
  const { token } = useAuth();

  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!token) {
        setError("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your profile."
          );
        }

        if (cancelled) return;

        const user = data.user || {};

        const nextProfile = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          defaultAddress: {
            address: user.defaultAddress?.address || "",
            city: user.defaultAddress?.city || "",
            state: user.defaultAddress?.state || "",
            pincode: user.defaultAddress?.pincode || "",
          },
        };

        setProfile(nextProfile);
        setEditedName(nextProfile.name);
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError.message || "Unable to load your profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setError("");
    setSuccess("");

    if (name in profile.defaultAddress) {
      setProfile((previous) => ({
        ...previous,
        defaultAddress: {
          ...previous.defaultAddress,
          [name]: value,
        },
      }));
    } else {
      setProfile((previous) => ({
        ...previous,
        [name]: value,
      }));
    }
  };

  // Save the name only when the user explicitly clicks Save.
  const handleSaveName = async () => {
    const name = editedName.trim();

    if (name.length < 3) {
      setError("Name must contain at least 3 characters.");
      return;
    }

    try {
      setSavingName(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/auth/profile/name`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update name."
        );
      }

      setProfile((previous) => ({
        ...previous,
        name: data.user.name,
      }));

      setEditedName(data.user.name);
      setIsEditingName(false);

      setSuccess("Your name has been updated successfully.");
    } catch (saveError) {
      setError(
        saveError.message || "Unable to save your name."
      );
    } finally {
      setSavingName(false);
    }
  };

  // Save phone number and default address.
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (isEditingName) {
      setError(
        "Please save or cancel your name edit before saving the profile."
      );
      return;
    }

    const phone = profile.phone.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    const { address, city, state, pincode } =
      profile.defaultAddress;

    if (
      address.trim().length < 5 ||
      city.trim().length < 2 ||
      state.trim().length < 2 ||
      !/^[0-9]{6}$/.test(pincode.trim())
    ) {
      setError(
        "Please enter a complete address, city, state, and 6-digit pincode."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            phone,
            defaultAddress: {
              address: address.trim(),
              city: city.trim(),
              state: state.trim(),
              pincode: pincode.trim(),
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save your profile."
        );
      }

      const user = data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        defaultAddress: {
          address: user.defaultAddress?.address || "",
          city: user.defaultAddress?.city || "",
          state: user.defaultAddress?.state || "",
          pincode: user.defaultAddress?.pincode || "",
        },
      });

      setEditedName(user.name || "");

      setSuccess(
        "Your phone number and default delivery address have been saved."
      );
    } catch (saveError) {
      setError(
        saveError.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <span className="profile-spinner" />
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error && !profile.email) {
    return (
      <main className="profile-page">
        <section className="profile-message-card">
          <span className="profile-message-icon">!</span>
          <h2>Unable to open your profile</h2>
          <p>{error}</p>
          <Link
            className="profile-primary-link"
            to="/login"
          >
            Go to Login
          </Link>
        </section>
      </main>
    );
  }

  const addressSaved = Boolean(
    profile.defaultAddress.address &&
      profile.defaultAddress.city &&
      profile.defaultAddress.state &&
      profile.defaultAddress.pincode
  );

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-page-header">
          <div>
            <span className="profile-eyebrow">
              YOUR ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and delivery
              preferences.
            </p>
          </div>

          <Link
            to="/orders"
            className="profile-orders-link"
          >
            <span aria-hidden="true">▤</span>
            My Orders
          </Link>
        </header>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <div className="profile-avatar">
                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <h2>{profile.name || "Your Account"}</h2>
              <p>{profile.email}</p>

              <span className="profile-account-badge">
                <span />
                Customer Account
              </span>
            </div>

            <div className="profile-sidebar-links">
              <div className="profile-sidebar-item active">
                <span aria-hidden="true">♙</span>
                <span>Personal Information</span>
              </div>

              <Link
                to="/orders"
                className="profile-sidebar-item"
              >
                <span aria-hidden="true">▤</span>
                <span>My Orders</span>
              </Link>

              <Link
                to="/products"
                className="profile-sidebar-item"
              >
                <span aria-hidden="true">⌕</span>
                <span>Continue Shopping</span>
              </Link>
            </div>

            <div className="profile-sidebar-note">
              <span aria-hidden="true">✓</span>
              <p>
                Your saved address will be available at checkout
                whenever you place an order.
              </p>
            </div>
          </aside>

          <section className="profile-form-card">
            <div className="profile-section-heading">
              <div className="profile-section-icon">
                <span aria-hidden="true">♙</span>
              </div>

              <div>
                <h2>Personal Information</h2>
                <p>Update your name and contact details.</p>
              </div>
            </div>

            {error && (
              <div
                className="profile-alert profile-alert-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="profile-alert profile-alert-success"
                role="status"
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="profile-form-grid">
                <div className="profile-field profile-field-full">
                  <label htmlFor="profile-name">
                    Full Name
                  </label>

                  <div className="profile-name-edit-row">
                    <input
                      id="profile-name"
                      type="text"
                      value={
                        isEditingName
                          ? editedName
                          : profile.name
                      }
                      onChange={(event) =>
                        setEditedName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      autoComplete="name"
                      minLength={3}
                      maxLength={100}
                      readOnly={!isEditingName}
                      required
                    />

                    {!isEditingName ? (
                      <button
                        type="button"
                        className="profile-save-button"
                        onClick={() => {
                          setEditedName(profile.name);
                          setIsEditingName(true);
                          setError("");
                          setSuccess("");
                        }}
                      >
                        Edit Name
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="profile-save-button"
                          onClick={handleSaveName}
                          disabled={savingName}
                        >
                          {savingName ? "Saving..." : "Save"}
                        </button>

                        <button
                          type="button"
                          className="profile-cancel-button"
                          onClick={() => {
                            setEditedName(profile.name);
                            setIsEditingName(false);
                            setError("");
                          }}
                          disabled={savingName}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="profile-field profile-field-full">
                  <label htmlFor="profile-email">
                    Email Address
                  </label>

                  <div className="profile-readonly-field">
                    <span aria-hidden="true">✉</span>

                    <input
                      id="profile-email"
                      type="email"
                      value={profile.email}
                      readOnly
                    />

                    <span
                      className="profile-verified-label"
                      title="Email cannot be changed here"
                    >
                      Read-only
                    </span>
                  </div>

                  <small>
                    Your registered email address is protected
                    from changes on this page.
                  </small>
                </div>

                <div className="profile-field profile-field-full">
                  <label htmlFor="profile-phone">
                    Phone Number
                  </label>

                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    autoComplete="tel"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-divider" />

              <div className="profile-section-heading">
                <div className="profile-section-icon address-icon">
                  <span aria-hidden="true">⌖</span>
                </div>

                <div>
                  <h2>Default Delivery Address</h2>
                  <p>
                    This address will be prefilled at checkout.
                  </p>
                </div>
              </div>

              <div className="profile-default-address-banner">
                <span aria-hidden="true">✓</span>

                <div>
                  <strong>
                    {addressSaved
                      ? "Default address saved"
                      : "Add your delivery address"}
                  </strong>

                  <p>
                    {addressSaved
                      ? "You can update these details whenever needed."
                      : "Complete the fields below and save your address."}
                  </p>
                </div>
              </div>

              <div className="profile-form-grid">
                <div className="profile-field profile-field-full">
                  <label htmlFor="profile-address">
                    House / Flat / Street Address
                  </label>

                  <textarea
                    id="profile-address"
                    name="address"
                    value={profile.defaultAddress.address}
                    onChange={handleChange}
                    placeholder="House number, street, area, landmark"
                    rows={3}
                    autoComplete="street-address"
                    required
                    minLength={5}
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-city">City</label>

                  <input
                    id="profile-city"
                    name="city"
                    value={profile.defaultAddress.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-state">State</label>

                  <input
                    id="profile-state"
                    name="state"
                    value={profile.defaultAddress.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    autoComplete="address-level1"
                    required
                  />
                </div>

                <div className="profile-field">
                  <label htmlFor="profile-pincode">
                    PIN Code
                  </label>

                  <input
                    id="profile-pincode"
                    name="pincode"
                    value={profile.defaultAddress.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    autoComplete="postal-code"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
              </div>

              <div className="profile-form-footer">
                <p>
                  <span aria-hidden="true">🔒</span>
                  Your information is saved to your account.
                </p>

                <button
                  type="submit"
                  className="profile-save-button"
                  disabled={saving || isEditingName}
                >
                  {saving ? (
                    <>
                      <span className="profile-button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">✓</span>
                      Save Profile &amp; Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Profile;
