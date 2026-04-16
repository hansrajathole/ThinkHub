import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Navbar/Sidebar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from "axios";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const navigate = useNavigate();
  const [userQuestions, setUserQuestions] = useState([]);
  const baseUrl =  import.meta.env.VITE_BACKEND_URL
  
  

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${baseUrl}/api/questions/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          setUserQuestions(res.data.questions);
        })
        .catch((error) => {
          console.error("Failed to fetch questions:", error);
        });
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-950">
      <Navbar />
      <Sidebar />

      <div className={`min-h-full w-full pt-16 text-black transition-all duration-300 dark:text-gray-200 ${isOpen ? "md:pl-64" : ""}`}>
          {/* Hero Section */}
          <section className="bg-white dark:bg-gray-900 py-20 px-6 text-center shadow">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome to ThinkHub
            </h1>

            {user ? (
              <>
                <p className="mt-2 text-4xl text-blue-600 dark:text-blue-400 font-semibold">
                  {user.username}!
                </p>
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <p className="text-gray-700 dark:text-white font-semibold">Reputation</p>
                    <p className="text-xl text-blue-500 font-bold">{user.reputation || 0}</p>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <p className="text-gray-700 dark:text-white font-semibold">Badges</p>
                    <p className="text-xl text-yellow-400 font-bold">
                      🏅 {user.badges?.length || 0}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            )}

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Collaborate. Learn. Grow. A modern place for developers to share
              knowledge and build reputation.
            </p>
          </section>

          {/* Feature Cards */}
          <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "Ask Questions",
                desc: "Post technical queries and get expert answers.",
              },
              {
                title: "Join Rooms",
                desc: "Collaborate in real-time with global developers.",
              },
              {
                title: "Track Progress",
                desc: "See your growth through reputation and badges.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow rounded-lg p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {feature.desc}
                </p>
              </div>
            ))}
          </section>

          {/* User Questions */}
          {user && userQuestions.length > 0 && (
            <section className="px-6 pb-20 max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Your Questions
              </h2>

              {userQuestions.map((q) => (
                
                <Card key={q._id} className="bg-white dark:bg-gray-900 dark:text-white py-3 mb-4 shadow">
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3
                          className="text-xl font-bold hover:underline cursor-pointer text-blue-600 dark:text-blue-400"
                          onClick={() => navigate(`/question/${q._id}`)}
                        >
                          {q.title}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                          {q.body}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {q.tags?.map((tag, i) => (
                            <Badge key={i} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Votes: {q?.upVotes?.length - q?.downVote?.length}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Answers: {q.answers?.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}

          {/* Leaderboard Section */}
          {!user && (
            <section className="px-6 pb-20 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Top Contributors
              </h2>
              <ul className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
                {[
                  { name: "Alice Johnson", points: 3200 },
                  { name: "Bob Smith", points: 2900 },
                  { name: "Charlie Brown", points: 2750 },
                ].map((user, idx) => (
                  <li key={idx} className="p-4 flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-100">
                      {user.name}
                    </span>
                    <span className="text-blue-600 font-semibold">
                      {user.points} pts
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
      </div>
    </div>
  );
};

export default Home;
