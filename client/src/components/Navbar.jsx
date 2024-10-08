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
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

import { enableRipple } from "@syncfusion/ej2-base";
import { Dropdown, Avatar } from "rsuite";

import { useNavigate, useLocation } from "react-router-dom";

import { auth } from "../firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "rsuite/Dropdown/styles/index.css";
import "rsuite/Avatar/styles/index.css";

enableRipple(true);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u.displayName || u.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectToSignIn = () => {
    navigate("/signin");
  };

  const userSignOut = () => {
    console.log("signing out");
    signOut(auth);
  };

  const renderToggle = (props) => <Avatar circle {...props} src={peanut} />;

  const handleDeleteUser = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const user = auth.currentUser;
        console.log("deleting user", user);
        console.log("deleting user uid", user.uid);
        if (user) {
          // Delete user data from MongoDB
          await fetch(
            `https://dashboard-backend-three-psi.vercel.app/api/users?user=${user.uid}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // Delete user from Firebase Auth
          await user.delete();

          // Sign out and redirect to home page
          await auth.signOut();
          navigate("/");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

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
    <div
      className={`flex justify-between p-2 md:ml-6 relative ${
        activeMenu ? "md:ml-72" : ""
      }`}
    >
      <NavButton
        title="Menu"
        customFunction={() =>
          setActiveMenu((prevActiveMenu) => !prevActiveMenu)
        }
        color="blue"
        icon={<AiOutlineMenu />}
      />
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Signed in as {user}</span>
            <Dropdown renderToggle={renderToggle} placement="bottomEnd">
              <Dropdown.Item onSelect={userSignOut}>Sign out</Dropdown.Item>
              <Dropdown.Item onSelect={handleDeleteUser}>
                Delete Account
              </Dropdown.Item>
            </Dropdown>
          </div>
        ) : (
          <>
            <TooltipComponent content="Sign in" position="BottomCenter">
              <NavButton
                title="Sign in"
                customFunction={redirectToSignIn}
                color="black"
                icon={<FaSignInAlt />}
              />
            </TooltipComponent>
            <TooltipComponent content="Sign up" position="BottomCenter">
              <NavButton
                title="Sign up"
                customFunction={() => navigate("/signup")}
                color="black"
                icon={<FaUserPlus />}
              />
            </TooltipComponent>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
