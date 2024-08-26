import React, { useCallback, useState } from "react";
import styles from "../../styling/UpdateGroupChatModal.module.scss";
import { ChatState } from "../../context/chatProvider";
import { ChatLoading } from "./SearchBar";
import axios from "axios";
import { debounce } from "../../config/debounce";

const UserBadge = ({ user, handleFunction }) => {
  return (
    <div className={styles.badgecontainer}>
      <div className={styles.badgecontent}>
        <div className={styles.badgename}>{user.name}</div>
        <div className={styles.badgeclose}>
          <button onClick={handleFunction}>X</button>
        </div>
      </div>
    </div>
  );
};

const User = ({ user, handleFunction }) => {
  return (
    <div className={styles.customUser} onClick={handleFunction}>
      <div className={styles.pic}>
        <img src={user.pic} alt="User" />
      </div>
      <div className={styles.details}>
        <div className={styles.name1} id="">
          {user.name}
        </div>
        <div className={styles.mail} id="">
          {user.email}
        </div>
      </div>
    </div>
  );
};

const UpdateGroupChatModal = ({
  hideUpdateModal,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupchatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const [noUsers, setNoUsers] = useState(false);
  const [showUserBadge, setShowUserBadge] = useState(false);

  const closeFunction = () => {
    setShowUserBadge(false);
  };

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
        alert("Error finding searched users");
        console.log(error);
      }
    }, 500),
    [user.data.token]
  );

  const handleAddUser = async (selectedUser) => {
    if (selectedChat.users.find((a) => a._id === selectedUser._id)) {
      alert("Selected user is already a member of the group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user.data.existingUser._id) {
      alert("Unauthorized access \nOnly admin can add or remove members");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const response = await axios.put(
        "https://chat-app-3-jpcn.onrender.com/api/chat/addtogroup",
        { chatId: selectedChat._id, userId: selectedUser._id },
        config
      );

      setSelectedChat(response.data.added);
      setFetchAgain(!fetchAgain);
      alert("New user added");
      setLoading(false);
    } catch (error) {
      alert("Error adding the selected user to the group");
      setLoading(false);
    }
  };

  const handleRemoveUser = async (selectedUser) => {
    if (
      selectedChat.groupAdmin._id !== user.data.existingUser._id &&
      selectedUser._id !== user.data.existingUser._id
    ) {
      alert("Unauthorized access \nOnly admin can add or other remove members");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const response = await axios.put(
        "https://chat-app-3-jpcn.onrender.com/api/chat/removefromgroup",
        { chatId: selectedChat._id, userId: selectedUser._id },
        config
      );

      if (selectedUser._id === user.data.existingUser._id) {
        alert(`You are leaving the group ${selectedChat.chatName}`);
        setSelectedChat();
        setFetchAgain(!fetchAgain);
        setLoading(false);
        fetchMessages();
        hideUpdateModal();
      } else {
        setSelectedChat(response.data.removed);
        alert("User removed from the group");
        setFetchAgain(!fetchAgain);
        setLoading(false);
        fetchMessages();
      }
    } catch (error) {
      alert("Error removing the selected user from the group");
      setLoading(false);
    }
  };

  const updateName = async () => {
    if (!groupchatName) {
      alert("Use a name for gorup chat");
      return;
    }

    setRenameLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const response = await axios.put(
        "https://chat-app-3-jpcn.onrender.com/api/chat/rename",
        { id: selectedChat._id, name: groupchatName },
        config
      );

      console.log("Updated group chat is ", response);

      setSelectedChat(response.data.updatedChat);
      setRenameLoading(false);
    } catch (error) {
      console.log("Error updating group chat name", error);
      setRenameLoading(false);
      alert("Error updating group chat name");
    }
  };

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearch(value);
      handleSearch(value);
    },
    [handleSearch]
  );

  return (
    <div className={styles.backdrop}>
      <div className={styles.container}>
        <div className={styles.closebtn}>
          <button
            onClick={() => {
              hideUpdateModal();
              setNoUsers(false);
            }}
          >
            X
          </button>
        </div>
        <div className={styles.name}>{selectedChat.chatName}</div>
        <div className={styles.users}>
          {selectedChat.users.map((user) => (
            <UserBadge
              user={user}
              key={user._id}
              handleFunction={() => handleRemoveUser(user)}
            />
          ))}
        </div>
        <div className={styles.nameUpdate}>
          <div className={styles.text}>Rename Group</div>
          <div className={styles.nameField}>
            <input
              type="text"
              onChange={(e) => setGroupChatName(e.target.value)}
              placeholder="Enter Group name"
            />
          </div>
          <div className={styles.updateBtn}>
            <button onClick={() => updateName()}>Update</button>
          </div>
          {renameLoading ? <ChatLoading /> : <div></div>}
        </div>

        <div className={styles.nameUpdate}>
          <div className={styles.text}>Add Users</div>
          <div className={styles.nameField}>
            <input
              type="text"
              onChange={handleInputChange}
              placeholder="Search users"
            />
          </div>
          <div className={styles.updateBtn}>
            {/* <button onClick={() => handleSearch()}>Search</button> */}
          </div>
        </div>
        <div className={styles.addUsers}>
          {loading ? (
            <ChatLoading />
          ) : searchResult.length > 0 ? (
            searchResult.map((user) => (
              <User
                user={user}
                key={user._id}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          ) : noUsers ? (
            "No users found"
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;
