import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./new_subgrediit.css";
import { useEffect } from "react";
const CreateSubGreddit = () => {
  const [subGredditName, setSubGredditName] = useState("");
  const [subGredditDescription, setSubGredditDescription] = useState("");
  const [subGredditTag, setSubGredditTag] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [subGredditImage, setSubGredditImage] = useState(null);
  const [subGreddits, setSubGreddits] = useState([]);
  const [bannedWords, setBannedWords] = useState([]);
  const navigate = useNavigate();
  const date = new Date();
  const currentTime = date.toISOString();
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);

  const isDisabled = () => {
    return !subGredditName;
  };

  const handleDelete = async (subGredditId) => {
    try {
      const subgname = localStorage.getItem("subg name");
      const response = await fetch(
        `http://localhost:5001/subgrediitpostsret?subgredditname=${subgname}`,
        {
          method: "GET",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const posts = await response.json();

      const deletePostRequests = posts.map(async (post) => {
        await fetch(`http://localhost:5000/mypostsdelete/${post._id}`, {
          method: "DELETE",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const response2 = await fetch(
          `http://localhost:5001/reportsret/${post._id}`,
          {
            method: "GET",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const reports = await response2.json();

        const deleteReportRequests = reports.map(async (report) => {
          await fetch(`http://localhost:5000/reportdelete/${report._id}`, {
            method: "DELETE",
            crossDomain: true,
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        });

        await Promise.all(deleteReportRequests);
      });

      await Promise.all(deletePostRequests);

      await fetch(`http://localhost:5000/mysubgreddits/${subGredditId}`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Subgreddit deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated subGreddits data and set it in the state
    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/mysubgredditsret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSubGreddits(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/mysubgreddits", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subGredditName: subGredditName,
          subGredditDescription: subGredditDescription,
          subGredditTag: subGredditTag.split(",").map((t) => t.trim()),
          username: localStorage.getItem("username"),
          time: currentTime,
          bannedWords: bannedWords.split(",").map((tt) => tt.trim()),
        }),
      });
      const data = await response.json();
      console.log("Success:", data);
      if (data.message === "SUbgredditname already exists") {
        alert("Subgreddit name already exists , enter a unique name ");
      } else {
        alert("New Subgreddit created successfully\n");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated subGreddits data and set it in the state
    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/mysubgredditsret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSubGreddits(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);

    setShowForm(false);
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/mysubgredditsret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setSubGreddits(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);
  }, []);

  const handleOpenSubreddit = async (subGredditName) => {
    navigate(`/${subGredditName}`);
    localStorage.setItem("subg name", subGredditName);
  };

  return (
    <>
      <nav className="navbar">
        <button onClick={() => navigate("/subgrediitpage")}>
          Sub Greddiit Page{" "}
        </button>
        <button onClick={() => navigate("/mysubgrediit")}>
          My Sub Greddiits Page
        </button>
        <button onClick={() => navigate("/joinrequests")}>Requests</button>
      </nav>
      <div className="create-subgreddit-button-container">
        <table className="create-subgreddit-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>User</th>
              <th>Subreddit Name</th>
              <th>Subreddit Description</th>
              <th>Banned Words</th>
              <th>Delete Subreddit</th>
              <th>People joined</th>
              <th>Number of Posts</th>
              <th>Open Subgreddit</th>
            </tr>
          </thead>
          <tbody>
            {subGreddits.map((subGreddit, index) => (
              <tr key={subGreddit._id}>
                <td>{index + 1}</td>
                <td>{localStorage.getItem("username")}</td>
                <td>{subGreddit.subGredditName}</td>
                <td>{subGreddit.subGredditDescription}</td>
                <td>{subGreddit.bannedWords.join(", ")}</td>

                <td>
                  <button
                    className="tablebutton"
                    onClick={() => handleDelete(subGreddit._id)}
                  >
                    Delete
                  </button>
                </td>
                <td>{subGreddit.members.length}</td>
                <td>{subGreddit.total_posts}</td>

                <td>
                  <button
                    className="tablebutton"
                    onClick={() =>
                      handleOpenSubreddit(subGreddit.subGredditName)
                    }
                  >
                    Open Subreddit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="create-subgreddit-button"
          onClick={() => setShowForm(!showForm)}
        >
          Create Sub Greddit
        </button>
      </div>
      {showForm && (
        <form className="create-subgreddit-form" onSubmit={handleSubmit}>
          <label htmlFor="subGredditName">Sub Greddit Name:</label>
          <input
            type="text"
            id="subGredditName"
            name="subGredditName"
            value={subGredditName}
            onChange={(event) => setSubGredditName(event.target.value)}
          />
          <br />
          <br />
          <label htmlFor="subGredditDescription">
            Sub Greddit Description:
          </label>
          <textarea
            id="subGredditDescription"
            name="subGredditDescription"
            value={subGredditDescription}
            onChange={(event) => setSubGredditDescription(event.target.value)}
          />
          <br />
          <br />
          <label htmlFor="bannedWords">Banned Words:</label>
          <input
            type="text"
            id="bannedWords"
            name="bannedWords"
            value={bannedWords}
            onChange={(event) => setBannedWords(event.target.value)}
            placeholder="Enter comma-separated banned words"
          />

          <label htmlFor="subGredditImage">Sub Greddit Image:</label>
          <input
            type="file"
            id="subGredditImage"
            name="subGredditImage"
            onChange={(event) => setSubGredditImage(event.target.files[0])}
          />
          <label htmlFor="subGredditTags">Tags:</label>
          <input
            type="text"
            id="subGredditTags"
            name="subGredditTags"
            value={subGredditTag}
            onChange={(event) => setSubGredditTag(event.target.value)}
            placeholder="Tag options tag1,tag2,tag3,tag4,tag5"
          />
          <br />
          <br />
          <button
            type="submit"
            disabled={isDisabled()}
            style={{ opacity: isDisabled() ? 0.25 : 1 }}
          >
            Create
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </>
  );
};

export default CreateSubGreddit;

// here i need to implement this functionality that now subgreddit has one new thing that is array of people,ie username  who joined that subgreddit
