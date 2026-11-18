import React from "react";
import { Route, Routes } from "react-router-dom";
import Protected from "../Protected/Protecte";
import Navbar from "../Navbar/Navbar";
import Users from "../../Views/Users/Users";
import Room from "../room/Room";
import Question from "../../Views/Question/Question";
import Sidebar from "../Navbar/Sidebar";
import AskQuestion from "../../Views/AskQuestion/AskQuestion";
import { useSelector } from "react-redux";
import SingleQuestion from "../../Views/Question/SingleQuestion";
import Leaderboard from "../leaderboard/Leaderboard";
import ComingSoon from "../../Views/ComingSoon/ComingSoon";

const MainLayout = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <Sidebar />
      <div className={`w-full px-0 pt-16 transition-all duration-300 ${isOpen ? "md:pl-64" : ""}`}>
          <Routes>
            <Route
              path="/questions"
              element={
                <Protected>
                  <Question />
                </Protected>
              }
            />
            <Route
              path="/question/:id"
              element={
                <Protected>
                  <SingleQuestion />
                </Protected>
              }
            />
            <Route
              path="/rooms"
              element={
                <Protected>
                  <Room />
                </Protected>
              }
            />
           
            <Route
              path="/users"
              element={
                <Protected>
                  <Users />
                </Protected>
              }
            />
            <Route
              path="/askquestion"
              element={
                <Protected>
                  <AskQuestion />
                </Protected>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <Protected>
                  <Leaderboard />
                </Protected>
              }
            />
            <Route
              path="/Interview-Prep"
              element={
                <ComingSoon
                  title="Interview Prep"
                  description="Practice plans, curated questions, and mock interview tools are being prepared for ThinkHub."
                />
              }
            />
            <Route
              path="/Road-Map-to-Tech"
              element={
                <ComingSoon
                  title="Road Map to Tech"
                  description="A guided path for building practical skills and planning your next move in technology is on its way."
                />
              }
            />
          </Routes>
      </div>
    </div>
  );
};

export default MainLayout;
