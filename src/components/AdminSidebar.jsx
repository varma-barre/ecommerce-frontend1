
import { useState } from "react";
import {
    NavLink,
    useNavigate,
    useLocation
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Sidebar state
    const [expanded, setExpanded] = useState(false);

    // Load the saved display name, without changing the login email
    const [displayName, setDisplayName] = useState(
        () => localStorage.getItem("adminDisplayName") || "Admin"
    );

    // Name editing state
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(displayName);

    // Admin sub-pages
    const isAdminSubPage =
        location.pathname.startsWith("/admin/products") ||
        location.pathname.startsWith("/admin/categories") ||
        location.pathname.startsWith("/admin/orders");

    // Dashboard
    const handleDashboard = () => {
        setExpanded(true);
        navigate("/admin/dashboard");
    };

    // Open name editor
    const handleEditName = () => {
        setEditedName(displayName);
        setIsEditingName(true);
    };

    // Save the new display name
    const handleSaveName = () => {
        const trimmedName = editedName.trim();

        if (!trimmedName) {
            return;
        }

        localStorage.setItem("adminDisplayName", trimmedName);
        setDisplayName(trimmedName);
        setIsEditingName(false);
    };

    // Cancel editing
    const handleCancelName = () => {
        setEditedName(displayName);
        setIsEditingName(false);
    };

    // Keyboard shortcuts
    const handleNameKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSaveName();
        }

        if (event.key === "Escape") {
            handleCancelName();
        }
    };

    // Logout
    const handleLogout = () => {
        logout();

        navigate("/home", {
            replace: true
        });
    };

    // Avatar initial follows the display name
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <aside
            className={`admin-sidebar ${
                expanded || isAdminSubPage
                    ? "admin-sidebar-expanded"
                    : ""
            }`}
        >
            {/* Logo */}
            <div className="admin-sidebar-logo">
                <div className="admin-logo-icon">
                    🛍
                </div>

                <div className="admin-logo-text">
                    <strong>ProductsHub</strong>
                    <span>Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="admin-sidebar-nav">
                <button
                    type="button"
                    className={`admin-sidebar-dashboard ${
                        location.pathname === "/admin" ||
                        location.pathname === "/admin/dashboard"
                            ? "active"
                            : ""
                    }`}
                    onClick={handleDashboard}
                >
                    <span className="admin-sidebar-icon">⌂</span>
                    <span className="admin-sidebar-text">
                        Dashboard
                    </span>
                </button>

                <div
                    className={`admin-sidebar-menu ${
                        expanded || isAdminSubPage
                            ? "admin-menu-visible"
                            : ""
                    }`}
                >
                    <NavLink to="/admin/products">
                        <span className="admin-sidebar-icon">
                            ◆
                        </span>
                        <span className="admin-sidebar-text">
                            Products
                        </span>
                    </NavLink>

                    <NavLink to="/admin/categories">
                        <span className="admin-sidebar-icon">
                            ▦
                        </span>
                        <span className="admin-sidebar-text">
                            Categories
                        </span>
                    </NavLink>

                    <NavLink to="/admin/orders">
                        <span className="admin-sidebar-icon">
                            🛒
                        </span>
                        <span className="admin-sidebar-text">
                            Orders
                        </span>
                    </NavLink>
                </div>
            </div>

            {/* Bottom section */}
            <div className="admin-sidebar-bottom">
                <div className="admin-sidebar-user">
                    <div className="admin-user-avatar">
                        {initial}
                    </div>

                    <div className="admin-user-info">
                        {isEditingName ? (
                            <div className="admin-name-editor">
                                <input
                                    type="text"
                                    className="admin-user-name-input"
                                    value={editedName}
                                    onChange={(event) =>
                                        setEditedName(event.target.value)
                                    }
                                    onKeyDown={handleNameKeyDown}
                                    placeholder="Enter your name"
                                    aria-label="Edit display name"
                                    autoFocus
                                    maxLength={60}
                                />

                                <div className="admin-name-actions">
                                    <button
                                        type="button"
                                        onClick={handleSaveName}
                                        disabled={!editedName.trim()}
                                        className="admin-name-save"
                                    >
                                        Save
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancelName}
                                        className="admin-name-cancel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="admin-user-name"
                                onClick={handleEditName}
                                title="Click to edit your name"
                                aria-label="Edit your display name"
                            >
                                <strong>{displayName}</strong>
                                <span className="admin-name-edit-icon">
                                    ✎
                                </span>
                            </button>
                        )}

                        {/* Existing login email remains unchanged */}
                        <span className="admin-user-email">
                            {user?.email}
                        </span>
                    </div>
                </div>

                {/* Logout */}
                <button
                    type="button"
                    className="admin-sidebar-logout"
                    onClick={handleLogout}
                >
                    <span className="admin-sidebar-icon">↪</span>
                    <span className="admin-sidebar-text">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;
