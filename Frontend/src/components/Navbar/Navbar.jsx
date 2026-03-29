import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthUser } from "../../Redux/AuthSlice";
import icon from "../../assets/stackwaveicon.png";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import axios from "axios";
import toast from "react-hot-toast";

import Hamburger from "hamburger-react";
import { toggleSidebar } from "../../Redux/sidebarSlice";
import { disconnectSocket, setSocketAuthToken } from "../../socket/socket";
const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDarkMode, setDarkMode] = useState(false);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    const isDark = savedMode === "dark";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      if (token) {
        await axios.post(
          `${baseUrl}/api/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed on server");
    } finally {
      dispatch(setAuthUser(null));
      localStorage.removeItem("token");
      setSocketAuthToken(null);
      disconnectSocket();
      setDropdownOpen(false);
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen z-40">
      <div className="flex-1">
        <nav className="bg-white dark:bg-gray-900 text-black dark:text-white p-3 flex items-center justify-between fixed top-0 left-0 w-full z-50 shadow-md">
      
          {/* Left Section - Logo */}
          <div className="flex items-center space-x-2 text-center">
            <span className="">
              <Hamburger
                toggled={isOpen}
                toggle={() => dispatch(toggleSidebar())}
                size={20}
              />
            </span>
            <div className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
            >
              <img src={icon} alt="" className="w-10 h-10" />
              <h1 className="text-lg">
                Think<span className="text-orange-500 font-bold">Hub</span>
              </h1>
            </div>
           
          </div>

          {/* Search Bar */}
          <div className="flex-1 mx-4 max-w-lg max-sm:hidden">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-3 py-1 rounded-md outline-none border border-gray-300 dark:border-gray-700 focus:border-blue-500"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 relative">
           
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-white"
                >
                  <img
                    src={user.avatar}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white rounded-md shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2 justify-between">
                      <img
                        src={user.avatar}
                        alt="profile"
                        className="w-8 h-8 rounded-full  cursor-pointer"
                        onClick={() => navigate(`/profile/${user._id}`)}
                      />
                      <span className="block text-sm">{user.username}</span>
                    </div>
                    <div
                      className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      <span>View Profile</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-blue-600 px-3 py-1 rounded-md text-white text-sm hover:bg-blue-700"
                onClick={() => navigate("/login")}
              >
                Sign in
              </button>
            )}

            <div className="flex items-center">
              <DarkModeSwitch
                checked={isDarkMode}
                onChange={toggleDarkMode}
                size={30}
                className="ml-2"
              />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
