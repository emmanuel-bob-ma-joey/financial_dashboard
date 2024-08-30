import React, { useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { app } from "../firebase"; // Import the initialized app
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const analytics = getAnalytics(app);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        navigate("/dashboard");
      }
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
