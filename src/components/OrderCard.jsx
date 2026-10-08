import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderStatus from "./OrderStatus";
import { API_URL } from "../config/api";

function OrderCard({ order }) {
  const { token } = useAuth();

  const [currentStatus, setCurrentStatus] = useState(
    order.orderStatus
  );

  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CANCEL ORDER
  // ==========================================

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setCancelMessage("");

      const response = await fetch(
        `${API_URL}/api/orders/${order._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel order"
        );
      }

      // Update the status immediately
      setCurrentStatus("cancelled");

      setCancelMessage(
        "Order cancelled successfully."
      );
    } catch (error) {
      console.error("Cancel order error:", error);

      setError(
        error.message ||
          "Something went wrong while cancelling the order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // ==========================================
  // CAN CUSTOMER CANCEL THIS ORDER?
  // ==========================================

  const canCancel =
    currentStatus === "pending" ||
    currentStatus === "confirmed";

  return (
    <div className="order-card">
      <h2>
        Order id: {order._id.slice()}
      </h2>

      <p>
        <strong>Order Date:</strong>{" "}
        {new Date(
          order.createdAt
        ).toLocaleDateString()}
      </p>

      <p>
        <strong>Number of Items:</strong>{" "}
        {order.items.length}
      </p>

      <p>
        <strong>Order Total:</strong>{" "}
        ₹{order.totalAmount}
      </p>

      <div className="order-status-container">
        <strong>Order Status:</strong>

        <OrderStatus
          status={currentStatus}
        />
      </div>

      {/* Success message */}
      {cancelMessage && (
        <p className="cancel-success-message">
          {cancelMessage}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="cancel-error-message">
          {error}
        </p>
      )}

      <div className="order-card-actions">

        
        {/* View details button */}
        <Link
          to={`/orders/${order._id}`}
          className="view-order-button"
        >
          View Details
        </Link>

        {/* Cancel button */}
        {canCancel && (
          <button
            type="button"
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="cancel-order-button"
          >
            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}


      </div>
    </div>
  );
}

export default OrderCard;