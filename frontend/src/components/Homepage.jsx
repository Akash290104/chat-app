import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Tabs from "./Tabs";
import Login from "./Login";
import SignUp from "./SignUp";
import styles from "../styling/homepage.module.css";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("");

  const navigate = useNavigate()
  const [user, setUser] = useState()
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))

    if(userInfo){
      navigate("/chats")
    }
  }, [navigate])

 

  return (
    <div className={styles.container}>
      <div className={styles.title}>Talk-A-Tive</div>
      <div className="access">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "login" ? <Login /> : <SignUp />}
      </div>
    </div>
  );
};

export default Homepage;
