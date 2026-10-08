import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {

  const {
    user,
    isLoggedIn,
    authLoading
  } = useAuth();


  // Wait until authentication is restored
  if (authLoading) {

    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h3>Checking authentication...</h3>
      </div>
    );
  }


  // Not logged in
  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Logged in but not admin
  if (user?.role !== "admin") {

    return (
      <div style={{ padding: "30px", textAlign: "center" }}>

        <h2>Access Denied</h2>

        <p>
          Only admin can access this page.
        </p>

      </div>
    );
  }


  // Admin
  return children;
}

export default AdminRoute;