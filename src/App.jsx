import { useState } from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";


/* =========================================
   COMPONENTS
========================================= */

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";


/* =========================================
   CUSTOMER PAGES
========================================= */

import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

import Register from "./pages/Register";
import Login from "./pages/Login";

import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";


/* =========================================
   ADMIN PAGES
========================================= */

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";

import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";

import Profile from "./pages/Profile";


/* =========================================
   CSS
========================================= */

import "./App.css";


/* =========================================
   APP CONTENT
========================================= */

function AppContent() {

    const [cartItems, setCartItems] = useState([]);

    const location = useLocation();


    /* =====================================
       ADMIN PAGE CHECK
    ===================================== */

    const isAdminPage =
        location.pathname.startsWith("/admin");


    /* =====================================
       ADD TO CART
    ===================================== */

    const addToCart = (
        product,
        quantity = 1
    ) => {

        setCartItems((currentItems) => {

            const existingItem =
                currentItems.find(
                    (item) =>
                        item.id === product.id
                );


            /* -----------------------------
               PRODUCT ALREADY IN CART
            ----------------------------- */

            if (existingItem) {

                return currentItems.map(
                    (item) =>
                        item.id === product.id
                            ? {
                                  ...item,
                                  quantity:
                                      item.quantity +
                                      quantity
                              }
                            : item
                );
            }


            /* -----------------------------
               NEW PRODUCT
            ----------------------------- */

            return [
                ...currentItems,
                {
                    ...product,
                    quantity
                }
            ];
        });
    };


    /* =====================================
       UPDATE CART QUANTITY
    ===================================== */

    const updateQuantity = (
        productId,
        quantity
    ) => {

        if (quantity < 1) {
            return;
        }


        setCartItems((currentItems) => {

            return currentItems.map(
                (item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity
                          }
                        : item
            );
        });
    };


    /* =====================================
       REMOVE FROM CART
    ===================================== */

    const removeFromCart = (
        productId
    ) => {

        setCartItems((currentItems) =>
            currentItems.filter(
                (item) =>
                    item.id !== productId
            )
        );
    };


    /* =====================================
       CLEAR CART
    ===================================== */

    const clearCart = () => {

        setCartItems([]);
    };


    /* =====================================
       CART COUNT
    ===================================== */

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );


    /* =====================================
       RENDER
    ===================================== */

    return (
        <>

            {/* =================================
                NORMAL CUSTOMER NAVBAR

                Hidden on admin pages
            ================================= */}

            {!isAdminPage && (
                <Navbar
                    cartCount={cartCount}
                />
            )}


            {/* =================================
                ROUTES
            ================================= */}

            <Routes>


                {/* =================================
                    CUSTOMER HOME
                ================================= */}

                <Route
                    path="/"
                    element={
                         <Home />
                       
                    }
                />


                {/* =================================
                    CUSTOMER PRODUCTS
                ================================= */}

                <Route
                    path="/products"
                    element={
                        <Products
                            onAddToCart={
                                addToCart
                            }
                        />
                    }
                />


                {/* =================================
                    PRODUCT DETAILS
                ================================= */}

                <Route
                    path="/products/:id"
                    element={
                        <ProductDetails
                            onAddToCart={
                                addToCart
                            }
                        />
                    }
                />


                {/* =================================
                    REGISTER
                ================================= */}

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* =================================
                    LOGIN
                ================================= */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                {/* =================================
                     CUSTOMER HOME
                ================================= */}

                  <Route
                      path="/home"
                      element={
                          <Home />
                      }
                   />


                {/* =================================
                    CART
                ================================= */}

                <Route
                    path="/cart"
                    element={

                        <ProtectedRoute>

                            <Cart
                                cartItems={
                                    cartItems
                                }

                                updateQuantity={
                                    updateQuantity
                                }

                                removeFromCart={
                                    removeFromCart
                                }

                                clearCart={
                                    clearCart
                                }
                            />

                        </ProtectedRoute>
                    }
                />


                {/* =================================
                    CHECKOUT
                ================================= */}

                <Route
                    path="/checkout"
                    element={
                        <Checkout />
                    }
                />

                <Route
    path="/profile"
    element={
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    }
/>


                {/* =================================
                    ORDER CONFIRMATION
                ================================= */}

                <Route
                    path="/order-confirmation/:orderId"
                    element={
                        <OrderConfirmation />
                    }
                />


                {/* =================================
                    CUSTOMER ORDERS
                ================================= */}

                <Route
                    path="/orders"
                    element={
                        <Orders />
                    }
                />


                {/* =================================
                    CUSTOMER ORDER DETAILS
                ================================= */}

                <Route
                    path="/orders/:id"
                    element={
                        <OrderDetails />
                    }
                />


                {/* =================================================
                    ADMIN DASHBOARD

                    Main URL:
                    /admin/dashboard

                    Also keeps:
                    /admin
                ================================================= */}

                <Route
                    path="/admin"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminDashboard />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin/dashboard"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminDashboard />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                {/* =================================
                    ADMIN PRODUCTS
                ================================= */}

                <Route
                    path="/admin/products"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminProducts />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                {/* =================================
                    ADMIN CATEGORIES
                ================================= */}

                <Route
                    path="/admin/categories"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminCategories />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                {/* =================================
                    ADMIN ORDERS
                ================================= */}

                <Route
                    path="/admin/orders"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminOrders />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


                {/* =================================
                    ADMIN ORDER DETAILS
                ================================= */}

                <Route
                    path="/admin/orders/:id"
                    element={

                        <AdminRoute>

                            <AdminLayout>

                                <AdminOrderDetails />

                            </AdminLayout>

                        </AdminRoute>
                    }
                />


            </Routes>

        </>
    );
}


/* =========================================
   MAIN APP
========================================= */

function App() {

    return (

        <BrowserRouter>

            <AppContent />

        </BrowserRouter>
    );
}


/* =========================================
   EXPORT
========================================= */

export default App;