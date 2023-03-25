import { getDefaultNormalizer } from "@testing-library/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import { Icon } from "@mui/material";
import pic from "../Photos/dogu1.jpeg";
import "./Profile2.css";
import ProfileIcon from "@mui/icons-material/AccountCircle";

const Profile2 = () => {
  const [contact, setcontactform] = useState("");
  const [FirstName, setfirstnameform] = useState("");
  const [LastName, setlastnameform] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  
     const handleClose = () => {
    setShowDetails(false);
     };

  const handleViewDetails = async () => {
    const username = localStorage.getItem("username");
    const response = await fetch(
      `http://localhost:5001/userdetails?username=${username}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
        setuserdetails(data);
        setShowDetails(true);
      });
  };
  
  
  useEffect(() => {
    const username = localStorage.getItem("username");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/followingret?followedby=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const responseData = await response.json();
        setFollowing(responseData);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  // here i am gonna fetch stuff from userDetails and then display the data using mongodb
  const [userdetails, setuserdetails] = useState([]);

  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
    const username = localStorage.getItem("username");
    const fetchData = async (username) => {
      try {
        const response = await fetch(
          `http://localhost:5001/userdetails?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setuserdetails(data);
      } catch (error) {
        console.error("Error fetching subGreddits:", error);
      }
    };
    fetchData(username);
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/followersret?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const responseData = await response.json();
        setFollowers(responseData);
      } catch (error) {
        console.error("Error fetching Request", error);
      }
    };
    fetchData();
  }, []);

  const isDisabled = () => {
    return (
      !FirstName &&
      !LastName &&
      !contact 
    );
  };
  const showFollowers = () => {
    navigate("/followers");
  };
  const showFollowing = () => {
    navigate("/following");
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const firstName = FirstName;
    const lastName = LastName;
    const contactValue = contact;

    fetch("http://localhost:5000/updateuserdetails", {
      method: "PUT", // Use the PUT method instead of POST
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        tokens: localStorage.getItem("token"),
        firstName: firstName,
        lastName: lastName,
        contactValue: contactValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          console.log("User details updated successfully", data.message);
        } else {
          console.error("Failed to update user details", data.message);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });

    setFormOpen(false);
    window.location.reload();
  };

  const mysubgreddit = () => {
    navigate("/mysubgrediit");
  };
  const loggedout = () => {
    setShowDropdown(0);
    localStorage.removeItem("token");
    localStorage.setItem("loggedin", false);
    navigate("/");
    alert("You have been logged out successfully\n");
  };
  const editprofile = () => {
    setShowDropdown(0);
    setFormOpen(1);
  };

  return (
    <div className="main">
      <div className="content-profile-page">
        <nav className="navbar">
          <button onClick={() => navigate("/subgrediitpage")}>
            Sub Greddiit Page{" "}
          </button>
          <button onClick={() => navigate("/viewsavedposts")}>
            Saved Posts
          </button>
          <button onClick={mysubgreddit}>My Sub Greddiits Page</button>
          <div className="dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              Profile
            </button>
            <icon onClick={() => setShowDropdown(!showDropdown)}>
              <ProfileIcon fontSize="large" />
            </icon>
          </div>
          {showDropdown ? (
            <div className="dropdown-content">
              <button onClick={() => editprofile()}>EDIT PROFILE</button>

              <button onClick={() => loggedout()}>LOGOUT</button>
            </div>
          ) : null}
        </nav>

        <div className="profile-user-page card">
          <div className="img-user-profile">
            <img
              className="profile-bgHome"
              src="https://37.media.tumblr.com/88cbce9265c55a70a753beb0d6ecc2cd/tumblr_n8gxzn78qH1st5lhmo1_1280.jpg"
            />
            <div className="img-user-profile"></div>
            <img className="avatar" src={pic} alt="jofpin" />
          </div>
          <div className="user-profile-data">
            {userdetails.length > 0 && <h1>@{userdetails[0].user_name}</h1>}
            {!(userdetails.length > 0) && (
              <h1>@{localStorage.getItem("username")}</h1>
            )}
          </div>

          <div>
            {userdetails.length > 0 && (
              <p>{`HI MY FIRST NAME IS ${userdetails[0].FirstName}, MY LAST NAME IS ${userdetails[0].LastName}`}</p>
            )}
          </div>

          <ul className="data-user">           
            <li onClick={() => showFollowers()}>
              <a>
                {/* <span>Followers</span> */}
                <span> {followers.length} Follower</span>
              </a>
            </li>
            <li onClick={() => handleViewDetails()}>
              <a>
                <span> View Profile</span>
              </a>
            </li>
            <li onClick={() => showFollowing()}>
              <a>
                <span> {following.length} Following</span>
              </a>
            </li>
          </ul>
        </div>
        {showDetails ? (
          <div className="modal">
            <div className="modal-content">
              <h2>User Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>Contact</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.user_name}</td>
                      <td>{user.FirstName}</td>
                      <td>{user.LastName}</td>
                      <td>{user.age}</td>
                      <td>{user.contact}</td>
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleClose}>Close</button>
            </div>
          </div>
        ) : null}
        {formOpen ? (
          <form className="edit-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="First Name"
              onChange={(event) => {
                setfirstnameform(event.target.value);
              }}
            />
            <input
              type="text"
              placeholder="LastName"
              onChange={(event) => {
                setlastnameform(event.target.value);
              }}
            ></input>
            <input
              type="text"
              placeholder="Contact"
              onChange={(event) => {
                setcontactform(event.target.value);
              }}
            ></input>
            <button onClick={() => setFormOpen(false)}>Cancel</button>
            <button
            type="submit"
            disabled={isDisabled()}
            style={{ opacity: isDisabled() ? 0.25 : 1 }}
          >
            Save
          </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default Profile2;
