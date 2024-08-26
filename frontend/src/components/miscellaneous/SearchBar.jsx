import React, { useRef } from "react";
import styles from "../../styling/SearchBar.module.scss";
import { ChatState } from "../../context/chatProvider";
import { useState } from "react";
import axios from "axios";
import { useCallback } from "react";
import { debounce } from "../../config/debounce";

export const ChatLoading = () => {
  return (
    <>
      {/* <p className="placeholder-wave">
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
        </p> */}
      <button
        className="btn btn-primary "
        style={{ fontSize: "1.3rem" }}
        type="button"
        disabled
      >
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          style={{ height: "25px", width: "25px", marginRight: "5px" }}
          aria-hidden="true"
        ></span>
        Loading...
      </button>
    </>
  );
};

export const User = ({ user, handleFunction }) => {
  return (
    <div className={styles.customUser} onClick={handleFunction}>
      <div className={styles.pic}>
        <img src={user.pic} alt="User" />
      </div>
      <div className={styles.details}>
        <div className={styles.name}>{user.name}</div>
        <div className={styles.mail}>{user.email}</div>
      </div>
    </div>
  );
};

const SearchBar = ({ isVisible, setIsVisible }) => {
  const searchElement = useRef(null);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [noUsers, setNoUsers] = useState(false);

  const { user,  chats, setChats } = ChatState();

  const handleSearch = useCallback(
    debounce(async (search) => {
      if (!search) {
        setSearchResult([]);
        setNoUsers(false);
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.data.token}`,
          },
        };

        const response = await axios.get(
          `https://chat-app-3-jpcn.onrender.com/api/user?search=${search}`,
          config
        );

        setLoading(false);
        setNoUsers(true);

        setSearchResult(response.data.users);
      } catch (error) {
        setLoading(false);
        alert("Error fetching searched users");
        console.log("Error fetching searched users", error);
      }
    }, 500),
    [user.data.token]
  );

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const response = await axios.get(
        "https://chat-app-3-jpcn.onrender.com/api/chat",
        config
      );

      console.log("Response of fetchChats is", response);
      setChats(response.data.result);

      console.log("Chats of MyChats component are", chats);
    } catch (error) {
      console.log("Error fetching the chats of the logged in user", error);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const response = await axios.post(
        `https://chat-app-3-jpcn.onrender.com/api/chat`,
        { userId },
        config
      );

      console.log("Response of accessChat ", response);

      //  if(!chats){
      //   setChats([response.data])
      //  }
      //  else {
      //   if(!chats.find((c) => c._id === response.data._id))
      //     setChats([response.data, ...chats])
      // }

      //We use functional form of setChats
      // console.log("Previous chats", chats);

      // setChats((prevChats) => {
      //   const updatedChats = prevChats || []

      //   if(!updatedChats.find((c) => c._id === response.data._id)){
      //     return [response.data.fullChat, ...updatedChats]
      //   }
      //   return updatedChats
      // })

      // console.log("Update chats are", chats);

      setLoadingChat(false);
    } catch (error) {
      console.log("Error fetching chats of searched users", error);
    }
  };

  const vacantSearch = () => {
    searchElement.current.value = "";
    setSearchResult([]);
    setNoUsers(false);
  };

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      handleSearch(value); // Call the debounced search function
    },
    [handleSearch] // Dependency for handleInputChange
  );

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.show : styles.hide}`}
    >
      <div className={styles.heading}>
        <div className="text">Search Users</div>
        <div className={styles.close}>
          <button
            onClick={() => {
              setIsVisible(false);
              vacantSearch();
            }}
          >
            X
          </button>
        </div>
      </div>
      <div className={styles.search}>
        <div className={styles.field}>
          <input
            type="text"
            ref={searchElement}
            onChange={handleInputChange}
            placeholder="Search"
          />
        </div>
        {/* <div className={styles.go}>
          <button onClick={handleSearch}>Go</button>
        </div> */}
      </div>
      <div className={styles.users}>
        {loading ? (
          <div className={styles.loading}>
            <ChatLoading />
          </div>
        ) : loadingChat ? (
          <div className={styles.loading}>
            <ChatLoading />
          </div>
        ) : searchResult.length === 0 ? (
          <div>{noUsers ? "No users found" : ""}</div>
        ) : (
          searchResult.map((a) => (
            <User
              key={a._id}
              user={a}
              handleFunction={() => {
                accessChat(a._id).then(() => fetchChats());
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBar;
