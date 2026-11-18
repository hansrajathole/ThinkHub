import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const Users = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = user?._id;

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const baseUrl =  import.meta.env.VITE_BACKEND_URL


    useEffect(() => {
      axios.get(`${baseUrl}/api/users/all`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          console.log("Users fetched:", "" + response.data);
          setUsers(response.data);
          console.log("Current users state:", users);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        } );
    }, [userId]);
  
    

      


  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );



  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6 text-gray-900 dark:text-white pt-10">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      <input
        type="text"
        placeholder="Filter by user"
        className="w-full p-2 mb-6 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center space-x-4 "
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{user.username}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.location}</p>
              <p className="text-sm font-bold">Reputation: {user.reputation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Users;
