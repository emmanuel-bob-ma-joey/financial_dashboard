import { React, useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import peanut from "../data/peanut.jpeg";
import { Notification, Userprofile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

const NavButton = ({ title, customFunction, icon, color, dotcolor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunction()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotcolor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setIsClicked,
    screenSize,
    setscreenSize,
  } = useStateContext();

  const [user, setUser] = useState(null);
  onAuthStateChanged(auth, (u) => {
    if (u) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setUser(u.displayName);
      // ...
    } else {
      // User is signed out
      setUser("");
    }
  });

  useEffect(() => {
    const handleResize = () => setscreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    screenSize <= 900 ? setActiveMenu(false) : setActiveMenu(true);
  }, [screenSize]);

  return (
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunction={() =>
          setActiveMenu((prevActiveMenu) => !prevActiveMenu)
        }
        color="blue"
        icon={<AiOutlineMenu />}
      ></NavButton>
      <div className="flex">
        {/* <NavButton
          title="cart"
          customFunction={() => handleClick("cart")}
          color="blue"
          icon={<FiShoppingCart />}
        ></NavButton> */}
        {/* <NavButton
          title="chat"
          customFunction={() => handleClick("chat")}
          dotcolor="#03C9D7"
          icon={<BsChatLeft />}
        ></NavButton> */}
        {/* <NavButton
          title="notification"
          customFunction={() => handleClick("notification")}
          color="blue"
          icon={<RiNotification3Line />}
        ></NavButton> */}
        <TooltipComponent content="profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={peanut}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.notification && <Notification />}
      </div>
    </div>
  );
};

export default Navbar;
