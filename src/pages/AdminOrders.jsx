import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config/api";

function AdminOrders() {
    const { token } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [searchParams, setSearchParams] =
        useSearchParams();

    const validStatuses = [
        "all",
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ];

    const urlStatus = searchParams.get("status");

    const [statusFilter, setStatusFilter] = useState(
        validStatuses.includes(urlStatus)
            ? urlStatus
            : "all"
    );

    // =====================================================
    // FETCH ALL CUSTOMER ORDERS
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

            console.log(
                "Admin orders response:",
                data
            );

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
            console.error(
                "Admin orders error:",
                err
            );

            setError(
                err.message ||
                "Unable to load customer orders"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ORDERS
    // =====================================================

    useEffect(() => {
        if (token) {
            fetchOrders();
        } else {
            setLoading(false);

            setError(
                "Authentication token not found. Please login again."
            );
        }
    }, [token]);

    // =====================================================
    // SYNC STATUS FILTER WITH URL
    // =====================================================

    useEffect(() => {
        const status = searchParams.get("status");

        if (validStatuses.includes(status)) {
            setStatusFilter(status);
        } else {
            setStatusFilter("all");

            if (status) {
                setSearchParams({});
            }
        }
    }, [
        searchParams,
        setSearchParams
    ]);

    // =====================================================
    // ORDER STATUS
    // =====================================================

    const getOrderStatus = (order) => {
        return String(
            order.status ||
            order.orderStatus ||
            "pending"
        ).toLowerCase();
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        const normalizedStatus =
            String(
                status || "pending"
            ).toLowerCase();

        if (
            normalizedStatus === "confirmed" ||
            normalizedStatus === "processing"
        ) {
            return "compact-status-confirmed";
        }

        if (
            normalizedStatus === "shipped"
        ) {
            return "compact-status-shipped";
        }

        if (
            normalizedStatus === "delivered"
        ) {
            return "compact-status-delivered";
        }

        if (
            normalizedStatus === "cancelled" ||
            normalizedStatus === "canceled"
        ) {
            return "compact-status-cancelled";
        }

        return "compact-status-pending";
    };

    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon = (status) => {
        const normalizedStatus =
            String(
                status || "pending"
            ).toLowerCase();

        if (
            normalizedStatus === "delivered"
        ) {
            return "✓";
        }

        if (
            normalizedStatus === "shipped"
        ) {
            return "↗";
        }

        if (
            normalizedStatus === "cancelled" ||
            normalizedStatus === "canceled"
        ) {
            return "×";
        }

        if (
            normalizedStatus === "confirmed" ||
            normalizedStatus === "processing"
        ) {
            return "●";
        }

        return "◷";
    };

    // =====================================================
    // FORMAT STATUS
    // =====================================================

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

    // =====================================================
    // CUSTOMER
    // =====================================================

    const getCustomerName = (order) => {
        return (
            order.user?.name ||
            order.customerName ||
            order.name ||
            "Customer"
        );
    };

    const getCustomerEmail = (order) => {
        return (
            order.user?.email ||
            order.email ||
            "No email available"
        );
    };

    const getCustomerPhone = (order) => {
        return (
            order.user?.phone ||
            order.phone ||
            "Not available"
        );
    };

    // =====================================================
    // ORDER TOTAL
    // =====================================================

    const getOrderTotal = (order) => {
        return Number(
            order.totalAmount ??
            order.total ??
            order.amount ??
            0
        );
    };

    // =====================================================
    // ITEM COUNT
    // =====================================================

    const getItemCount = (order) => {
        if (Array.isArray(order.items)) {
            return order.items.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity || 1
                    ),
                0
            );
        }

        return Number(
            order.numberOfItems ??
            order.itemCount ??
            0
        );
    };

    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
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

    // =====================================================
    // FILTER ORDERS
    // =====================================================

    const filteredOrders = useMemo(() => {
        const searchText =
            search.toLowerCase().trim();

        return orders.filter((order) => {
            const orderId =
                String(
                    order._id || ""
                ).toLowerCase();

            const customerName =
                String(
                    order.user?.name ||
                    order.customerName ||
                    order.name ||
                    ""
                ).toLowerCase();

            const customerEmail =
                String(
                    order.user?.email ||
                    order.email ||
                    ""
                ).toLowerCase();

            const customerPhone =
                String(
                    order.user?.phone ||
                    order.phone ||
                    ""
                ).toLowerCase();

            const matchesSearch =
                !searchText ||
                orderId.includes(
                    searchText
                ) ||
                customerName.includes(
                    searchText
                ) ||
                customerEmail.includes(
                    searchText
                ) ||
                customerPhone.includes(
                    searchText
                );

            const currentStatus =
                getOrderStatus(order);

            let matchesStatus = true;

            if (
                statusFilter === "confirmed"
            ) {
                matchesStatus =
                    currentStatus ===
                        "confirmed" ||
                    currentStatus ===
                        "processing";
            } else if (
                statusFilter !== "all"
            ) {
                matchesStatus =
                    currentStatus ===
                    statusFilter;
            }

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        orders,
        search,
        statusFilter
    ]);

    // =====================================================
    // SUMMARY COUNTS
    // =====================================================

    const pendingCount =
        orders.filter(
            (order) =>
                getOrderStatus(order) ===
                "pending"
        ).length;

    const confirmedCount =
        orders.filter(
            (order) =>
                getOrderStatus(order) ===
                    "confirmed" ||
                getOrderStatus(order) ===
                    "processing"
        ).length;

    const shippedCount =
        orders.filter(
            (order) =>
                getOrderStatus(order) ===
                "shipped"
        ).length;

    const deliveredCount =
        orders.filter(
            (order) =>
                getOrderStatus(order) ===
                "delivered"
        ).length;

    // =====================================================
    // STATUS FILTER + URL
    // =====================================================

    const handleStatusFilter = (status) => {
        setStatusFilter(status);

        if (status === "all") {
            setSearchParams({});
        } else {
            setSearchParams({
                status: status
            });
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="admin-orders-page">
                <div className="admin-orders-loading">
                    <div className="loading-spinner"></div>

                    <h2>
                        Loading customer orders
                    </h2>

                    <p>
                        Please wait while we fetch the latest orders.
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
            <div className="admin-orders-page">
                <div className="admin-orders-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load orders
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={fetchOrders}
                        className="retry-button"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="admin-orders-page compact-admin-orders">

            {/* HEADER */}

            <section className="admin-orders-header">

                <div>

                    <span className="admin-page-eyebrow">
                        SALES MANAGEMENT
                    </span>

                    <h1>
                        Customer Orders
                    </h1>

                    <p>
                        Review, track and manage all customer orders.
                    </p>

                </div>

                <div className="orders-header-count">

                    <strong>
                        {orders.length}
                    </strong>

                    <span>
                        Total Orders
                    </span>

                </div>

            </section>

            {/* SUMMARY CARDS */}

            <section className="compact-order-summary">

                {/* TOTAL */}

                <button
                    type="button"
                    className={`compact-summary-card total ${
                        statusFilter === "all"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleStatusFilter("all")
                    }
                >

                    <div className="compact-summary-icon">
                        #
                    </div>

                    <div className="compact-summary-content">

                        <span>
                            TOTAL ORDERS
                        </span>

                        <strong>
                            {orders.length}
                        </strong>

                    </div>

                </button>

                {/* PENDING */}

                <button
                    type="button"
                    className={`compact-summary-card pending ${
                        statusFilter === "pending"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleStatusFilter("pending")
                    }
                >

                    <div className="compact-summary-icon">
                        ◷
                    </div>

                    <div className="compact-summary-content">

                        <span>
                            PENDING
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>

                    </div>

                </button>

                {/* CONFIRMED */}

                <button
                    type="button"
                    className={`compact-summary-card confirmed ${
                        statusFilter === "confirmed"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleStatusFilter("confirmed")
                    }
                >

                    <div className="compact-summary-icon">
                        ✓
                    </div>

                    <div className="compact-summary-content">

                        <span>
                            CONFIRMED
                        </span>

                        <strong>
                            {confirmedCount}
                        </strong>

                    </div>

                </button>

                {/* SHIPPED */}

                <button
                    type="button"
                    className={`compact-summary-card shipped ${
                        statusFilter === "shipped"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleStatusFilter("shipped")
                    }
                >

                    <div className="compact-summary-icon">
                        ↗
                    </div>

                    <div className="compact-summary-content">

                        <span>
                            SHIPPED
                        </span>

                        <strong>
                            {shippedCount}
                        </strong>

                    </div>

                </button>

                {/* DELIVERED */}

                <button
                    type="button"
                    className={`compact-summary-card delivered ${
                        statusFilter === "delivered"
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        handleStatusFilter("delivered")
                    }
                >

                    <div className="compact-summary-icon">
                        ✓
                    </div>

                    <div className="compact-summary-content">

                        <span>
                            DELIVERED
                        </span>

                        <strong>
                            {deliveredCount}
                        </strong>

                    </div>

                </button>

            </section>

            {/* SEARCH + STATUS */}

            <section className="compact-orders-toolbar">

                <div className="compact-orders-search">

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
                        placeholder="Search by order ID, customer, email or phone..."
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() =>
                                setSearch("")
                            }
                            className="compact-search-clear"
                        >
                            ×
                        </button>
                    )}

                </div>

                <div className="compact-status-filter">

                    <label>
                        Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            handleStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Orders
                        </option>

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

                </div>

            </section>

            {/* RESULTS HEADER */}

            <div className="compact-orders-results">

                <div>

                    Showing{" "}

                    <strong>
                        {filteredOrders.length}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {orders.length}
                    </strong>

                    {" "}orders

                </div>

                {statusFilter !== "all" && (
                    <button
                        type="button"
                        onClick={() =>
                            handleStatusFilter("all")
                        }
                    >
                        Clear status
                    </button>
                )}

            </div>

            {/* ORDER LIST */}

            {filteredOrders.length === 0 ? (

                <div className="compact-orders-empty">

                    <div className="compact-empty-icon">
                        #
                    </div>

                    <h2>
                        No orders found
                    </h2>

                    <p>
                        Try changing your search or status filter.
                    </p>

                </div>

            ) : (

                <section className="compact-orders-table">

                    {/* TABLE HEADER */}

                    <div className="compact-table-header">

                        <span>
                            ORDER ID
                        </span>

                        <span>
                            STATUS
                        </span>

                        <span>
                            CUSTOMER
                        </span>

                        <span>
                            PHONE
                        </span>

                        <span>
                            ORDER DATE
                        </span>

                        <span>
                            ITEMS
                        </span>

                        <span>
                            TOTAL AMOUNT
                        </span>

                        <span>
                            ACTION
                        </span>

                    </div>

                    {/* TABLE ROWS */}

                    {filteredOrders.map(
                        (order) => {

                            const status =
                                getOrderStatus(
                                    order
                                );

                            return (
                                <div
                                    key={order._id}
                                    className="compact-table-row"
                                >

                                    {/* ORDER ID */}

                                    <div className="compact-order-id">

                                        <div className="compact-order-icon">

                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >

                                                <path d="M6 3h12v18H6z" />

                                                <path d="M9 8h6" />

                                                <path d="M9 12h6" />

                                                <path d="M9 16h4" />

                                            </svg>

                                        </div>

                                        <strong>
                                            #
                                            {String(
                                                order._id || ""
                                            ).slice(-10)}
                                        </strong>

                                    </div>

                                    {/* STATUS */}

                                    <div>

                                        <span
                                            className={`compact-status-badge ${getStatusClass(
                                                status
                                            )}`}
                                        >

                                            <span>
                                                {getStatusIcon(
                                                    status
                                                )}
                                            </span>

                                            {formatStatus(
                                                status
                                            )}

                                        </span>

                                    </div>

                                    {/* CUSTOMER */}

                                    <div className="compact-customer">

                                        <strong>
                                            {getCustomerName(
                                                order
                                            )}
                                        </strong>

                                        <span>
                                            {getCustomerEmail(
                                                order
                                            )}
                                        </span>

                                    </div>

                                    {/* PHONE */}

                                    <div className="compact-phone">
                                        {getCustomerPhone(
                                            order
                                        )}
                                    </div>

                                    {/* DATE */}

                                    <div className="compact-date">

                                        {formatDate(
                                            order.createdAt ||
                                            order.orderDate ||
                                            order.date
                                        )}

                                    </div>

                                    {/* ITEMS */}

                                    <div className="compact-items">

                                        {getItemCount(
                                            order
                                        )}

                                    </div>

                                    {/* TOTAL */}

                                    <div className="compact-total">

                                        ₹
                                        {getOrderTotal(
                                            order
                                        ).toLocaleString(
                                            "en-IN"
                                        )}

                                    </div>

                                    {/* VIEW DETAILS */}

                                    <div>

                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="compact-view-button"
                                        >

                                            View Details

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
                            );
                        }
                    )}

                </section>
            )}

        </div>
    );
}

export default AdminOrders;