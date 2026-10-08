import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {

  const {
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


  // After checking localStorage
  // if user is not logged in
  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // User is logged in
  return children;
}

export default ProtectedRoute;