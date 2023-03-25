import React, { useState, useEffect } from "react";
import "./new_subgrediit.css";
import { useFetcher, useNavigate } from "react-router-dom";
const RequestPage = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const subgredditname = localStorage.getItem("subg name");
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  const handleAccept = async (data_id, username, Subgredditname) => {
    try {
      await fetch(`http://localhost:5000/joinrequests/${data_id}`, {
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

    try {
      const response = await fetch(
        "http://localhost:5000/subgreddits/members",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            subgredditName: Subgredditname,
            username: username,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const updatedSubgreddit = await response.json();
      console.log(updatedSubgreddit);
    } catch (error) {
      console.error(error);
      // handle error here (e.g. display error message to user)
    }

    try {
      await fetch(`http://localhost:5000/approvedrequests`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: username,
          subgredditName: Subgredditname,
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated subGreddits data and set it in the state
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/joinreqret?subgredditname=${subgredditname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };

    fetchData();
  };

  const handleReject = async (data_id, username, subgredditname) => {
    try {
      await fetch(`http://localhost:5000/joinrequests/${data_id}`, {
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

    // Fetch the updated subGreddits data and set it in the state
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/joinreqret?subgredditname=${subgredditname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };
    fetchData();
  };
 
  useEffect 
    (() => {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://localhost:5001/joinreqret?subgredditname=${subgredditname}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          setData(data);
        } catch (error) {
          console.error("Error fetching Request", error);
        }
      };
      fetchData();
    },
    []);

  return (
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Subreddit Name</th>
          <th>Action</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td>{item.username}</td>
            <td>{item.subGredditName}</td>

            <td>
              <button
                className="tablebutton"
                onClick={() =>
                  handleAccept(item._id, item.username, item.subGredditName)
                }
              >
                Accept
              </button>
            </td>

            <td>
              <button
                className="tablebutton"
                onClick={() =>
                  handleReject(item._id, item.username, item.subGredditName)
                }
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestPage;
