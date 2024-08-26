import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  let name = useRef();
  let email = useRef();
  let password = useRef();
  let confirmPassword = useRef();
  let refPic = useRef(null);

  const navigate = useNavigate();

  let [show1, setShow1] = useState(false);

  const toggleVisibility1 = () => {
    setShow1(!show1);
  };

  let [show2, setShow2] = useState(false);

  const toggleVisibility2 = () => {
    setShow2(!show2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.current.value) {
      alert("Name is mandatory");
      return;
    }
    if (!email.current.value) {
      alert("Email is mandatory");
      return;
    }

    if (!password.current.value) {
      alert("Password is mandatory");
      return;
    }

    if (!confirmPassword.current.value) {
      alert("Confirm password");
      return;
    }

    if (password.current.value !== confirmPassword.current.value) {
      alert("Confirmed password must be same as Password");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.current.value);
    formData.append("email", email.current.value);
    formData.append("password", password.current.value);
    formData.append("pic", refPic.current.files[0]);

    try {
      const response = await axios.post(
        "https://chat-app-3-jpcn.onrender.com/api/user/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("userInfo", JSON.stringify(response));
      navigate("/chats");

      name.current.value = "";
      email.current.value = "";
      password.current.value = "";
      confirmPassword.current.value = "";
      refPic.current.value = "";

      alert("Registration successful");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message); // Show the error message from the server
      } else {
        alert("Error while registering user");
      }

      console.log("Error while fetching user details");
    }
  };

  return (
    <div>
      <h3 className="text-center">Sign Up</h3>
      <form>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter your name"
            ref={name}
          />
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            ref={email}
          />
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={show1 ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              ref={password}
            />
            <button onClick={toggleVisibility1}>
              {show1 ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="password">Confirm Password</label>
          <div className="input-group">
            <input
              type={show2 ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              ref={confirmPassword}
            />
            <button onClick={toggleVisibility2}>
              {show2 ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <div className="form-group mt-2 mb-2">
          <label htmlFor="picture">Choose display picture</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="form-control"
            id="picture"
            ref={refPic}
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary mt-3 w-100"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
