import React, { useState } from "react";
import styles from "../../styling/GroupChatModal.module.scss";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import { User } from "./SearchBar";
import { ChatLoading } from "./SearchBar";
import { debounce } from "../../config/debounce";
import { useCallback } from "react";
import UserBadge from "./UserBadge";

const GroupChatModal = ({ children, hideGroupChatModal }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noUsers, setNoUsers] = useState(false);

  const { user, chats, setChats } = ChatState();

  const handleFunction = (user) => {
    console.log(user);

    setSelectedUsers((prevSelectedUsers) => {
      const updatedSelectedUsers = prevSelectedUsers || [];
      if (!updatedSelectedUsers.find((a) => a._id === user._id)) {
        return [...updatedSelectedUsers, user];
      }
      return updatedSelectedUsers;
    });
  };

  // const handleSearch = async (query) => {
  //   if (!query) {
  //     setSearchResult([]);
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.data.token}`,
  //       },
  //     };

  //     const response = await axios.get(
  //       `http://localhost:5000/api/user?search=${query}`,
  //       config
  //     );

  //     setLoading(false);
  //     setNoUsers(true);

  //     setSearchResult(response.data.users);
  //   } catch (error) {
  //     console.log(
  //       "Error finding serached users for creating Group Chat",
  //       error
  //     );
  //   }
  // };

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        setNoUsers(false);
        setSearchResult([]);
        return;
      }

      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      try {
        const response = await axios.get(
          `http://localhost:5000/api/user?search=${query}`,
          config
        );
        setLoading(false);
        setNoUsers(true);
        setSearchResult(response.data.users);
      } catch (error) {
        setLoading(false);
        alert("Error finding searched users for creating Group Chat");
        console.log(error);
      }
    }, 500),
    [user.data.token]
  );

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      handleSearch(value); // Call the debounced search function
    },
    [handleSearch] // Dependency for handleInputChange
  );

  const handleDelete = (user) => {
    console.log("User removed from selected users");
    setSelectedUsers(selectedUsers.filter((a) => a._id !== user._id));
    console.log(selectedUsers);
    
  };

  const handleSubmit = async (e) => {
  
    if (!groupChatName) {
      alert("Enter Group chat name");
      return;
    }
    
    if (selectedUsers.length===0) {
      alert("Select users for group chat");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      console.log(response);
      setChats([response.data.fullGroupChat, ...chats]);
      alert("Group chat created successfully")
      hideGroupChatModal()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      }else{
      alert("Error submitting details of group chat")
      console.log(error)
      }
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.close}>
          <button
            onClick={() => {
              hideGroupChatModal();
              setNoUsers(false);
            }}
          >
            X
          </button>
        </div>
        <div className={styles.heading}>Create Group Chat</div>
        <div className={styles.nameField}>
          <input
            type="text"
            placeholder="Group Chat Name"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
        </div>
        <div className={styles.usersField}>
          <input
            type="text"
            placeholder="Add Users"
            onChange={handleInputChange}
          />
          {/* <button onClick={() => handleSearch(search)}>Search</button> */}
        </div>
        <div className={styles.badge}>
          {selectedUsers.length > 0
            ? selectedUsers.map((user) => (
                <UserBadge
                  user={user}
                  key={user._id}
                  handleFunction={() => handleDelete(user)}
                />
              ))
            : console.log("No users selected yet")}
        </div>
        <div className={styles.addUsers}>
          {loading ? (
            <ChatLoading />
          ) : searchResult.length > 0 ? (
            searchResult.map((user) => (
              <User
                user={user}
                key={user._id}
                handleFunction={() => handleFunction(user)}
              />
            ))
          ) : noUsers ? (
            "No users found"
          ) : (
            ""
          )}
        </div>
        <div className={styles.createChat}>
          <button onClick={() => {
            handleSubmit()
          }}>Create Chat</button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
