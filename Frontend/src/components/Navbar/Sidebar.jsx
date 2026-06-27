import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "../../Redux/sidebarSlice";
import {
  Home,
  MessageSquare,
  Users,
  Layers,
  BookOpen,
  FolderKanban,
  Map,
  Trophy
} from "lucide-react";


const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/questions", icon: MessageSquare, label: "Questions" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/rooms", icon: Layers, label: "Room" },
  { to: "/Interview-Prep", icon: BookOpen, label: "Interview Prep" },
  { to: "/Road-Map-to-Tech", icon: Map, label: "Road Map to Tech" },
  { to: "/leaderboard", icon: Trophy, label: "LeaderBoard" },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const handleCloseSidebar = () => {
    dispatch(closeSidebar());
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    if (window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      dispatch(closeSidebar());
    }
  }, [dispatch, location.pathname]);

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        className={`fixed inset-0 z-30 bg-slate-950/25 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={handleCloseSidebar}
      />

      <aside
        className={`hide-scrollbar fixed left-0 top-0 z-40 h-dvh w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200/70 bg-white/95 px-4 pb-6 pt-20 text-black shadow-xl backdrop-blur-xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900/95 dark:text-white md:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleCloseSidebar}
              className="flex items-center space-x-2 rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600"
            >
              <span className="min-w-10 text-sm font-semibold text-gray-400 dark:text-gray-500">
               <Icon size={20} />
              </span>
              <span>{item.label}</span>
            </Link>
          )}
          )}
        </nav>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-black dark:text-white">COLLECTIVES</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Communities for your favorite technologies.
          </p>
          <Link
            to="#"
            onClick={handleCloseSidebar}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Explore all Collectives
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <h3 className="text-sm font-bold text-black dark:text-white">TEAMS</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Ask questions, find answers, and collaborate at work with Stack Overflow for Teams.
          </p>
          <button className="mt-2 rounded-md bg-orange-500 px-3 py-1 text-sm text-white hover:bg-orange-600">
            Try Teams for free
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
