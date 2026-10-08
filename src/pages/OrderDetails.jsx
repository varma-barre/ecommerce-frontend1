import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function OrderDetails() {

  const { id } = useParams();

  const { token } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // FETCH ORDER DETAILS
  // =====================================================

  const fetchOrderDetails = async () => {

    try {

      setLoading(true);

      setError("");

      const response = await fetch(
        `${API_URL}/api/orders/${id}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const data = await response.json();

      console.log(
        "Order details response:",
        data
      );

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to fetch order details"
        );

      }

      setOrder(
        data.order || data
      );

    } catch (err) {

      console.error(
        "Order details error:",
        err
      );

      setError(
        err.message ||
        "Unable to load order details"
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {

    if (token && id) {

      fetchOrderDetails();

    }

  }, [token, id]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }
    );

  };


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {

    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;

  };


  // =====================================================
  // STATUS
  // =====================================================

  const getStatus = () => {

    return String(
      order?.orderStatus ||
      order?.status ||
      "pending"
    ).toLowerCase();

  };


  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = () => {

    const status =
      getStatus();

    switch (status) {

      case "confirmed":
        return "details-status-confirmed";

      case "processing":
        return "details-status-processing";

      case "shipped":
        return "details-status-shipped";

      case "delivered":
        return "details-status-delivered";

      case "cancelled":
      case "canceled":
        return "details-status-cancelled";

      default:
        return "details-status-pending";

    }

  };


  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = () => {

    const status =
      getStatus();

    switch (status) {

      case "confirmed":
        return "✓";

      case "processing":
        return "◷";

      case "shipped":
        return "↗";

      case "delivered":
        return "✓";

      case "cancelled":
      case "canceled":
        return "×";

      default:
        return "◷";

    }

  };


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (item) => {

    const product =
      item?.product || {};

    return (
      product.image ||
      product.imageUrl ||
      product.productImage ||
      item.image ||
      item.imageUrl ||
      item.productImage ||
      null
    );

  };


  // =====================================================
  // PRODUCT NAME
  // =====================================================

  const getProductName = (item) => {

    return (
      item?.product?.name ||
      item?.productName ||
      item?.name ||
      "Product"
    );

  };


  // =====================================================
  // PRODUCT PRICE
  // =====================================================

  const getProductPrice = (item) => {

    return Number(
      item?.price ??
      item?.product?.price ??
      0
    );

  };


  // =====================================================
  // PRODUCT QUANTITY
  // =====================================================

  const getProductQuantity = (item) => {

    return Number(
      item?.quantity || 1
    );

  };


  // =====================================================
  // ITEM TOTAL
  // =====================================================

  const getItemTotal = (item) => {

    const quantity =
      getProductQuantity(item);

    const price =
      getProductPrice(item);

    return (
      quantity * price
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="order-details-page">

        <div className="order-details-loading">

          <div className="order-details-spinner"></div>

          <h2>
            Loading order details
          </h2>

          <p>
            Please wait while we retrieve your order.
          </p>

        </div>

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

      <div className="order-details-page">

        <div className="order-details-error">

          <div className="order-error-icon">
            !
          </div>

          <h2>
            Unable to load order
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrderDetails}
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  // =====================================================
  // ORDER NOT FOUND
  // =====================================================

  if (!order) {

    return (

      <div className="order-details-page">

        <div className="order-details-error">

          <div className="order-error-icon">
            !
          </div>

          <h2>
            Order not found
          </h2>

          <p>
            We couldn't find the requested order.
          </p>

          <Link to="/orders">
            Back to My Orders
          </Link>

        </div>

      </div>

    );

  }


  // =====================================================
  // ORDER VALUES
  // =====================================================

  const status =
    getStatus();

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  const totalAmount =
    Number(
      order.totalAmount || 0
    );


  const totalItems =
    items.reduce(
      (total, item) =>
        total +
        getProductQuantity(item),
      0
    );


  // =====================================================
  // RETURN
  // =====================================================

  return (

    <div className="order-details-page">


      {/* =================================================
          BACK
      ================================================= */}

      <div className="order-details-container">

        <Link
          to="/orders"
          className="order-back-link"
        >

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >

            <path d="M19 12H5" />

            <path d="m12 19-7-7 7-7" />

          </svg>

          Back to My Orders

        </Link>


        {/* =================================================
            ORDER HEADER
        ================================================= */}

        <section className="order-details-header">

          <div className="order-details-header-left">

            <span className="order-details-eyebrow">
              ORDER DETAILS
            </span>

            <h1>
              Order Details
            </h1>

            <div className="order-meta">

              <div>

                <span>
                  Order ID
                </span>

                <strong>
                  #{order._id}
                </strong>

              </div>


              <div>

                <span>
                  Order Date
                </span>

                <strong>
                  {formatDate(
                    order.createdAt ||
                    order.orderDate
                  )}
                </strong>

              </div>

            </div>

          </div>


          <div
            className={`order-details-status ${getStatusClass()}`}
          >

            <span>
              {getStatusIcon()}
            </span>

            {status.charAt(0).toUpperCase() +
              status.slice(1)}

          </div>

        </section>


        {/* =================================================
            ORDER PROGRESS
        ================================================= */}

        <section className="order-progress-card">

          <div className="order-progress-title">

            <div>

              <span>
                ORDER STATUS
              </span>

              <h2>
                Track your order
              </h2>

            </div>

            <strong>
              {status.charAt(0).toUpperCase() +
                status.slice(1)}
            </strong>

          </div>


          <div className="details-progress">

            <div
              className={
                status === "pending"
                  ? "details-progress-step active"
                  : "details-progress-step completed"
              }
            >

              <div className="details-progress-dot">
                {status === "pending"
                  ? "1"
                  : "✓"
                }
              </div>

              <span>
                Confirmed
              </span>

            </div>


            <div
              className={
                [
                  "processing",
                  "shipped",
                  "delivered"
                ].includes(status)
                  ? "details-progress-step completed"
                  : "details-progress-step"
              }
            >

              <div className="details-progress-dot">

                {[
                  "processing",
                  "shipped",
                  "delivered"
                ].includes(status)
                  ? "✓"
                  : "2"
                }

              </div>

              <span>
                Shipped
              </span>

            </div>


            <div
              className={
                status === "delivered"
                  ? "details-progress-step completed"
                  : "details-progress-step"
              }
            >

              <div className="details-progress-dot">

                {status === "delivered"
                  ? "✓"
                  : "3"
                }

              </div>

              <span>
                Delivered
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            DELIVERY INFORMATION
        ================================================= */}

        <section className="order-information-card">

          <div className="order-section-heading">

            <div className="order-section-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >

                <path d="M3 6h11v12H3z" />

                <path d="M14 10h4l3 3v5h-7z" />

                <circle
                  cx="7"
                  cy="19"
                  r="2"
                />

                <circle
                  cx="18"
                  cy="19"
                  r="2"
                />

              </svg>

            </div>

            <div>

              <span>
                DELIVERY
              </span>

              <h2>
                Delivery Information
              </h2>

            </div>

          </div>


          <div className="order-information-grid">


            <div className="order-information-item">

              <span>
                SHIPPING ADDRESS
              </span>

              <strong>
                {order.shippingAddress ||
                  order.address ||
                  "N/A"}
              </strong>

            </div>


            <div className="order-information-item">

              <span>
                PAYMENT METHOD
              </span>

              <strong>
                {order.paymentMethod ||
                  "N/A"}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            ORDERED PRODUCTS
        ================================================= */}

        <section className="ordered-products-card">


          <div className="order-section-heading">

            <div className="order-section-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >

                <path d="M6 8h12l1 13H5L6 8z" />

                <path d="M9 8V6a3 3 0 0 1 6 0v2" />

              </svg>

            </div>

            <div>

              <span>
                ORDER SUMMARY
              </span>

              <h2>
                Ordered Products
              </h2>

            </div>

          </div>


          <div className="ordered-products-list">


            {items.length === 0 ? (

              <div className="no-order-items">
                No products found in this order.
              </div>

            ) : (

              items.map(
                (item, index) => {

                  const image =
                    getProductImage(item);

                  const productName =
                    getProductName(item);

                  const quantity =
                    getProductQuantity(item);

                  const price =
                    getProductPrice(item);

                  const itemTotal =
                    getItemTotal(item);


                  return (

                    <div
                      className="ordered-product"
                      key={
                        item._id ||
                        item.product?._id ||
                        index
                      }
                    >


                      {/* PRODUCT IMAGE */}

                      <div className="ordered-product-image">

                        {image ? (

                          <img
                            src={image}
                            alt={productName}
                            onError={(e) => {

                              e.currentTarget.style.display =
                                "none";

                              e.currentTarget
                                .nextElementSibling
                                ?.classList.add(
                                  "show-product-fallback"
                                );

                            }}
                          />

                        ) : null}


                        <div
                          className={
                            image
                              ? "product-image-fallback"
                              : "product-image-fallback show-product-fallback"
                          }
                        >

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                          >

                            <path d="M6 8h12l1 13H5L6 8z" />

                            <path d="M9 8V6a3 3 0 0 1 6 0v2" />

                          </svg>

                        </div>

                      </div>


                      {/* PRODUCT DETAILS */}

                      <div className="ordered-product-details">

                        <span className="ordered-product-label">
                          PRODUCT
                        </span>

                        <h3>
                          {productName}
                        </h3>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {quantity}
                          </strong>
                        </p>

                      </div>


                      {/* PRICE */}

                      <div className="ordered-product-price">

                        <span>
                          UNIT PRICE
                        </span>

                        <strong>
                          {formatCurrency(
                            price
                          )}
                        </strong>

                      </div>


                      {/* TOTAL */}

                      <div className="ordered-product-total">

                        <span>
                          ITEM TOTAL
                        </span>

                        <strong>
                          {formatCurrency(
                            itemTotal
                          )}
                        </strong>

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>


          {/* =================================================
              ORDER TOTAL
          ================================================= */}

          <div className="order-total-section">

            <div>

              <span>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>

              <p>
                Order total
              </p>

            </div>

            <strong>
              {formatCurrency(
                totalAmount
              )}
            </strong>

          </div>

        </section>


        {/* =================================================
            BOTTOM ACTIONS
        ================================================= */}

        <div className="order-details-actions">

          <Link
            to="/orders"
            className="order-secondary-button"
          >
            ← Back to My Orders
          </Link>


          <Link
            to="/products"
            className="order-primary-button"
          >
            Continue Shopping

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >

              <path d="M5 12h14" />

              <path d="m13 6 6 6-6 6" />

            </svg>

          </Link>

        </div>

      </div>

    </div>

  );
}

export default OrderDetails;