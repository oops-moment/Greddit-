import React, { useState, useEffect } from "react";
import "./DisplayUsers.css"
import { useNavigate } from "react-router-dom";


const DisplayUsers =() => {
  const subgredditname=localStorage.getItem("subg name");
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [nonBlockedUsers, setNonBlockedUsers] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const fetchApprovedUsers = async () => {
  

      try {
        const response = await fetch(
          `http://localhost:5001/approvedrequestsret?subgredditname=${subgredditname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const responseData = await response.json();
        // console.log("hi here is the fetch approved data result")
        // console.log(responseData);
        return responseData;
      } catch (error) {
        console.error("Error fetching approved users", error);
        return [];
      }
    };

    const fetchBlockedUsers = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/blockedusers?subgredditname=${subgredditname}&username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        console.error("Error fetching blocked users", error);
        return [];
      }
    };

    const fetchUsers = async () => {
      const approvedUsers = await fetchApprovedUsers();
   
      const blockedUsers = [];
      const nonBlockedUsers = [];

      for (const user of approvedUsers) {
       
        const blocked = await fetchBlockedUsers(user.username);
      
        if (blocked.length > 0) {
          blockedUsers.push(user);
        } else {
          nonBlockedUsers.push(user);
        }
      }

      setBlockedUsers(blockedUsers);
      setNonBlockedUsers(nonBlockedUsers);
    };

    fetchUsers();
  }, [subgredditname]);

  return (
    <div className="users-container">
      <div className="users-blocked">
        <h2>Blocked Users</h2>
        <ul>
          {blockedUsers.map((user) => (
            <li key={user._id}>{user.username}</li>
          ))}
        </ul>
      </div>
      <div className="users-nonblocked">
        <h2>Non-Blocked Users</h2>
        <ul>
          {nonBlockedUsers.map((user) => (
            <li key={user._id}>{user.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DisplayUsers;
