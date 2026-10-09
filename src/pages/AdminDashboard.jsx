import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function AdminDashboard() {
    const { user, token } = useAuth();

    const adminName =
        user?.name ||
        user?.email?.split("@")[0] ||
        "Admin";

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");

    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/api/orders/admin`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch customer orders"
                );
            }

            const orderList = Array.isArray(data)
                ? data
                : data.orders ||
                  data.Orders ||
                  [];

            setOrders(orderList);
        } catch (err) {
            console.error("Admin dashboard orders error:", err);

            setError(
                err.message ||
                "Unable to load customer orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [token]);

    // =====================================================
    // ORDER HELPERS
    // =====================================================

    const getOrderStatus = (order) => {
        return String(
            order.status ||
            order.orderStatus ||
            "pending"
        ).toLowerCase();
    };

    const getCustomerName = (order) => {
        return (
            order.user?.name ||
            order.customerName ||
            order.name ||
            "Customer"
        );
    };

    const getCustomerPhone = (order) => {
        return (
            order.user?.phone ||
            order.phone ||
            "Not available"
        );
    };

    const getOrderTotal = (order) => {
        return Number(
            order.totalAmount ??
            order.total ??
            order.amount ??
            0
        );
    };

    const getItemCount = (order) => {
        if (Array.isArray(order.items)) {
            return order.items.reduce(
                (total, item) =>
                    total +
                    Number(item.quantity || 1),
                0
            );
        }

        return Number(
            order.numberOfItems ??
            order.itemCount ??
            0
        );
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Pending";
        }

        const value = String(status);

        return (
            value.charAt(0).toUpperCase() +
            value.slice(1).toLowerCase()
        );
    };

    const getStatusClass = (status) => {
        const value = String(
            status || "pending"
        ).toLowerCase();

        if (
            value === "confirmed" ||
            value === "processing"
        ) {
            return "dashboard-status-confirmed";
        }

        if (value === "shipped") {
            return "dashboard-status-shipped";
        }

        if (value === "delivered") {
            return "dashboard-status-delivered";
        }

        if (
            value === "cancelled" ||
            value === "canceled"
        ) {
            return "dashboard-status-cancelled";
        }

        return "dashboard-status-pending";
    };

    // =====================================================
    // SUMMARY COUNTS
    // =====================================================

    const pendingCount = orders.filter(
        (order) =>
            getOrderStatus(order) === "pending"
    ).length;

    const confirmedCount = orders.filter(
        (order) =>
            [
                "confirmed",
                "processing"
            ].includes(
                getOrderStatus(order)
            )
    ).length;

    const shippedCount = orders.filter(
        (order) =>
            getOrderStatus(order) === "shipped"
    ).length;

    const deliveredCount = orders.filter(
        (order) =>
            getOrderStatus(order) === "delivered"
    ).length;

    // =====================================================
    // FILTER ORDERS
    // =====================================================

    const filteredOrders = useMemo(() => {
        const searchText =
            search.toLowerCase().trim();

        return orders.filter((order) => {
            const status =
                getOrderStatus(order);

            const orderId =
                String(order._id || "")
                    .toLowerCase();

            const customer =
                String(
                    getCustomerName(order)
                ).toLowerCase();

            const phone =
                String(
                    getCustomerPhone(order)
                ).toLowerCase();

            const matchesSearch =
                !searchText ||
                orderId.includes(searchText) ||
                customer.includes(searchText) ||
                phone.includes(searchText);

            let matchesStatus = true;

            if (activeFilter === "confirmed") {
                matchesStatus =
                    status === "confirmed" ||
                    status === "processing";
            } else if (
                activeFilter !== "all"
            ) {
                matchesStatus =
                    status === activeFilter;
            }

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        orders,
        search,
        activeFilter
    ]);

    // =====================================================
    // FILTER CARD
    // =====================================================

    const handleFilter = (filter) => {
        setActiveFilter(filter);
    };

    // =====================================================
    // DASHBOARD
    // =====================================================

    return (
        <div className="admin-dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="admin-dashboard-header">

                <div className="admin-header-content">

                    <div>

                        <span className="admin-eyebrow">
                            ADMIN CONTROL CENTER
                        </span>

                        <h1>
                            Welcome back,{" "}
                            <span>{adminName.toUpperCase().charAt(0) + adminName.toLowerCase().slice(1)}</span>
                        </h1>

                       
                    </div>

                   
                </div>

            </section>


            {/* =================================================
                DASHBOARD CONTENT
            ================================================= */}

            <div className="admin-dashboard-layout">

                


                {/* =================================================
                    MAIN ORDER DASHBOARD
                ================================================= */}

                <main className="admin-dashboard-main">

                    <div className="dashboard-section-heading">

                        <div>
                            <span>
                                SALES MANAGEMENT
                            </span>

                            <h2>
                                Order Overview
                            </h2>
                        </div>

                        <Link
                            to="/admin/orders"
                            className="dashboard-view-all"
                        >
                            View All Orders →
                        </Link>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <section className="dashboard-order-summary">

                        <button
                            type="button"
                            className={`dashboard-order-card total ${
                                activeFilter === "all"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleFilter("all")
                            }
                        >
                            <span className="dashboard-order-icon">
                                #
                            </span>

                            <span className="dashboard-order-content">
                                <small>
                                    TOTAL ORDERS
                                </small>

                                <strong>
                                    {orders.length}
                                </strong>
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`dashboard-order-card pending ${
                                activeFilter === "pending"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleFilter("pending")
                            }
                        >
                            <span className="dashboard-order-icon">
                                ◷
                            </span>

                            <span className="dashboard-order-content">
                                <small>
                                    PENDING
                                </small>

                                <strong>
                                    {pendingCount}
                                </strong>
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`dashboard-order-card confirmed ${
                                activeFilter === "confirmed"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleFilter("confirmed")
                            }
                        >
                            <span className="dashboard-order-icon">
                                ✓
                            </span>

                            <span className="dashboard-order-content">
                                <small>
                                    CONFIRMED
                                </small>

                                <strong>
                                    {confirmedCount}
                                </strong>
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`dashboard-order-card shipped ${
                                activeFilter === "shipped"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleFilter("shipped")
                            }
                        >
                            <span className="dashboard-order-icon">
                                ↗
                            </span>

                            <span className="dashboard-order-content">
                                <small>
                                    SHIPPED
                                </small>

                                <strong>
                                    {shippedCount}
                                </strong>
                            </span>
                        </button>


                        <button
                            type="button"
                            className={`dashboard-order-card delivered ${
                                activeFilter === "delivered"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleFilter("delivered")
                            }
                        >
                            <span className="dashboard-order-icon">
                                ✓
                            </span>

                            <span className="dashboard-order-content">
                                <small>
                                    DELIVERED
                                </small>

                                <strong>
                                    {deliveredCount}
                                </strong>
                            </span>
                        </button>

                    </section>


                    {/* =================================================
                        SEARCH
                    ================================================= */}

                    <div className="dashboard-orders-toolbar">

                        <div className="dashboard-search">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                />

                                <path d="m20 20-4-4" />
                            </svg>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search order ID, customer or phone..."
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        <div className="dashboard-active-filter">

                            Showing{" "}

                            <strong>
                                {filteredOrders.length}
                            </strong>

                            {" "}orders

                        </div>

                    </div>


                    {/* =================================================
                        CUSTOMER ORDERS LIST
                    ================================================= */}

                    <section className="dashboard-orders-section">

                        <div className="dashboard-orders-heading">

                            <div>
                                <span>
                                    CUSTOMER ORDERS
                                </span>

                                <h3>
                                    {activeFilter === "all"
                                        ? "All Orders"
                                        : `${formatStatus(
                                              activeFilter
                                          )} Orders`}
                                </h3>
                            </div>

                            <span className="dashboard-order-count">
                                {filteredOrders.length}
                            </span>

                        </div>


                        {loading ? (

                            <div className="dashboard-orders-state">
                                <div className="dashboard-spinner"></div>

                                <strong>
                                    Loading orders...
                                </strong>

                                <span>
                                    Fetching the latest customer orders.
                                </span>
                            </div>

                        ) : error ? (

                            <div className="dashboard-orders-state error">

                                <strong>
                                    Unable to load orders
                                </strong>

                                <span>
                                    {error}
                                </span>

                                <button
                                    type="button"
                                    onClick={fetchOrders}
                                >
                                    Try Again
                                </button>

                            </div>

                        ) : filteredOrders.length === 0 ? (

                            <div className="dashboard-orders-state">

                                <strong>
                                    No orders found
                                </strong>

                                <span>
                                    Try another search or status.
                                </span>

                            </div>

                        ) : (

                            <div className="dashboard-order-table">

                                <div className="dashboard-table-header">

                                    <span>ORDER ID</span>
                                    <span>STATUS</span>
                                    <span>CUSTOMER</span>
                                    <span>PHONE</span>
                                    <span>ORDER DATE</span>
                                    <span>ITEMS</span>
                                    <span>TOTAL</span>
                                    <span>ACTION</span>

                                </div>


                                {filteredOrders.map(
                                    (order) => {

                                        const status =
                                            getOrderStatus(
                                                order
                                            );

                                        return (
                                            <div
                                                className="dashboard-table-row"
                                                key={order._id}
                                            >

                                                <div className="dashboard-order-id">

                                                    <span className="mini-order-icon">
                                                        #
                                                    </span>

                                                    <strong>
                                                        #
                                                        {String(
                                                            order._id ||
                                                            ""
                                                        ).slice(-10)}
                                                    </strong>

                                                </div>


                                                <div>

                                                    <span
                                                        className={`dashboard-status ${getStatusClass(
                                                            status
                                                        )}`}
                                                    >
                                                        <span>
                                                            {status ===
                                                            "delivered"
                                                                ? "✓"
                                                                : status ===
                                                                  "shipped"
                                                                ? "↗"
                                                                : status ===
                                                                  "confirmed" ||
                                                                  status ===
                                                                      "processing"
                                                                ? "●"
                                                                : "◷"}
                                                        </span>

                                                        {formatStatus(
                                                            status
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="dashboard-customer">

                                                    <strong>
                                                        {getCustomerName(
                                                            order
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {order.user?.email ||
                                                            order.email ||
                                                            "No email"}
                                                    </span>

                                                </div>


                                                <div className="dashboard-phone">

                                                    {getCustomerPhone(
                                                        order
                                                    )}

                                                </div>


                                                <div className="dashboard-date">

                                                    {formatDate(
                                                        order.createdAt ||
                                                            order.orderDate ||
                                                            order.date
                                                    )}

                                                </div>


                                                <div className="dashboard-items">

                                                    {getItemCount(
                                                        order
                                                    )}

                                                </div>


                                                <div className="dashboard-total">

                                                    ₹
                                                    {getOrderTotal(
                                                        order
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </div>


                                                <div>

                                                    <Link
                                                        to={`/admin/orders/${order._id}`}
                                                        className="dashboard-details-button"
                                                    >
                                                        View Details
                                                    </Link>

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        BOTTOM QUICK ACTIONS
                    ================================================= */}

                    <section className="dashboard-bottom-actions">

                        <Link
                            to="/admin/products"
                            className="dashboard-bottom-action"
                        >
                            <span>＋</span>

                            <div>
                                <strong>
                                    Add Product
                                </strong>

                                <small>
                                    Manage your catalog
                                </small>
                            </div>
                        </Link>


                        <Link
                            to="/admin/categories"
                            className="dashboard-bottom-action"
                        >
                            <span>▦</span>

                            <div>
                                <strong>
                                    Manage Categories
                                </strong>

                                <small>
                                    Organize your products
                                </small>
                            </div>
                        </Link>


                        <Link
                            to="/admin/orders"
                            className="dashboard-bottom-action"
                        >
                            <span>☰</span>

                            <div>
                                <strong>
                                    Full Order Management
                                </strong>

                                <small>
                                    Open complete orders page
                                </small>
                            </div>
                        </Link>

                    </section>

                </main>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <section className="admin-dashboard-footer">

                <div className="admin-footer-icon">
                    ✓
                </div>

                <div>
                    <strong>
                        MyStore Admin Panel
                    </strong>

                    <span>
                        Manage your store securely from one place.
                    </span>
                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;