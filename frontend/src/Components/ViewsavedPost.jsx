import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new_subgrediit.css";
import { useEffect } from "react";
import { Button } from "@material-ui/core";
// here display the saved post retreive them from the  database

const ViewsavedPost = () => {
  const navigate = useNavigate();
  const [savedpost, setsavedpost] = useState([]);
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  const handleDelete = async (savedpostId) => {
    try {
      await fetch(`http://localhost:5000/savedposts/${savedpostId}`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Post removed from saved posts");
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated saved posts data and set it in the state

    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/savedpostsret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setsavedpost(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);
  };
  useEffect(() => {
    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/savedpostsret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setsavedpost(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);
  }, []);

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => navigate("/subgrediitpage")}>
          Sub Greddiit Page{" "}
        </button>
        <button onClick={() => navigate("/mysubgrediit")}>
          My Sub Greddiits Page
        </button>
        <button onClick={() => navigate("/profile2")}>Profile</button>
      </nav>

      <table className="create-subgreddit-table">
        <thead>
          <tr>
            <th>Post</th>
            <th>PostedBY</th>
            <th>PostedAt</th>
            <th>Upvote</th>
            <th>Downvote</th>
            <th>Unsave</th>
          </tr>
        </thead>
        
        <tbody>
          {savedpost &&
            savedpost.length > 0 &&
            savedpost.map((post) => (
              <tr key={post._id}>
                <td>{post.postId?.post_text}</td>
                <td>{post.postId?.blockedname}</td>
                <td>{new Date(post.postId?.postedon).toLocaleDateString()}</td>
                <td>{post.postId?.upvotes}</td>
                <td>{post.postId?.downvotes}</td>
                <td>
                  <button onClick={() => handleDelete(post._id)}>Unsave</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default ViewsavedPost;

// here the need is to add delete button clciking on whch will rmeove the post form ther saved posts
