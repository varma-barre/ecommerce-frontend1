import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);


  // ==========================================
  // RESTORE THE CURRENT SESSION
  // ==========================================

  useEffect(() => {

    const activeSession =
      localStorage.getItem("activeSession");


    console.log(
      "Active session from localStorage:",
      activeSession
    );


    // ==========================================
    // RESTORE USER
    // ==========================================

    if (activeSession === "user") {

      const userToken =
        localStorage.getItem("userToken");

      const userData =
        localStorage.getItem("userData");


      console.log(
        "Restoring USER token:",
        userToken
      );


      if (userToken && userData) {

        try {

          const parsedUser =
            JSON.parse(userData);


          // Extra safety check
          if (parsedUser.role !== "user") {

            console.error(
              "Stored user data is not a normal user."
            );

            localStorage.removeItem("activeSession");

          } else {

            setToken(userToken);
            setUser(parsedUser);

          }

        } catch (error) {

          console.error(
            "Failed to restore user session:",
            error
          );

          localStorage.removeItem("userToken");
          localStorage.removeItem("userData");
          localStorage.removeItem("activeSession");
        }
      }
    }


    // ==========================================
    // RESTORE ADMIN
    // ==========================================

    else if (activeSession === "admin") {

      const adminToken =
        localStorage.getItem("adminToken");

      const adminData =
        localStorage.getItem("adminData");


      console.log(
        "Restoring ADMIN token:",
        adminToken
      );


      if (adminToken && adminData) {

        try {

          const parsedAdmin =
            JSON.parse(adminData);


          // Extra safety check
          if (parsedAdmin.role !== "admin") {

            console.error(
              "Stored admin data is not an admin."
            );

            localStorage.removeItem("activeSession");

          } else {

            setToken(adminToken);
            setUser(parsedAdmin);

          }

        } catch (error) {

          console.error(
            "Failed to restore admin session:",
            error
          );

          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminData");
          localStorage.removeItem("activeSession");
        }
      }
    }


    setAuthLoading(false);

  }, []);


  // ==========================================
  // LOGIN
  // ==========================================

  const login = (userData, jwtToken) => {

    console.log(
      "LOGIN ROLE:",
      userData.role
    );

    console.log(
      "LOGIN TOKEN:",
      jwtToken
    );


    // ==========================================
    // USER LOGIN
    // ==========================================

    if (userData.role === "user") {

      setUser(userData);
      setToken(jwtToken);


      localStorage.setItem(
        "userToken",
        jwtToken
      );

      localStorage.setItem(
        "userData",
        JSON.stringify(userData)
      );


      // VERY IMPORTANT
      // Current session is USER
      localStorage.setItem(
        "activeSession",
        "user"
      );


      console.log(
        "USER TOKEN STORED:",
        jwtToken
      );

      console.log(
        "ACTIVE SESSION: user"
      );
    }


    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    else if (userData.role === "admin") {

      setUser(userData);
      setToken(jwtToken);


      localStorage.setItem(
        "adminToken",
        jwtToken
      );

      localStorage.setItem(
        "adminData",
        JSON.stringify(userData)
      );


      // VERY IMPORTANT
      // Current session is ADMIN
      localStorage.setItem(
        "activeSession",
        "admin"
      );


      console.log(
        "ADMIN TOKEN STORED:",
        jwtToken
      );

      console.log(
        "ACTIVE SESSION: admin"
      );
    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {


    // ==========================================
    // USER LOGOUT
    // ==========================================

    if (user?.role === "user") {

      console.log(
        "Logging out USER"
      );


      setUser(null);
      setToken(null);


      // Remove ONLY user authentication
      localStorage.removeItem(
        "userToken"
      );

      localStorage.removeItem(
        "userData"
      );


      // Remove current session indicator
      localStorage.removeItem(
        "activeSession"
      );


      console.log(
        "USER TOKEN REMOVED"
      );
    }


    // ==========================================
    // ADMIN LOGOUT
    // ==========================================

    else if (user?.role === "admin") {

      console.log(
        "Logging out ADMIN"
      );


      setUser(null);
      setToken(null);


      // Remove ONLY admin authentication
      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "adminData"
      );


      // Remove current session indicator
      localStorage.removeItem(
        "activeSession"
      );


      console.log(
        "ADMIN TOKEN REMOVED"
      );
    }

  };


  const isLoggedIn = !!token;


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        authLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {

  return useContext(AuthContext);
}