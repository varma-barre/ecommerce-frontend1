import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OrderStatus from "../components/OrderStatus";
import { API_URL } from "../config/api";

function AdminOrderDetails() {

    const { id } = useParams();

    const { token } = useAuth();


    const [order, setOrder] = useState(null);

    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);

    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // GET ADMIN ORDER
    // ==========================================

    const fetchOrder = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/orders/admin/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch order"
                );
            }


            setOrder(data.order);

            setStatus(
                data.order.orderStatus
            );

        } catch (error) {

            console.error(
                "Fetch admin order error:",
                error
            );

            setError(
                error.message ||
                "Failed to load order"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ORDER
    // ==========================================

    useEffect(() => {

        if (token && id) {
            fetchOrder();
        }

    }, [token, id]);


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    const handleStatusUpdate = async () => {

        setError("");
        setSuccess("");


        if (!status) {

            setError(
                "Please select an order status"
            );

            return;
        }


        try {

            setUpdating(true);


            const response = await fetch(
                `${API_URL}/api/orders/${id}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        orderStatus: status
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update order status"
                );
            }


            // Immediately update UI
            setOrder(data.order);

            setStatus(
                data.order.orderStatus
            );


            setSuccess(
                data.message ||
                "Order status updated successfully"
            );


        } catch (error) {

            console.error(
                "Update order status error:",
                error
            );

            setError(
                error.message ||
                "Failed to update order status"
            );

        } finally {

            setUpdating(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="admin-order-details">

                <h1>
                    Admin Order Details
                </h1>

                <p>
                    Loading order details...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !order) {

        return (
            <div className="admin-order-details">

                <h1>
                    Admin Order Details
                </h1>

                <p className="error-message">
                    {error}
                </p>

                <Link to="/admin/orders">
                    Back to Orders
                </Link>

            </div>
        );
    }


    if (!order) {
        return null;
    }


    // ==========================================
    // DISPLAY ORDER
    // ==========================================

    return (
        <div className="admin-order-details">

            <Link to="/admin/orders">
                ← Back to Orders
            </Link>


            <h1>
                Order Details
            </h1>


            {/* ORDER INFORMATION */}

            <div className="order-info">

                <h2>
                    Order #{order._id}
                </h2>


                <p>
                    <strong>
                        Order Date:
                    </strong>{" "}

                    {new Date(
                        order.createdAt
                    ).toLocaleString()}
                </p>


                <p>
                    <strong>
                        Customer:
                    </strong>{" "}

                    {order.user?.name}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>{" "}

                    {order.user?.email}
                </p>


                <p>
                    <strong>
                        Phone:
                    </strong>{" "}

                    {order.user?.phone}
                </p>


                <p>
                    <strong>
                        Shipping Address:
                    </strong>{" "}

                    {order.shippingAddress}
                </p>


                <p>
                    <strong>
                        Payment Method:
                    </strong>{" "}

                    {order.paymentMethod}
                </p>

            </div>


            {/* CURRENT STATUS */}

            <div className="order-status-section">

                <h2>
                    Current Status
                </h2>

                <OrderStatus
                    status={order.orderStatus}
                />

            </div>


            {/* UPDATE STATUS */}

            <div className="update-status-section">

                <h2>
                    Update Order Status
                </h2>


                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                    disabled={
                        updating ||
                        order.orderStatus === "delivered" ||
                        order.orderStatus === "cancelled"
                    }
                >

                    <option value="pending">
                        Pending
                    </option>

                    <option value="confirmed">
                        Confirmed
                    </option>

                    <option value="shipped">
                        Shipped
                    </option>

                    <option value="delivered">
                        Delivered
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                </select>


                <button
                    onClick={handleStatusUpdate}
                    disabled={
                        updating ||
                        order.orderStatus === "delivered" ||
                        order.orderStatus === "cancelled"
                    }
                >

                    {updating
                        ? "Updating..."
                        : "Update Status"}

                </button>

            </div>


            {error && (

                <p className="error-message">
                    {error}
                </p>

            )}


            {success && (

                <p className="success-message">
                    {success}
                </p>

            )}


            {/* ORDER ITEMS */}

            <div className="admin-order-items">

                <h2>
                    Ordered Products
                </h2>


               {order.items.map((item, index) => (
                  <div
                      key={item._id || item.product?._id || index}
                      className="admin-order-item"
                      >
                     <div className="ordered-product-image">
                           <img
                               src={item.product?.image}
                               alt={item.product?.name || "Product"}
                               onError={(e) => {
                                e.currentTarget.style.display = "none";
                             }}
                            />
                      </div>

                         <div className="ordered-product-info">
                                <h3>
                                   {item.product?.name || "Product unavailable"}
                                </h3>

                                <p>
                                   Quantity: {item.quantity}
                                </p>

                                <p>
                                    Price: ₹{item.price}
                                </p>

                                <p>
                                    Item Total: ₹
                                    {item.price * item.quantity}
                                </p>
                         </div>
                   </div>
             ))}

            </div>


            {/* TOTAL */}

            <div className="admin-order-total">

                <h2>
                    Total Amount:
                    ₹{order.totalAmount}
                </h2>

            </div>

        </div>
    );
}

export default AdminOrderDetails;