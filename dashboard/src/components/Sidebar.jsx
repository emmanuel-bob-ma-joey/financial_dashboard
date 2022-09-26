import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FcComboChart } from "react-icons/fc";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "../contexts/ContextProvider";
import {
  FiShoppingBag,
  FiEdit,
  FiPieChart,
  FiBarChart,
  FiCreditCard,
  FiStar,
  FiShoppingCart,
  FiHome,
  FiCalendar,
} from "react-icons/fi";
import {
  AiOutlineStock,
  AiOutlineBarChart,
  AiOutlineUnorderedList,
} from "react-icons/ai";
//import links from dummydata
import { BsNewspaper } from "react-icons/bs";

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    activeMenu && screenSize <= 900
      ? setActiveMenu(false)
      : setActiveMenu(true);
  };

  const activeLink =
    "flex  item-center gap-5 pl-4 pt-3 pb-2.5 rouded-lg text-blue-700 text-md m-2 ";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";
  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSideBar}
              className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
            >
              <FcComboChart /> <span>FinanceDashboard</span>
            </Link>
            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>
          <div className="mt-10">
            <div key="Dashboard">
              <p className="text-gray-400 m-3 mt-4 uppercase">Dashboard</p>
              <NavLink
                to="/overview"
                key="overview"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiHome />
                <span className="capitalize">overview</span>
              </NavLink>
            </div>
            <div key="Pages">
              <p className="text-gray-400 m-3 mt-4 uppercase">Pages</p>
              <NavLink
                to="/stocks/search"
                key="stocks"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AiOutlineStock />
                <span className="capitalize">stocks</span>
              </NavLink>
              <NavLink
                to="/watchlist"
                key="watchlist"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AiOutlineUnorderedList />
                <span className="capitalize">watchlist</span>
              </NavLink>
              <NavLink
                to="/portfolio"
                key="portfolio"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <AiOutlineBarChart />
                <span className="capitalize">portfolio</span>
              </NavLink>
              <NavLink
                to="/news"
                key="news"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <BsNewspaper />
                <span className="capitalize">News</span>
              </NavLink>
            </div>
            <div key="Apps">
              {/* <p className="text-gray-400 m-3 mt-4 uppercase">Apps</p>
              <NavLink
                to="/calendar"
                key="calendar"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiCalendar />
                <span className="capitalize">calendar</span>
              </NavLink> */}
              {/* <NavLink
                to="/color-picker"
                key="color-picker"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiCalendar />
                <span className="capitalize">color-picker</span>
              </NavLink> */}
            </div>
            {/* <div key="Charts">
              <p className="text-gray-400 m-3 mt-4 uppercase">Charts</p>
              <NavLink
                to="/line"
                key="linechart"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiCalendar />
                <span className="capitalize">linechart</span>
              </NavLink>
              <NavLink
                to="/pie"
                key="piechart"
                onClick={() => {}}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiCalendar />
                <span className="capitalize">piechart</span>
              </NavLink>
              <NavLink
                to="/financial"
                key="financial"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
              >
                <FiCalendar />
                <span className="capitalize">financial</span>
              </NavLink>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
