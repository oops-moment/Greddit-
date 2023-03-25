import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = (props) => {
  const [user_name, setUsername] = useState("");
  const [pass_word, setPassword] = useState("");
  const [First_name, setFirstName] = useState("");
  const [last_name, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [Contact, setContact] = useState("");
  const [Email, setemail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("loggedin") === "false" ||
      localStorage.getItem("loggedin") === null
    ) {
      navigate("/");
    }
  }, []);

  const isDisabled = () => {
    return (
      !user_name ||
      !pass_word ||
      !First_name ||
      !last_name ||
      !age ||
      !Contact ||
      !Email
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validEmailRegex = /\S+@\S+\.\S+/;
    if (!validEmailRegex.test(Email) || !Email.endsWith("@gmail.com")) {
      alert("Please enter a valid Gmail address");
      return;
    }
    fetch("http://localhost:5000/register", {
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
        First_name,
        last_name,
        Contact,
        age,
        Email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status === "ok") {
          alert("You have been registered successfully");
          props.onFormSwitch("Login");
        } else if (data.message === "Username already exists") {
          alert("Username already exists. Please choose a different username.");
        } else {
          alert("Something went wrong");
        }
      });
  };

  return (
    <>
      {/* So inorder to strong username and password we would need usestate and react hooks for the same , and for now when we have no database to actaully store the user login data */}
      <div className="details-form">
        <form className="regis-form" onSubmit={handleSubmit}>
          <label htmlFor="username">USERNAME</label>
          <input
            value={user_name}
            onChange={(args) => setUsername(args.target.value)}
            type="text"
            placeholder="Your User Name"
            id="username"
            required
          ></input>
          <label htmlFor="password">PASSWORD</label>
          <input
            value={pass_word}
            onChange={(args) => setPassword(args.target.value)}
            type="password"
            placeholder="*******"
            id="password"
            required
          ></input>
          <label htmlFor="First_name">FIRSTNAME</label>
          <input
            value={First_name}
            onChange={(args) => setFirstName(args.target.value)}
            type="text"
            placeholder="Your First Name"
            id="First_name"
          ></input>
          <label htmlFor="age">AGE</label>
          <input
            value={age}
            onChange={(args) => setAge(args.target.value)}
            type="number"
            min="0"
            pattern="[0-9]*"
            placeholder="Enter Your Age"
            id="age"
          ></input>
          <label htmlFor="Contact">CONTACT</label>
          <input
            value={Contact}
            onChange={(args) => setContact(args.target.value)}
            type="contact"
            min="0"
            pattern="[0-9]*"
            placeholder="Contact"
            id="Contact"
          ></input>
          <label htmlFor="lastname">LASTNAME</label>
          <input
            value={last_name}
            onChange={(args) => setLastname(args.target.value)}
            type="text"
            placeholder="Lastname"
            id="lastname"
          ></input>
          <label htmlFor="email">EMAIL</label>
          <input
            value={Email}
            onChange={(args) => setemail(args.target.value)}
            type="email"
            placeholder="yourname@gmail.com"
            id="email"
            required
          ></input>
          <button
            type="submit"
            disabled={isDisabled()}
            style={{ opacity: isDisabled() ? 0.25 : 1 }}
          >
            REGISTER
          </button>
          <button
            className="link-btn"
            onClick={() => {
              props.onFormSwitch("Login");
            }}
          >
            ALREADY HAVE AN ACCOUNT ? LOGIN HERE{" "}
          </button>
        </form>
      </div>
    </>
  );
};
export default Register;
