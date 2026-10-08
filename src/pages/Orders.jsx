import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderCard from "../components/OrderCard";
import { API_URL } from "../config/api";

function Orders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/orders`,
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
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("Please login to view your orders.");
    }
  }, [token]);

  // Loading State
  if (loading) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="orders-page">
        <h1>My Orders</h1>

        <p className="error-message">
          {error}
        </p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">

      <h1>My Orders</h1>

      {/* Empty Orders State */}
      {orders.length === 0 ? (
        <div className="empty-orders">

          <p>
            You have not placed any orders yet.
          </p>

          <Link to="/products">
            Continue Shopping
          </Link>

        </div>
      ) : (
        <div className="orders-list">

          {/* Display all orders */}
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;

