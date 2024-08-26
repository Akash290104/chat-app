import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const emailElement = useRef();
  const passwordElement = useRef();
  const navigate = useNavigate();

  let email = "";
  let password = "";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailElement.current.value) {
      alert("Email is mandatory");
      return;
    }

    if (!passwordElement.current.value) {
      alert("Password is mandatory");
      return;
    }

    email = emailElement.current.value;
    password = passwordElement.current.value;

    try {
      const response = await axios.post(
        "https://chat-app-3-jpcn.onrender.com/api/user/login",
        { email, password }
      );

      localStorage.setItem("userInfo", JSON.stringify(response));
      navigate("/chats");

      emailElement.current.value = "";
      passwordElement.current.value = "";

      alert("User logged in successfully");
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

  const handleGuest = async () => {
    emailElement.current.value = "guest123@gmail.com";
    passwordElement.current.value = "1234";
  };

  return (
    <div>
      <h3 className="text-center">Login</h3>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            ref={emailElement}
            className="form-control"
            id="email"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            ref={passwordElement}
            className="form-control"
            id="password"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          onClick={handleLogin}
          className="btn btn-primary w-100 mt-3"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={handleGuest}
          className="btn btn-secondary w-100 mt-3"
        >
          Get guest user credentials
        </button>
      </form>
    </div>
  );
};

export default Login;
