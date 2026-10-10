
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function Checkout() {
  const { cart, cartTotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Load the current user's saved profile and default address.
  useEffect(() => {
    let cancelled = false;

    const fetchSavedProfile = async () => {
      if (!token) {
        setProfileLoading(false);
        setError("Please log in before proceeding to checkout.");
        return;
      }

      try {
        setProfileLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/auth/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load your saved profile."
          );
        }

        if (cancelled) return;

        const user = data.user || {};
        const address = user.defaultAddress || {};

        setFormData((previous) => ({
          ...previous,
          name: user.name || previous.name,
          phone: user.phone || previous.phone,
          address: address.address || previous.address,
          city: address.city || previous.city,
          state: address.state || previous.state,
          pincode: address.pincode || previous.pincode,
        }));
      } catch (fetchError) {
        if (!cancelled) {
          console.error(
            "Failed to load saved profile:",
            fetchError
          );

          setError(
            fetchError.message ||
              "Could not load saved delivery details."
          );
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    fetchSavedProfile();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Handle delivery and payment field changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setError("");
  };

  // Validate the checkout form.
  const validateForm = () => {
    const newErrors = {};

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 3) {
      newErrors.name =
        "Full name must contain at least 3 characters";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    if (!address) {
      newErrors.address = "Address is required";
    } else if (address.length < 5) {
      newErrors.address =
        "Please enter a complete address";
    }

    if (!city) {
      newErrors.city = "City is required";
    } else if (city.length < 2) {
      newErrors.city = "Please enter a valid city";
    }

    if (!state) {
      newErrors.state = "State is required";
    } else if (state.length < 2) {
      newErrors.state = "Please enter a valid state";
    }

    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode =
        "Pincode must contain exactly 6 digits";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Place the order using the existing orders API.
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    if (profileLoading) {
      setError("Please wait while your delivery details load.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    const shippingAddress = `
${formData.name.trim()}
${formData.phone.trim()}
${formData.address.trim()}
${formData.city.trim()}, ${formData.state.trim()}
Pincode: ${formData.pincode.trim()}
    `.trim();

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress,
            paymentMethod: formData.paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      if (!data.order?._id) {
        throw new Error(
          "The order was submitted, but no order ID was returned."
        );
      }

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );

      navigate(`/order-confirmation/${data.order._id}`);
    } catch (orderError) {
      console.error("Order error:", orderError);

      setError(
        orderError.message ||
          "Something went wrong while placing the order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && (
        <div className="checkout-error" role="alert">
          {error}
        </div>
      )}

      {profileLoading && (
        <p className="checkout-loading">
          Loading your saved delivery details...
        </p>
      )}

      <div className="checkout-container">
        {/* ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => {
            const itemTotal = item.price * item.quantity;

            return (
              <div
                className="checkout-item"
                key={item._id}
              >
                <div className="checkout-item-info">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="checkout-item-image"
                  />

                  <div className="checkout-item-details">
                    <h3>{item.name}</h3>
                    <p>Price: ₹{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="checkout-item-total">
                  ₹{itemTotal}
                </div>
              </div>
            );
          })}

          <div className="checkout-total">
            <span>Overall Total</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </div>

        {/* DELIVERY INFORMATION */}
        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >
          <h2>Delivery Information</h2>

          <div className="form-group">
            <label htmlFor="checkout-name">
              Full Name
            </label>

            <input
              id="checkout-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />

            {errors.name && (
              <p className="field-error">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-phone">
              Phone Number
            </label>

            <input
              id="checkout-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              autoComplete="tel"
              maxLength={10}
              inputMode="numeric"
              required
            />

            {errors.phone && (
              <p className="field-error">{errors.phone}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-address">
              Address
            </label>

            <textarea
              id="checkout-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street, area"
              rows={3}
              autoComplete="street-address"
              required
            />

            {errors.address && (
              <p className="field-error">
                {errors.address}
              </p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkout-city">City</label>

              <input
                id="checkout-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                autoComplete="address-level2"
                required
              />

              {errors.city && (
                <p className="field-error">{errors.city}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="checkout-state">State</label>

              <input
                id="checkout-state"
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                autoComplete="address-level1"
                required
              />

              {errors.state && (
                <p className="field-error">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="checkout-pincode">
              Pincode
            </label>

            <input
              id="checkout-pincode"
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter 6-digit pincode"
              autoComplete="postal-code"
              maxLength={6}
              inputMode="numeric"
              required
            />

            {errors.pincode && (
              <p className="field-error">
                {errors.pincode}
              </p>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div className="form-group payment-method-group">
            <label>Payment Method</label>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleChange}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={formData.paymentMethod === "UPI"}
                  onChange={handleChange}
                />
                <span>UPI</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={formData.paymentMethod === "CARD"}
                  onChange={handleChange}
                />
                <span>Card</span>
              </label>
            </div>

            {errors.paymentMethod && (
              <p className="field-error">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || profileLoading || !token}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
