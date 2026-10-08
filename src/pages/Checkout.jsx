import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function Checkout() {
  const { cart, cartTotal } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });

  // =====================================================
  // VALIDATION ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});

  // General API/server error
  const [error, setError] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error for the field user is correcting
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Remove general error
    setError("");
  };


  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    const newErrors = {};


    // -----------------------------------------------------
    // FULL NAME
    // -----------------------------------------------------

    const name = formData.name.trim();

    if (!name) {
      newErrors.name = "Full name is required";
    } else if (name.length < 3) {
      newErrors.name =
        "Full name must contain at least 3 characters";
    }


    // -----------------------------------------------------
    // PHONE NUMBER
    // -----------------------------------------------------

    const phone = formData.phone.trim();

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }


    // -----------------------------------------------------
    // ADDRESS
    // -----------------------------------------------------

    const address = formData.address.trim();

    if (!address) {
      newErrors.address = "Address is required";
    } else if (address.length < 5) {
      newErrors.address =
        "Please enter a complete address";
    }


    // -----------------------------------------------------
    // CITY
    // -----------------------------------------------------

    const city = formData.city.trim();

    if (!city) {
      newErrors.city = "City is required";
    } else if (city.length < 2) {
      newErrors.city =
        "Please enter a valid city";
    }


    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    const state = formData.state.trim();

    if (!state) {
      newErrors.state = "State is required";
    } else if (state.length < 2) {
      newErrors.state =
        "Please enter a valid state";
    }


    // -----------------------------------------------------
    // PINCODE
    // -----------------------------------------------------

    const pincode = formData.pincode.trim();

    if (!pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode =
        "Pincode must contain exactly 6 digits";
    }


    // -----------------------------------------------------
    // PAYMENT METHOD
    // -----------------------------------------------------

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method";
    }


    // Save validation errors
    setErrors(newErrors);

    // Return true only when there are no errors
    return Object.keys(newErrors).length === 0;
  };


  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Clear previous general error
    setError("");

    // -----------------------------------------------------
    // CHECK EMPTY CART
    // -----------------------------------------------------

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }


    // -----------------------------------------------------
    // VALIDATE FORM
    // -----------------------------------------------------

    const isValid = validateForm();

    if (!isValid) {
      return;
    }


    // -----------------------------------------------------
    // CREATE SHIPPING ADDRESS
    // -----------------------------------------------------

    const shippingAddress = `
${formData.name.trim()}
${formData.phone.trim()}
${formData.address.trim()}
${formData.city.trim()}, ${formData.state.trim()}
Pincode: ${formData.pincode.trim()}
    `.trim();


    // -----------------------------------------------------
    // SEND ORDER TO BACKEND
    // -----------------------------------------------------

    try {
      setLoading(true);

      const response = await fetch(
        "${API_URL/api/orders",
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


      // ---------------------------------------------------
      // READ BACKEND RESPONSE
      // ---------------------------------------------------

      const data = await response.json();


      // ---------------------------------------------------
      // HANDLE API ERROR
      // ---------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }


      // ---------------------------------------------------
      // SAVE ORDER FOR CONFIRMATION PAGE
      // ---------------------------------------------------

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );


      // ---------------------------------------------------
      // GO TO ORDER CONFIRMATION
      // ---------------------------------------------------

      navigate(`/order-confirmation/${data.order._id}`);

    } catch (error) {
      console.error("Order error:", error);

      setError(
        error.message ||
        "Something went wrong while placing the order."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // JSX
  // =====================================================

  return (
    <div className="checkout-page">

      <h1>Checkout</h1>


      {/* =================================================
          GENERAL ERROR
      ================================================= */}

      {error && (
        <div className="checkout-error">
          {error}
        </div>
      )}


      <div className="checkout-container">


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <div className="checkout-summary">

          <h2>Order Summary</h2>


          {cart.map((item) => {
            console.log("Checkout cart item:", item);

            const itemTotal =
              item.price * item.quantity;

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


          {/* TOTAL */}

          <div className="checkout-total">

            <span>
              Overall Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

        </div>


        {/* =================================================
            DELIVERY INFORMATION FORM
        ================================================= */}

        <form
          className="checkout-form"
          onSubmit={handlePlaceOrder}
        >

          <h2>Delivery Information</h2>


          {/* =================================================
              FULL NAME
          ================================================= */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

            {errors.name && (
              <p className="field-error">
                {errors.name}
              </p>
            )}

          </div>


          {/* =================================================
              PHONE
          ================================================= */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />

            {errors.phone && (
              <p className="field-error">
                {errors.phone}
              </p>
            )}

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House number, street, area"
              rows="3"
            />

            {errors.address && (
              <p className="field-error">
                {errors.address}
              </p>
            )}

          </div>


          {/* =================================================
              CITY + STATE
          ================================================= */}

          <div className="form-row">


            {/* CITY */}

            <div className="form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />

              {errors.city && (
                <p className="field-error">
                  {errors.city}
                </p>
              )}

            </div>


            {/* STATE */}

            <div className="form-group">

              <label>
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />

              {errors.state && (
                <p className="field-error">
                  {errors.state}
                </p>
              )}

            </div>

          </div>


          {/* =================================================
              PINCODE
          ================================================= */}

          <div className="form-group">

            <label>
              Pincode
            </label>

            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="Enter 6-digit pincode"
              maxLength="6"
              inputMode="numeric"
            />

            {errors.pincode && (
              <p className="field-error">
                {errors.pincode}
              </p>
            )}

          </div>


          {/* =================================================
              PAYMENT METHOD
          ================================================= */}

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


          {/* =================================================
              PLACE ORDER
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Place Order"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default Checkout;
