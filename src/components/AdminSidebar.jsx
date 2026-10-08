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


    /* =========================================
       SIDEBAR STATE
    ========================================= */

    const [expanded, setExpanded] =
        useState(false);


    /* =========================================
       CURRENT USER
       
       We don't use Context here because
       your current project does not have
       ../context/Context.
    ========================================= */

    const storedUser =
        localStorage.getItem("currentUser");

    let currentUser = null;

    try {

        currentUser = storedUser
            ? JSON.parse(storedUser)
            : null;

    } catch {

        currentUser = null;

    }


    /* =========================================
       AUTO EXPAND FOR ADMIN SUB-PAGES
    ========================================= */

    const isAdminSubPage =
        location.pathname.startsWith(
            "/admin/products"
        ) ||
        location.pathname.startsWith(
            "/admin/categories"
        ) ||
        location.pathname.startsWith(
            "/admin/orders"
        );


    /* =========================================
       DASHBOARD CLICK
    ========================================= */

    const handleDashboard = () => {

        setExpanded(true);

        navigate("/admin/dashboard");
    };


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () => {

    logout();

    navigate("/home", {
        replace: true
    });
};


    /* =========================================
       USER INITIAL
    ========================================= */

    const initial =
        currentUser?.email
            ?.charAt(0)
            ?.toUpperCase() || "A";


    return (

        <aside
            className={`
                admin-sidebar
                ${
                    expanded || isAdminSubPage
                        ? "admin-sidebar-expanded"
                        : ""
                }
            `}
        >


            {/* =================================
                LOGO
            ================================= */}

            <div className="admin-sidebar-logo">

                <div className="admin-logo-icon">
                    🛍
                </div>


                <div className="admin-logo-text">

                    <strong>
                        ProductsHub
                    </strong>

                    <span>
                        Admin Panel
                    </span>

                </div>

            </div>


            {/* =================================
                NAVIGATION
            ================================= */}

            <div className="admin-sidebar-nav">


                {/* =============================
                    DASHBOARD
                ============================= */}

                <button
                    type="button"
                    className={`
                        admin-sidebar-dashboard
                        ${
                            location.pathname ===
                                "/admin" ||
                            location.pathname ===
                                "/admin/dashboard"
                                ? "active"
                                : ""
                        }
                    `}
                    onClick={handleDashboard}
                >

                    <span className="admin-sidebar-icon">
                        ⌂
                    </span>


                    <span className="admin-sidebar-text">
                        Dashboard
                    </span>

                </button>


                {/* =============================
                    OTHER MENU ITEMS
                ============================= */}

                <div
                    className={`
                        admin-sidebar-menu
                        ${
                            expanded ||
                            isAdminSubPage
                                ? "admin-menu-visible"
                                : ""
                        }
                    `}
                >


                    {/* PRODUCTS */}

                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                    >

                        <span className="admin-sidebar-icon">
                            ◆
                        </span>


                        <span className="admin-sidebar-text">
                            Products
                        </span>

                    </NavLink>


                    {/* CATEGORIES */}

                    <NavLink
                        to="/admin/categories"
                        className={({ isActive }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                    >

                        <span className="admin-sidebar-icon">
                            ▦
                        </span>


                        <span className="admin-sidebar-text">
                            Categories
                        </span>

                    </NavLink>


                    {/* ORDERS */}

                    <NavLink
                        to="/admin/orders"
                        className={({ isActive }) =>
                            isActive
                                ? "active"
                                : ""
                        }
                    >

                        <span className="admin-sidebar-icon">
                            🛒
                        </span>


                        <span className="admin-sidebar-text">
                            Orders
                        </span>

                    </NavLink>

                </div>

            </div>


            {/* =================================
                BOTTOM SECTION
            ================================= */}

            <div className="admin-sidebar-bottom">


                {/* USER */}

                <div className="admin-sidebar-user">

                    <div className="admin-user-avatar">
                        {initial}
                    </div>


                    <div className="admin-user-info">

                        <strong>
                            Admin
                        </strong>


                        <span>
                            {
                                currentUser?.email ||
                                "admin@gmail.com"
                            }
                        </span>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="admin-sidebar-logout"
                    onClick={handleLogout}
                >

                    <span className="admin-sidebar-icon">
                        ↪
                    </span>


                    <span className="admin-sidebar-text">
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}


export default AdminSidebar;