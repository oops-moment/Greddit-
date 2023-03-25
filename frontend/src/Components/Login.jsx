import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./Login.css";

const Login = (props) => {
  const handleSubmits = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/loginuser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        
      },
      body: JSON.stringify({
        user_name,
        pass_word,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("Welcome, you are loggedin 😄 !");
          localStorage.setItem("loggedin", true);
          localStorage.setItem("username", user_name);
          localStorage.setItem("token",data.data);
          navigate("/profile2", { state: { username: user_name } });
        } else if (data.message === "Username already exists") {
          alert("Username already exists. Please choose a different username.");
        } else {
          alert("Something went wrong");
        }
      });
  };

  const navigate = useNavigate();
  const [user_name, setUsername] = useState("admin");
  const [pass_word, setPassword] = useState("");
  useEffect(() => {
    if (localStorage.getItem("loggedin") === "true") {
      navigate("/profile2", { state: { username: user_name } });
    }
  }, []);
  
  const isDisabled = user_name === "" || pass_word === "";
  return (
    <>
      {/* So inorder to strong username and password we would need usestate and react hooks for the same , and for now when we have no database to actaully store the user login data */}
      <div className="details-form">
        <form className="login-form" onSubmit={handleSubmits}>
          <label htmlFor="username">USERNAME</label>
          <input
            value={user_name}
            onChange={(args) => setUsername(args.target.value)}
            type="text"
            placeholder="Your Name"
            id="username"
          ></input>
          <label htmlFor="password">PASSWORD</label>
          <input
            value={pass_word}
            onChange={(args) => setPassword(args.target.value)}
            type="password"
            placeholder="*******"
            id="password"
          ></input>
<button type="submit" disabled={isDisabled} style={{ opacity: isDisabled ? 0.25 : 1 }}>
          LOGIN
        </button>
          <button
            className="link-btn"
            onClick={() => {
              props.onFormSwitch("Register");
            }}
          >
            DON'T HAVE AN ACCOUNT ? REGISTER HERE{" "}
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
