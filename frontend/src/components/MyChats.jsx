import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../context/chatProvider";
import axios from "axios";
import styles from "../styling/MyChats.module.scss";
import GetSender from "../config/GetSender";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const chatRef = useRef();

  // const handleOutsideClick = (e) => {
  //   if (
  //     selectedChat !== null &&
  //     chatRef.current &&
  //     !chatRef.current.contains(e.target) &&
  //     !e.target.closest(".chatsender")
  //   ) {
  //     setSelectedChat(null)
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleOutsideClick);
  //   return () => {
  //     document.removeEventListener("mousedown", handleOutsideClick);
  //   };
  // }, []);

  const ChatSender = ({ name, chat }) => {
    return (
      <div
        ref={chatRef}
        onClick={() => setSelectedChat(chat)}
        className={`${styles.senderContainer} chatsender`}
        style={{ backgroundColor: chat === selectedChat ? "#32afc6" : "grey" }}
      >
        {name}
      </div>
    );
  };

  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user.data || !user.data.token) {
        console.log("User not logged in or token missing");
        return;
      }
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

        setChats(response.data.result);
        console.log("Chats of MyChats component are", chats);
      } catch (error) {
        console.log("Error fetching the chats of the logged in user", error);
      }
    };

    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  // }, [fetchAgain,]);
  }, [fetchAgain, chats, setChats, user]);

  const [groupChatModal, setGroupChatModal] = useState(false);

  const showGroupChatModal = () => {
    setGroupChatModal(true);
  };

  const hideGroupChatModal = () => {
    setGroupChatModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>My Chats</div>
        <div className={styles.groupChatbtn}>
          <button onClick={() => showGroupChatModal()}>New Group Chat +</button>
        </div>
      </div>
      {chats.map((c) => {
        if (c.isGroupChat) {
          return <ChatSender key={c._id} name={c.chatName} chat={c} />;
        } else {
          const sender = GetSender(c, loggedUser);
          return <ChatSender key={c._id} name={sender} chat={c} />;
        }
      })}

      {groupChatModal && (
        <GroupChatModal hideGroupChatModal={hideGroupChatModal} />
      )}
    </div>
  );
};

export default MyChats;
