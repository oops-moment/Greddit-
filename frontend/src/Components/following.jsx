import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './followers.css';

const DisplayFollowing = () => {
  const [following, setFollowing] = useState([]);
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
    const username = localStorage.getItem("username");
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/followingret?followedby=${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const responseData = await response.json();
        setFollowing(responseData);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };
    fetchData();
  }, []);

  const unfollowUser = async (followingId) => {
    try {
      await fetch(`http://localhost:5000/following/${followingId}`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Request deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }

    const username = localStorage.getItem("username");
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/followingret?followedby=${username}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const responseData = await response.json();
        setFollowing(responseData);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };
    fetchData();
  };

  return (
    <div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {following.map((follow) => (
          <li key={follow._id}>
            <div
              style={{
                fontSize: "20px",
                backgroundColor: "#f7f7f7",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                color: "black",
              }}
            >
              <div>{follow.username}</div>
              <button onClick={() => unfollowUser(follow._id)}>Unfollow</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayFollowing;
