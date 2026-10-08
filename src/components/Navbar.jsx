import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {

  const { cartCount } = useCart();

  const {
    user,
    isLoggedIn,
    logout
  } = useAuth();

  const navigate = useNavigate();


  const handleLogout = () => {
    logout();

    // After logout, go directly to Home
    navigate("/home");
  };


  return (
    <nav className="navbar">

      <h2>ProductsHub</h2>

      <div className="navbar-links">

        <Link to="/home">
          Home
        </Link>


        {/* BEFORE LOGIN */}

        {!isLoggedIn && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}


        {/* AFTER LOGIN */}

        {isLoggedIn && (
          <>

            {/* PRODUCTS */}

            {user?.role === "user" && (
              <Link to="/products">
                Products
              </Link>
            )}


            {/* CART ONLY FOR USER */}

            {user?.role === "user" && (
              <Link to="/cart">
                Cart ({cartCount})
              </Link>
            )}


            {/* MY ORDERS */}

            {isLoggedIn && user?.role !== "admin" && (
              <Link to="/orders">
                My Orders
              </Link>
            )}


            {/* ADMIN DASHBOARD */}

            {user?.role === "admin" && (
              <Link to="/admin/dashboard">
                Dashboard
              </Link>
            )}


            {/* USER EMAIL */}

            <span className="main">
              {user?.email}
            </span>


            {/* USER ROLE */}

            <span className="main">
              {user?.role}
            </span>


            {/* LOGOUT */}

            <button onClick={handleLogout}>
              Logout
            </button>

          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;