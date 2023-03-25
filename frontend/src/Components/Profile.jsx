import React from "react";
import "./Profile.css";
// import pic from "/home/prisha/React/frontend/src/Photos/profile-pic.jpg";
import pic from "../Photos/profile-pic.jpg";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import Modal from "./Modal";
const followers = [
  { username: "hello" },
  { username: "ji" },
  { username: "kaise ho" },
];
const following = [
  { username: "hello" },
  { username: "ji" },
  { username: "kaise hooo" },
];

const Profile = (e) => {
  // e.preventDefault();
  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);
  const { state } = useLocation();
  const [username, setUsername] = useState(
    localStorage.getItem("username")
  );  

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenfollowing, setModalIsOpenFollowing] = useState(false);
  const [formIsOpen, setFormIsOpen] = useState(false); // first
  localStorage.setItem("username", username);

  useEffect(() => {
    if (localStorage.getItem("loggedin") === "false" || localStorage.getItem("loggedin") === null ) {
      navigate("/");
    }
  }, []);
  return ( 
    <div className="PARENT">
    
      <section className="SECTION1">
      <nav className="navbar">
          <button>Sub Greddiit Page </button>
          <button>My Sub Greddiits Page</button>
          <div className="dropdown">
            <button onClick={() => setShowDropdown(!showDropdown)}>
              Profile
            </button>
            <img
              src="https://37.media.tumblr.com/88cbce9265c55a70a753beb0d6ecc2cd/tumblr_n8gxzn78qH1st5lhmo1_1280.jpg"
              alt="User Profile Image"
              className="dropdown-trigger"
            />
          </div>
          {showDropdown ? (
            <div className="dropdown-content">
              <button onClick={() => setShowDropdown(0)}>EDIT PROFILE</button>
              <button onClick={() => setShowDropdown(0)}>LOGOUT</button>
            </div>
          ) : null}
        </nav>
        <div className="profile">
          <div className="profile-image">
            .
            <img src={pic} alt="Hello ji " />
          </div>

          <div className="profile-user-settings">
            <h1 className="profile-user-name">
             @ {localStorage.getItem("username")}
            </h1>
            <button
              className="btn profile-edit-btn"
              onClick={() => setFormIsOpen(true)}
            >
              Edit Profile
            </button>
            <button
              className="btn profile-edit-btn"
              onClick={() => {
                localStorage.setItem("loggedin",false);
                navigate("/");
                alert("You have been logged out successfully\n");

              }}
            >
              LOGOUT
            </button>
            <button
              className="btn profile-settings-btn"
              aria-label="profile settings"
            >
              <i class="fas fa-cog" aria-hidden="true"></i>
            </button>
          </div>
          {formIsOpen ? (
            <form
              className="edit-form"
              onSubmit={(event) => {
                event.preventDefault();
                navigate("/profile");
              }}
            >
              <input
                type="text"
                placeholder="Username"
                onChange={(event) => {
                  localStorage.setItem("username", event.target.value);
                
                }}
              />
              <input
                type="text"
                placeholder="Bio"
               
              ></input>
              <button onClick={() => setFormIsOpen(false)}>Cancel</button>
              <button
                type="submit"
                onClick={() => {
                  setFormIsOpen(false);
                  setUsername(localStorage.getItem("username"));
               
                }}
              >
                Save
              </button>
            </form>
          ) : null}
          <div class="profile-stats">
            <ul>
              <li>
                <span className="profile-stat-count">164</span> posts
              </li>
              <li>
                <span
                  className="profile-stat-count"
                  onClick={() => setModalIsOpen(true)}
                >
                  188
                </span>{" "}
                followers
              </li>
              <li>
                <span
                  className="profile-stat-count"
                  onClick={() => setModalIsOpenFollowing(true)}
                >
                  280
                </span>{" "}
                following
              </li>
            </ul>
          </div>

          {modalIsOpen ? (
            <Modal
              followers={followers}
              closeModal={() => setModalIsOpen(false)}
            />
          ) : null}
          
          {modalIsOpenfollowing ? (
            <Modal
              followers={following}
              closeModal={() => setModalIsOpenFollowing(false)}
            />
          ) : null}
         
        </div>
      </section>

      <section className="SECTION2">
        <div class="gallery">
          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 56
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 2
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1497445462247-4330a224fdb1?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 89
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 5
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-type">
              <span class="visually-hidden">Gallery</span>
              <i class="fas fa-clone" aria-hidden="true"></i>
            </div>

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 42
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 1
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1502630859934-b3b41d18206c?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-type">
              <span class="visually-hidden">Video</span>
              <i class="fas fa-video" aria-hidden="true"></i>
            </div>

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 38
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 0
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1498471731312-b6d2b8280c61?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-type">
              <span class="visually-hidden">Gallery</span>
              <i class="fas fa-clone" aria-hidden="true"></i>
            </div>

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 47
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 1
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 94
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 3
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-type">
              <span class="visually-hidden">Gallery</span>
              <i class="fas fa-clone" aria-hidden="true"></i>
            </div>

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 52
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 4
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1515814472071-4d632dbc5d4a?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 66
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 2
                </li>
              </ul>
            </div>
          </div>

          <div class="gallery-item" tabindex="0">
            <img
              src="https://images.unsplash.com/photo-1511407397940-d57f68e81203?w=500&h=500&fit=crop"
              class="gallery-image"
              alt=""
            />

            <div class="gallery-item-type">
              <span class="visually-hidden">Gallery</span>
              <i class="fas fa-clone" aria-hidden="true"></i>
            </div>

            <div class="gallery-item-info">
              <ul>
                <li class="gallery-item-likes">
                  <span class="visually-hidden">Likes:</span>
                  <i class="fas fa-heart" aria-hidden="true"></i> 45
                </li>
                <li class="gallery-item-comments">
                  <span class="visually-hidden">Comments:</span>
                  <i class="fas fa-comment" aria-hidden="true"></i> 0
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
