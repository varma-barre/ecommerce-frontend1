import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


function Navbar() {
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen((open) => !open);
    };

    const handleLogout = () => {
        closeMenu();
        logout();
        navigate("/home", { replace: true });
    };

    const getLinkClass = ({ isActive }) =>
        `navbar-link ${isActive ? "active" : ""}`;

    const getBottomLinkClass = ({ isActive }) =>
        `mobile-bottom-link ${isActive ? "active" : ""}`;

    return (
        <>
            {/* TOP NAVBAR */}
            <nav className="navbar">
                <Link
                    to="/home"
                    className="navbar-brand"
                    onClick={closeMenu}
                >
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

                {/* MOBILE HAMBURGER */}
                <button
                    type="button"
                    className="navbar-menu-toggle"
                    onClick={toggleMenu}
                    aria-label={
                        isMobileMenuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="products-hub-navigation"
                >
                    {isMobileMenuOpen ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M4 6h16" />
                            <path d="M4 12h16" />
                            <path d="M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* DESKTOP LINKS / MOBILE DROPDOWN */}
                <div
                    id="products-hub-navigation"
                    className={`navbar-links ${
                        isMobileMenuOpen ? "mobile-open" : ""
                    }`}
                >
                    <NavLink
                        to="/home"
                        className={getLinkClass}
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    {!isLoggedIn && (
                        <>
                            <NavLink
                                to="/login"
                                className={getLinkClass}
                                onClick={closeMenu}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={getLinkClass}
                                onClick={closeMenu}
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
                                        className={getLinkClass}
                                        onClick={closeMenu}
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
                                        onClick={closeMenu}
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
                                    className={getLinkClass}
                                    onClick={closeMenu}
                                >
                                    My Orders
                                </NavLink>
                            )}

                            {user?.role === "admin" && (
                                <NavLink
                                    to="/admin/dashboard"
                                    className={getLinkClass}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>
                            )}

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

            {/* MOBILE FIXED BOTTOM NAVIGATION */}
            <nav
                className="mobile-bottom-nav"
                aria-label="Mobile navigation"
            >
                <NavLink
                    to="/home"
                    className={getBottomLinkClass}
                    onClick={closeMenu}
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m3 10 9-7 9 7" />
                        <path d="M5 9v12h14V9" />
                        <path d="M9 21v-7h6v7" />
                    </svg>
                    <span>Home</span>
                </NavLink>

                {user?.role !== "admin" && (
                    <NavLink
                        to="/products"
                        className={getBottomLinkClass}
                        onClick={closeMenu}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="10.5" cy="10.5" r="6.5" />
                            <path d="m16 16 5 5" />
                        </svg>
                        <span>Shop</span>
                    </NavLink>
                )}

                {isLoggedIn && user?.role === "user" && (
                    <NavLink
                        to="/cart"
                        className={getBottomLinkClass}
                        onClick={closeMenu}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 8H6" />
                            <circle cx="10" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                        </svg>
                        <span>Cart</span>

                        {cartCount > 0 && (
                            <span className="mobile-bottom-badge">
                                {cartCount}
                            </span>
                        )}
                    </NavLink>
                )}

                {isLoggedIn && user?.role !== "admin" && (
                    <NavLink
                        to="/orders"
                        className={getBottomLinkClass}
                        onClick={closeMenu}
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 3h9l4 4v14H6z" />
                            <path d="M14 3v5h5" />
                            <path d="M9 13h7M9 17h7" />
                        </svg>
                        <span>Orders</span>
                    </NavLink>
                )}

                <button
                    type="button"
                    className={`mobile-bottom-link ${
                        isMobileMenuOpen ? "active" : ""
                    }`}
                    onClick={toggleMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="products-hub-navigation"
                >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                    <span>Account</span>
                </button>
            </nav>
        </>
    );
}

export default Navbar;