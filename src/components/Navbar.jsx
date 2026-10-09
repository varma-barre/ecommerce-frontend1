
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    return (
        <nav className="navbar">
            {/* Brand */}
            <Link to="/home" className="navbar-brand">
                <span className="navbar-brand-icon">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 8H6" />
                        <circle cx="10" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                    </svg>
                </span>

                <span className="navbar-brand-text">
                    Products<span>Hub</span>
                </span>
            </Link>

            {/* Navigation */}
            <div className="navbar-links">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `navbar-link ${isActive ? "active" : ""}`
                    }
                >
                    Home
                </NavLink>

                {!isLoggedIn && (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? "active" : ""}`
                            }
                        >
                            Login
                        </NavLink>

                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? "active" : ""}`
                            }
                        >
                            Register
                        </NavLink>
                    </>
                )}

                {isLoggedIn && (
                    <>
                        {user?.role === "user" && (
                            <>
                                <NavLink
                                    to="/products"
                                    className={({ isActive }) =>
                                        `navbar-link ${isActive ? "active" : ""}`
                                    }
                                >
                                    Products
                                </NavLink>

                                <NavLink
                                    to="/cart"
                                    className={({ isActive }) =>
                                        `navbar-link navbar-cart-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >
                                    Cart
                                    <span className="navbar-cart-count">
                                        {cartCount}
                                    </span>
                                </NavLink>
                            </>
                        )}

                        {user?.role !== "admin" && (
                            <NavLink
                                to="/orders"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                            >
                                My Orders
                            </NavLink>
                        )}

                        {user?.role === "admin" && (
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                            >
                                Dashboard
                            </NavLink>
                        )}

                        {/* Account information */}
                        <div className="navbar-account">
                            <span className="navbar-account-avatar">
                                {user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </span>

                            <div className="navbar-account-details">
                                <span className="navbar-account-email">
                                    {user?.email}
                                </span>

                                <span className="navbar-account-role">
                                    {user?.role === "admin"
                                        ? "Administrator"
                                        : "Customer account"}
                                </span>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            type="button"
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M10 17l5-5-5-5" />
                                <path d="M15 12H3" />
                                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                            </svg>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
