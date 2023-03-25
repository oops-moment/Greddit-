import React, { useEffect, useState } from "react";
import "./CommonComponent.css";
import { Icon } from "@mui/material";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useParams } from "react-router-dom";
// import pic from "/home/prisha/React/frontend/src/Photos/dogu1.jpeg";
import pic from "../Photos/dogu1.jpeg";
// here we need to extract origienal posts as well
const CommonComponentNOnMODjoined = () => {
  const navigate = useNavigate();

  const [concern, setconcern] = useState("AISE HI SEcsyY LAG RHA THA");
  const [posttextrep, setposttextrep] = useState("sab");
  const [whosepost, setwhosepost] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [postid, setpostid] = useState("");
  const [showFormReport, setShowFormReport] = useState(false);
  const [text, settext] = useState(null);
  const [post, setPost] = useState([]);
  const [subgdata, setsubdata] = useState([]);
  const [bannedWords, setBannedWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ismod, setismod] = useState(false);
  const [ISLoading, setISLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState("");
  const [showviewModal, setShowviewModal] = useState(false);
  const [viewcomments, setviewComments] = useState([]);

  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  const openModal = (postid) => {
    setpostid(postid);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleUpvote = async (post_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/subgrediits/posts/${post_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            upvotedby: localStorage.getItem("username"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const updatedPost = post.map((p) => {
        if (p._id === post_id) {
          return { ...p, upvotes: p.upvotes + 1 };
        }
        return p;
      });
      setPost(updatedPost);
    } catch (error) {
      console.error("Error:", error);
      // Display the error to the user
      alert("Sorry, but you can't Upvote twice!!");
    }
  };

  const handleDownvote = async (post_id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/subgrediits/posts/dv/${post_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            downvotedby: localStorage.getItem("username"),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      const updatedPost = post.map((p) => {
        if (p._id === post_id) {
          return { ...p, downvotes: p.downvotes + 1 };
        }
        return p;
      });
      setPost(updatedPost);
    } catch (error) {
      console.error("Error:", error);
      // Display the error to the user
      alert("Sorry, but you can't downvote twice!!");
    }
  };

  // basicaly here i am using api subgredits/comments as api to comment
  const handleComments = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/subgrediits/comments",
        {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            postId: postid,
            commentedby: localStorage.getItem("username"),
            comment: comment,
          }),
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      alert("Comment added successfully\n");
    } catch (error) {
      console.error("Error:", error);
    }
    setShowModal(false);
  };

  // Now i need to handle the reports that have been made by user for particular post
  // we are here passing the name of user who created the post that is being reported now

  const handleReport = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/subgrediits/reports",
        {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            reportedby: localStorage.getItem("username"),
            userreported: whosepost,
            concern: concern,
            textreported: posttextrep,
            subgredditname: localStorage.getItem("subg name"),
            postid: postid,
          }),
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      alert("Reported successfully\n");
    } catch (error) {
      console.error("Error:", error);
    }
    setShowFormReport(!showFormReport);
  };

  //---------------------------------------------------------------

  const handleSavePosts = async (postId) => {
    try {
      const response = await fetch(
        "http://localhost:5000/subgrediits/savedposts",
        {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            postId: postId,
            savedby: localStorage.getItem("username"),
          }),
        }
      );
      const data = await response.json();
      console.log("Success:", data);
      alert("Post Saved Successfully \n");
    } catch (error) {
      console.error("Error:", error);
      if (
        error.response &&
        error.response.status === 409 &&
        error.response.data.message === "Post already saved"
      ) {
        alert("You have already saved this post");
      } else {
        alert("An error occurred while saving the post");
      }
    }
  };

  // here is the one to make the person follower

  const handleFollow = async (userjiskofollowkrna) => {
    try {
      const response = await fetch("http://localhost:5000/followers", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          user: userjiskofollowkrna, // this is the person jisko follow krna
          followedby: localStorage.getItem("username"), // this person wants to follow
        }),
      });

      const data = await response.json();
      console.log("Success:", data);
      if (data.status === "error" && data.message === "exists") {
        alert(`You are already following ${userjiskofollowkrna}.`);
      } else {
        alert(`You are now following ${userjiskofollowkrna}.`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const add_report = (postedby, postid) => {
    setShowFormReport(!showFormReport);
    setwhosepost(postedby);
    setpostid(postid);
  };

  const handlereq = () => {
    navigate("/requests/subgrediit");
  };

  const HandleSUbmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Get the subgreddit name from local storage
    const subgggname = localStorage.getItem("subg name");

    // Define a function to fetch the subgreddit data
    const fetchSubgData = async (subgname) => {
      try {
        const response = await fetch(
          `http://localhost:5001/subgredditsretname?subggname=${subgname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();

        // Set the subgreddit data in state
        setsubdata(data);

        // If the subgreddit data contains banned words, set them in state
        if (subgdata.length > 0) {
          setBannedWords(subgdata[0].bannedWords);
        }

        // Log the banned words (for debugging purposes)
        console.log(bannedWords);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };

    // Call the fetchSubgData function to fetch the subgreddit data
    fetchSubgData(subgggname);

    // Get the current time
    const date = new Date();
    const currentTime = date.toISOString();
    console.log(new Date(currentTime));

    if (isLoading) {
      alert("Loading banned words. Please wait...");
      return;
    }

    // Convert banned words to lowercase
    const bannedWordsLower = bannedWords.map((word) => word.toLowerCase());

    // Convert post text to lowercase and check for banned words
    const textLower = text.toLowerCase();
    console.log(textLower);
    const containsBannedWord = bannedWordsLower.some((word) =>
      textLower.includes(word)
    );

    console.log(containsBannedWord);

    if (containsBannedWord) {
      alert("Your post contains a banned word.");
    }

    // Replace banned words with asterisks in the post text
    const postTextFiltered = bannedWords.reduce((textFiltered, word) => {
      const regex = new RegExp(word, "gi");
      return textFiltered.replace(regex, "*".repeat(word.length));
    }, text);

    const subggname = localStorage.getItem("subg name");

    try {
      const response = await fetch(
        `http://localhost:5000/mysubgreddits_count?subgname=${subggname}`,
        {
          method: "PUT",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch("http://localhost:5000/subgrediits/posts", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          posttext: postTextFiltered,
          postedby: localStorage.getItem("username"),
          time: date,
          subgredditname: localStorage.getItem("subg name"),
          upvotes: 0,
          upvotedby: localStorage.getItem("username"),
          blockedname: localStorage.getItem("username"),
        }),
      });

      const data = await response.json();
      console.log("Success:", data);
      alert("New Post created successfully\n");
    } catch (error) {
      console.error("Error:", error);
    }

    // Fetch the updated subGreddits data and set it in the state
    const subgname = localStorage.getItem("subg name");
    const fetchData = async (subgname) => {
      try {
        const response = await fetch(
          `http://localhost:5001/subgrediitpostsret?subgredditname=${subgname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        // console.log(post)
        setPost(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(subgname);

    setShowForm(false);
  };

  useEffect(() => {
    const subgname = localStorage.getItem("subg name");
    const fetchData = async (subgname) => {
      try {
        const response = await fetch(
          `http://localhost:5001/subgrediitpostsret?subgredditname=${subgname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        // console.log(post)
        setPost(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(subgname);
  }, []);

  useEffect(() => {
    const subggname = localStorage.getItem("subg name");
    const fetchSubgData = async (subgname) => {
      try {
        const response = await fetch(
          `http://localhost:5001/subgredditsretname?subggname=${subgname}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setsubdata(data);
        // console.log(subgdata); // log subgdata after it has been updated
        if (subgdata.length > 0) {
          setBannedWords(subgdata[0].bannedWords);
        }
        console.log(bannedWords);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchSubgData(subggname);
  }, []);

  const subggname = localStorage.getItem("subg name");
  const fetchData = async (subggname) => {
    try {
      const response = await fetch(
        `http://localhost:5001/subgredditsretname?subggname=${subggname}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setsubdata(data);
    } catch (error) {
      console.error("Error fetching subGreddits:", error);
    }

    if (
      subgdata.length > 0 &&
      subgdata[0].username === localStorage.getItem("username")
    ) {
      setismod(true);
    } else {
      setismod(false);
    }
    setISLoading(false);
  };

  // if (ISLoading) {
  // alert("Page is Loading please wait")
  // }

  useEffect(() => {
    fetchData(subggname);
  }, [subggname, subgdata]);

  const handleusers = () => {
    navigate("/users");
  };
  const openthemodel = () => {
    setShowviewModal(true);
  };
  const openviewModal = async (postid) => {
    const fetchcomments = async (postId) => {
      try {
        const response = await fetch(
          `http://localhost:5001/viewcomments?postId=${postId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();

        setviewComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchcomments(postid);

    openthemodel();
  };

  const closeviewModal = () => {
    setShowviewModal(false);
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={() => navigate("/subgrediitpage")}>
          Sub Greddiit Page{" "}
        </button>
        <button onClick={() => navigate("/mysubgrediit")}>
          My Sub Greddiits Page
        </button>
        <icon>
          <ProfileIcon fontSize="large" />
        </icon>
        <button onClick={() => navigate("/profile2")}>Profile</button>
      </nav>

      <img className="logo" src={pic} alt="Logo" />

      <table className="create-subgreddit-table">
        <thead>
          <tr>
            <th>Post</th>
            <th>PostedBY</th>
            <th>PostedAt</th>
            <th>React</th>
            <th>Upvotes</th>
            <th>Downvote</th>
            <th>Any Views</th>
          </tr>
        </thead>
        <tbody>
          {post &&
            post.length > 0 &&
            post.map((post) => (
              <tr key={post._id}>
                <td>
                  {post.post_text}
                  <button
                    className="tablebutton2"
                    onClick={() => {
                      handleSavePosts(post._id);
                    }}
                  >
                    Save Post
                  </button>
                </td>
                <td>
                  {post.blockedname}
                  <button
                    onClick={() => handleFollow(post.postedby)}
                    disabled={
                      post.postedby === localStorage.getItem("username") ||
                      post.blockedname === "blockeduser"
                    }
                    style={{
                      opacity:
                        post.postedby === localStorage.getItem("username") ||
                        post.blockedname === "blockeduser"
                          ? 0.25
                          : 1,
                    }}
                  >
                    Follow
                  </button>
                </td>
                <td>{new Date(post.postedon).toLocaleDateString()}</td>
                <td>
                  <button
                    className="tablebutton"
                    onClick={() => handleUpvote(post._id)}
                  >
                    Upvote
                  </button>
                  <button
                    className="tablebutton"
                    onClick={() => handleDownvote(post._id)}
                  >
                    Downvote
                  </button>
                  <button
                    className="tablebutton"
                    onClick={() => add_report(post.postedby, post._id)}
                  >
                    {/* here the setshow will be set to negation ie true basically so the form will be disaplyed */}
                    Report Post
                  </button>
                </td>
                <td>{post.upvotes}</td>
                <td>{post.downvotes}</td>
                <td>
                  <button onClick={() => openModal(post._id)}>
                    Add Comment Here
                  </button>
                  <button onClick={() => openviewModal(post._id)}>
                    View Comments
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <form onSubmit={handleComments}>
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <button
                type="submit"
                disabled={!comment}
                style={{ opacity: comment ? 1 : 0.25 }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showviewModal && (
        <div className="modals">
          <div className="modals-content">
            <span className="closes" onClick={closeviewModal}>
              &times;
            </span>

            <h2 style={{ visibility: "visible" }}>COMMENTS</h2>
            {viewcomments.map((commentu) => (
              <div key={commentu._id} className="comment">
                <p>{commentu.comment}</p>
                <p>Posted by: {commentu.commentedby}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {showFormReport && (
        <form onSubmit={handleReport} className="reportform">
          <label htmlFor="reported-by">Reported By:</label>
          <input
            type="text"
            id="reported-by"
            name="reported-by"
            value={localStorage.getItem("username")}
            readOnly
          />
          <label htmlFor="reported-to">Whom we have reported:</label>
          <input
            type="text"
            id="reported-by"
            name="reported-by"
            value={whosepost}
            readOnly
          />

          <label htmlFor="concern">Concern:</label>
          <textarea
            id="concern"
            name="concern"
            onChange={(event) => setconcern(event.target.value)}
            placeholder="Aise hi secsy lag rha tha"
          ></textarea>

          <label htmlFor="post-text">Text of the Post which is reported:</label>
          <textarea
            id="post-text"
            name="post-text"
            onChange={(event) => setposttextrep(event.target.value)}
            placeholder="Sab galt lag rha dekhne mei im hurt"
          ></textarea>
          <button onClick={() => setShowFormReport(false)}>Cancel</button>
          <button type="submit">Report</button>
        </form>
      )}

      <button
        className="create-post-button"
        onClick={() => setShowForm(!showForm)}
      >
        Post Something !
        {/* in the post we aim at collecting text posted by whom and time it was posted at  */}
      </button>
      {showForm && (
        <form className="create-subgreddit-form" onSubmit={HandleSUbmit}>
          <label htmlFor="subGredditName">Text You Want To Post</label>
          <input
            type="text"
            id="subGredditName"
            name="subGredditName"
            value={text}
            onChange={(event) => settext(event.target.value)}
          />
          <br />
          <br />
          <button
            type="submit"
            disabled={!text}
            style={{ opacity: text ? 1 : 0.25 }}
          >
            Post
          </button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default CommonComponentNOnMODjoined;
