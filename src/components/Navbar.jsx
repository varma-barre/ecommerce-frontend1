import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";


function Navbar() {
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const profileMenuRef = useRef(null);

    // Close profile dropdown when clicking outside or pressing Escape.
    useEffect(() => {
        const handlePointerDown = (event) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setIsProfileMenuOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Close mobile navigation.
    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Toggle mobile navigation.
    const toggleMenu = () => {
        setIsMobileMenuOpen((open) => !open);
    };

    // Logout and return to Home.
    const handleLogout = () => {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);

        logout();

        navigate("/home", { replace: true });
    };

    const getLinkClass = ({ isActive }) =>
        `navbar-link ${isActive ? "active" : ""}`;

    const getBottomLinkClass = ({ isActive }) =>
        `mobile-bottom-link ${isActive ? "active" : ""}`;

    return (
        <>
            {/* ================= TOP NAVBAR ================= */}
            <nav className="navbar">
                {/* BRAND */}
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

                {/* NAVIGATION LINKS */}
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

                    {/* GUEST LINKS */}
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

                    {/* AUTHENTICATED USER LINKS */}
                    {isLoggedIn && (
                        <>
                            {/* CUSTOMER PRODUCTS AND CART */}
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

                           
                            {/* ADMIN DASHBOARD */}
                            {user?.role === "admin" && (
                                <NavLink
                                    to="/admin/dashboard"
                                    className={getLinkClass}
                                    onClick={closeMenu}
                                >
                                    Dashboard
                                </NavLink>
                            )}

                            {/* ================= PROFILE DROPDOWN ================= */}
                            <div
                                className="navbar-profile"
                                ref={profileMenuRef}
                            >
                                {/* PROFILE TRIGGER */}
                                <button
                                    type="button"
                                    className={`navbar-account ${
                                        isProfileMenuOpen ? "is-open" : ""
                                    }`}
                                    onClick={() =>
                                        setIsProfileMenuOpen((open) => !open)
                                    }
                                    aria-haspopup="menu"
                                    aria-expanded={isProfileMenuOpen}
                                    aria-label="Open account menu"
                                >
                                    <span className="navbar-account-avatar">
                                        {user?.email
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                    </span>

                                    <span className="navbar-account-details">
                                        <span className="navbar-account-email">
                                            {user?.email || "My Account"}
                                        </span>

                                        <span className="navbar-account-role">
                                            {user?.role === "admin"
                                                ? "Administrator"
                                                : user?.name || "Customer"}
                                        </span>
                                    </span>

                                    <svg
                                        className="navbar-account-chevron"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="m7 10 5 5 5-5" />
                                    </svg>
                                </button>

                                {/* DROPDOWN CONTENT */}
                                {isProfileMenuOpen && (
                                    <div
                                        className="navbar-profile-dropdown"
                                        role="menu"
                                        aria-label="Account menu"
                                    >
                                        {/* ACCOUNT INFORMATION */}
                                        <div className="navbar-dropdown-heading">
                                            <span className="navbar-dropdown-eyebrow">
                                                SIGNED IN AS
                                            </span>

                                            <span className="navbar-dropdown-email">
                                                {user?.email || "User"}
                                            </span>

                                            <span className="navbar-dropdown-role">
                                                {user?.role === "admin"
                                                    ? "Administrator"
                                                    : user?.name || "Customer"}
                                            </span>
                                        </div>

                                        <div className="navbar-dropdown-divider" />

                                        {/* MY PROFILE */}
                                        <Link
                                            to="/profile"
                                            className="navbar-dropdown-item"
                                            role="menuitem"
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                closeMenu();
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="8"
                                                    r="4"
                                                />
                                                <path d="M4 21a8 8 0 0 1 16 0" />
                                            </svg>

                                            <span>My Profile</span>
                                        </Link>

                                        {/* MY ORDERS */}
                                        {user?.role !== "admin" && (
                                            <Link
                                                to="/orders"
                                                className="navbar-dropdown-item"
                                                role="menuitem"
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    closeMenu();
                                                }}
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M6 3h9l4 4v14H6z" />
                                                    <path d="M14 3v5h5" />
                                                    <path d="M9 13h7M9 17h7" />
                                                </svg>

                                                <span>My Orders</span>
                                            </Link>
                                        )}

                                        <div className="navbar-dropdown-divider" />

                                        {/* LOGOUT */}
                                        <button
                                            type="button"
                                            className="navbar-dropdown-logout"
                                            role="menuitem"
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

                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </nav>

            {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
            <nav
                className="mobile-bottom-nav"
                aria-label="Mobile navigation"
            >
                {/* HOME */}
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

                {/* SHOP */}
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

                {/* CART */}
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

                {/* ORDERS */}
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

                {/* ACCOUNT / MOBILE MENU */}
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