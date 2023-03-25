import React from "react";
const Modal = ({ followers, closeModal }) => {
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Followers</h2>
          <ul>
            {followers.map((follower, index) => (
              <li key={index}>{follower.username}</li>
            ))}
          </ul>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    );
  };
export default Modal;  