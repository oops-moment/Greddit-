import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./subgrediitspage.css";
import Fuse from "fuse.js";
const SubgreddiitPage = () => {
  const navigate = useNavigate();
  const [subGreddits, setSubGreddits] = useState([]);
  const [filterform, setfilterform] = useState(false);
  const [tags, setTags] = useState(["tag1", "tag2", "tag3", "tag4", "tag5"]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showOptions, setShowOptions] = useState(false); // THis for the sort button options
  const [searchTerm, setSearchTerm] = useState(""); // for storing the search term
  const [clickCount, setClickCount] = useState(0);
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    const fetchDfata = async () => {
      try {
        const response = await fetch("http://localhost:5001/mysubgredditsret", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        const currentUser = localStorage.getItem("username");
        // Sort subreddits by whether the logged-in user has joined them or not
        const sortedSubreddits = data.sort((a, b) => {
          const aIndex = a.members.indexOf(currentUser);
          const bIndex = b.members.indexOf(currentUser);
          if (aIndex === -1 && bIndex !== -1) {
            return 1;
          } else if (aIndex !== -1 && bIndex === -1) {
            return -1;
          } else {
            return 0;
          }
        });
        setSubGreddits(sortedSubreddits);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchDfata();
  }, []);

  

  useEffect(() => {
    fetchData(searchTerm);
  }, [searchTerm]);

  const handleSort = (option) => {
    const sortedSubGreddits = [...subGreddits];

    if (option === "name-asc") {
      sortedSubGreddits.sort((a, b) =>
        a.subGredditName.localeCompare(b.subGredditName)
      );
    } else if (option === "name-desc") {
      sortedSubGreddits.sort((a, b) =>
        b.subGredditName.localeCompare(a.subGredditName)
      );
    } else if (option === "followers-desc") {
      sortedSubGreddits.sort((a, b) => b.members.length - a.members.length);
    } else if (option === "creation-date-desc") {
      sortedSubGreddits.sort(
        (a, b) => new Date(b.postedon) - new Date(a.postedon)
      );
    }

    setSubGreddits(sortedSubGreddits);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (option) => {
    setShowOptions(false);
    handleSort(option);
  };

  const handleOpenNonMod = async (subGredditName) => {
    try {
      const response = await fetch("http://localhost:5000/subreddit/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subgname: subGredditName,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setClickCount(clickCount + 1);
    } catch (error) {
      console.error("Error:", error);
    }

    // navigate(`/${subGredditName}`);
    // console.log(subGreddits)
    let flag = 0;
    for (let i = 0; i < subGreddits.length; i++) {
      // Check if the subreddit name matches
      if (subGreddits[i].subGredditName === subGredditName) {
        // Check if the members array includes the username
        if (subGreddits[i].members.includes(localStorage.getItem("username"))) {
          flag = 1;
          break;
        }
      }
    }
    localStorage.setItem("subg name", subGredditName);
    if (flag) {
      navigate(`/nonmodjoiopnesubg`);
    } else {
      navigate("/nonmodnonjopnesubg");
    }
  };
  const handleOpenMod = async (subGredditName) => {
    try {
      const response = await fetch("http://localhost:5000/subreddit/click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          subgname: subGredditName,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setClickCount(clickCount + 1);
    } catch (error) {
      console.error("Error:", error);
    }

    navigate(`/${subGredditName}`);
    localStorage.setItem("subg name", subGredditName);
  };
  const handleJoin = async (subGredditName, userName) => {
    try {
      const response = await fetch("http://localhost:5000/joinrequests", {
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
          userName: userName,
        }),
      });

      const data = await response.json();
      console.log("Success:", data);
      alert(`Successfully requested to join subreddit: ${subGredditName}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLeave = async (username, subggname) => {
    try {
      await fetch(`http://localhost:5000/approvedrequestsdel`, {
        method: "DELETE",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username: username, subgredditName: subggname }),
      });
      alert(`Left  subreddit: ${subggname}`);
    } catch (error) {
      console.error("Error:", error);
      console.error("Error:", error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error;
      if (errorMessage === "User not found") {
        alert("You can't leave unless you join 🥴 ");
      }
    }

    try {
      const response = await fetch(
        `http://localhost:5000/subgreddits/memberslef`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            username: username,
            subgredditName: subggname,
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
  };

  const handleTagSelection = (tag) => {
    const isTagSelected = selectedTags.includes(tag);
    if (isTagSelected) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const fetchhData = async (selectedTags) => {
    try {
      let url = "http://localhost:5001/subgredditsret";
      if (selectedTags && selectedTags.length > 0) {
        const tagsQuery = selectedTags.join(",");
        url = `${url}?tags=${tagsQuery}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setSubGreddits(data);
    } catch (error) {
      console.error("Error fetching subGreddits:", error);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setfilterform(!filterform);
    // update selectedTags state to reflect user's selected tags
    const selectedTags = tags.filter(
      (tag) => document.getElementById(tag).checked
    );
    // fetch filtered subgreddits using updated selectedTags

    fetchhData(selectedTags);
  };

  const fetchData = async (searchTerm) => {
    try {
      const response = await fetch("http://localhost:5001/mysubgredditsret", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      // Apply fuzzy search algorithm to filter the subgreddits array
      // const filteredSubgreddits = data.filter((subgreddit) => {
      //   const name = subgreddit.subGredditName.toLowerCase();
      //   const term = searchTerm.toLowerCase();
      //   return name.includes(term);
      // });

      const fuse = new Fuse(data, {
        keys: ["subGredditName"],
        includeScore: true,
        threshold: 0.3,
      });

      // Perform fuzzy search on data if search term is not empty, else return all subreddits
      const filteredSubgreddits = searchTerm
        ? fuse.search(searchTerm).map((r) => r.item)
        : data;

      const currentUser = localStorage.getItem("username");
      // Sort subreddits by whether the logged-in user has joined them or not
      const sortedSubreddits = filteredSubgreddits.sort((a, b) => {
        const aIndex = a.members.indexOf(currentUser);
        const bIndex = b.members.indexOf(currentUser);
        if (aIndex === -1 && bIndex !== -1) {
          return 1;
        } else if (aIndex !== -1 && bIndex === -1) {
          return -1;
        } else {
          return 0;
        }
      });
      setSubGreddits(sortedSubreddits);
    } catch (error) {
      console.error("Error fetching subGreddits:", error);
    }
  };
  return (
    <div>
      <nav className="navbar">
        <button onClick={() => navigate("/subgrediitpage")}>
          Sub Greddiit Page{" "}
        </button>

        <form className="searchform">
          <input
            type="text"
            placeholder="Is it me you are looking for?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />{" "}
        </form>
        <button onClick={() => navigate("/mysubgrediit")}>
          My Sub Greddiits Page
        </button>
        <button onClick={() => navigate("/viewsavedposts")}>
          View Saved Posts
        </button>
        <button onClick={() => navigate("/profile2")}>Profile</button>
      </nav>
      <table className="create-subgreddit-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>User</th>
            <th>Subreddit Name</th>
            <th>Subreddit Description</th>
            <th>People joined</th>
            <th>Number of Posts</th>
            <th>Open Subgreddit</th>
            <th>Join Subgreddit</th>
            <th>Leave SUbgredit</th>
          </tr>
        </thead>
        <tbody>
          {subGreddits.map((subGreddit, index) => (
            <tr key={subGreddit._id}>
              <td>{index + 1}</td>
              <td>{subGreddit.username}</td>
              <td>{subGreddit.subGredditName}</td>
              <td>{subGreddit.subGredditDescription}</td>
              <td>{subGreddit.members.length}</td>
              <td>{subGreddit.total_posts}</td>
              <td>
                {subGreddit.username === localStorage.getItem("username") ? (
                  <button
                    onClick={() => handleOpenMod(subGreddit.subGredditName)}
                  >
                    Open
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenNonMod(subGreddit.subGredditName)}
                  >
                    Open
                  </button>
                )}
              </td>

              <td>
                {subGreddit.members.includes(
                  localStorage.getItem("username")
                ) ? (
                  <button
                    className="tablebutton"
                    onClick={() => alert("You are already joined")}
                  >
                    Joined
                  </button>
                ) : subGreddit.left_member.includes(
                    localStorage.getItem("username")
                  ) ? (
                  <button
                    className="tablebutton"
                    onClick={() => alert("You can't join again")}
                  >
                    Join
                  </button>
                ) : (
                  <button
                    className="tablebutton"
                    onClick={() =>
                      handleJoin(
                        subGreddit.subGredditName,
                        localStorage.getItem("username")
                      )
                    }
                  >
                    Join
                  </button>
                )}
              </td>

              <td>
                {subGreddit.left_member.includes(
                  localStorage.getItem("username")
                ) ? (
                  <button
                    className="tablebutton"
                    onClick={() => alert("You already left")}
                  >
                    Left
                  </button>
                ) : (
                  <button
                    className="tablebutton"
                    onClick={() =>
                      handleLeave(
                        subGreddit.subGredditName,
                        localStorage.getItem("username")
                      )
                    }
                  >
                    Leave
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* on clciking form should appear asking for the tags */}
      <button
        className="tablebutton2"
        onClick={() => setfilterform(!filterform)}
      >
        FILTER SUBGREDDITS
      </button>
      {filterform && (
        <form className="create-subgreddit-form" onSubmit={handleFilterSubmit}>
          <div>
            <h4>Select tags to filter by:</h4>
            {tags.map((tag) => (
              <div key={tag}>
                <input
                  type="checkbox"
                  id={tag}
                  name={tag}
                  value={tag}
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagSelection(tag)}
                />
                <label htmlFor={tag}>{tag}</label>
              </div>
            ))}
          </div>
          <button type="submit">Filter</button>
        </form>
      )}
      <button onClick={toggleOptions} className="tablebutton">
        Sort
      </button>

      {showOptions && (
        <div>
          <button
            onClick={() => handleOptionClick("name-asc")}
            className="tablebutton"
          >
            Name (Ascending)
          </button>
          <button
            onClick={() => handleOptionClick("name-desc")}
            className="tablebutton"
          >
            Name (Descending)
          </button>
          <button
            onClick={() => handleOptionClick("followers-desc")}
            className="tablebutton"
          >
            Followers (Descending)
          </button>
          <button
            onClick={() => handleOptionClick("creation-date-desc")}
            className="tablebutton"
          >
            Creation Date (Newest)
          </button>
        </div>
      )}
    </div>
  );
};
export default SubgreddiitPage;
