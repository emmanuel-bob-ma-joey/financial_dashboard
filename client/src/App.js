import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import {
  TooltipComponent,
  Tooltipcomponent,
} from "@syncfusion/ej2-react-popups";
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
  index,
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
import { AuthProvider } from "./contexts/authContextProvider"; // Ensure AuthProvider is imported

import "./App.css";

const App = () => {
  const { activeMenu } = useStateContext();

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
                  {/*homepage dashboard*/}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/overview" element={<Dashboard />} />
                  {/*pages */}
                  <Route path="/stocks/:stockSymbol" element={<StockList />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/watchlist" element={<WatchList />} />
                  {/*apps */}
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/color-picker" element={<ColorPicker />} />
                  {/*charts */}
                  <Route path="/line" element={<Line />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/financial" element={<Financial />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/area" element={<Area />} />
                  <Route path="/color-mapping" element={<ColorMapping />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<Dashboard />} />{" "}
                  {/* Add the dashboard route */}
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
