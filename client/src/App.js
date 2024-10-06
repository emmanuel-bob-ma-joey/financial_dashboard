import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import {
  Navbar,
  Footer,
  Sidebar,
  ThemeSettings,
  StockCard,
} from "./components";
import {
  StockList,
  Dashboard,
  Calendar,
  ColorPicker,
  Portfolio,
  WatchList,
  Line,
  Area,
  Bar,
  Financial,
  ColorMapping,
  Pie,
  Signin,
  Signup,
  News,
} from "./pages";

import { useStateContext } from "./contexts/ContextProvider";
import { AuthProvider, useAuth } from "./contexts/authContextProvider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import "./App.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  return children;
};

const App = () => {
  const { activeMenu } = useStateContext();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              {/* <TooltipComponent content="Settings" position="Top">
                <button
                  type="button"
                  className="text-3xl p-3 hover:drop-shadow-xl hover: bg-light-gray text-white"
                  style={{ borderRadius: "50%", background: "blue" }}
                >
                  <FiSettings />
                </button>
              </TooltipComponent> */}
            </div>
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
                  : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
              }
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                <Navbar />
              </div>
              <div>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/overview"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/stocks/:stockSymbol"
                    element={
                      <ProtectedRoute>
                        <StockList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <ProtectedRoute>
                        <Portfolio />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/watchlist"
                    element={
                      <ProtectedRoute>
                        <WatchList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/calendar"
                    element={
                      <ProtectedRoute>
                        <Calendar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/color-picker"
                    element={
                      <ProtectedRoute>
                        <ColorPicker />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/line"
                    element={
                      <ProtectedRoute>
                        <Line />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pie"
                    element={
                      <ProtectedRoute>
                        <Pie />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/financial"
                    element={
                      <ProtectedRoute>
                        <Financial />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bar"
                    element={
                      <ProtectedRoute>
                        <Bar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/area"
                    element={
                      <ProtectedRoute>
                        <Area />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/color-mapping"
                    element={
                      <ProtectedRoute>
                        <ColorMapping />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/news"
                    element={
                      <ProtectedRoute>
                        <News />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>

              <Footer />
            </div>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
