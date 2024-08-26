import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import styles from "../styling/SingleChat.module.scss";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import getSender from "../config/GetSender";
import Modal2 from "./miscellaneous/Modal2.jsx";
import GetSenderFull from "../config/GetSenderFull.js";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.jsx";
import { ChatLoading } from "./miscellaneous/SearchBar.jsx";
import axios from "axios";
import { useEffect } from "react";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const hideUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.data.token}`,
        },
      };

      const chatId = selectedChat._id;
      const response = await axios.get(
        `http://localhost:5000/api/message/${chatId}`,
        config
      );

      if (response.data.messages.length === 0) {
        console.log("This chat has no messages yet", response);
      } else {
        console.log("Messages found", response);
      }
      setMessages(response.data.messages);

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);

      if (error.res && error.res.message) {
        alert(`${error.res.message}`);
      } else {
        alert("Error fetching messages");
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log("Notification ", notification);
  console.log(JSON.parse(localStorage.getItem("notifications")));

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  //Below logic ensures that users don't receive and see messages from a different chat while they're focused on a specific chat. It helps in managing the UI updates based on the selected chat.

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      console.log(newMessageReceived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log("HIIIIIIIIIIIIIIIIIIII");

        if (
          !notification.some((notif) => notif._id === newMessageReceived._id)
        ) {
          console.log("Notification incoming");

          // setNotification((prevNotification) => {
          //   const existingNotificationIndex = prevNotification.findIndex(
          //     (notif) => notif.sender._id === newMessageReceived.sender._id
          //   );

          //   let updatedNotification;

          //   if (existingNotificationIndex !== -1) {
          //     updatedNotification = [...prevNotification];

          //     updatedNotification[existingNotificationIndex] = {
          //       ...updatedNotification[existingNotificationIndex],
          //       content: newMessageReceived.content,
          //       createdAt: newMessageReceived.createdAt,
          //     };
          //   } else {
          //     updatedNotification = [newMessageReceived, ...prevNotification];
          //   }

          //   updatedNotification.sort(
          //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          //   );

          //   localStorage.setItem(
          //     "notifications",
          //     JSON.stringify(updatedNotification)
          //   );

          //   return updatedNotification;
          // });

          setNotification((prevNotification) => {
            let existingNotificationIndex = prevNotification.findIndex(
              (notif) =>
                notif.sender._id === newMessageReceived.sender._id &&
                notif.chat.isGroupChat === newMessageReceived.chat.isGroupChat
            );

            let updatedNotification = [...prevNotification];

            if (existingNotificationIndex !== -1) {
              updatedNotification[existingNotificationIndex] = {
                ...updatedNotification[existingNotificationIndex],
                content: newMessageReceived.content,
                createdAt: newMessageReceived.createdAt,
              };
            } else {
              updatedNotification = [
                newMessageReceived,
                ...updatedNotification,
              ];
            }

            updatedNotification.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            localStorage.setItem(
              "storedNotification",
              JSON.stringify(updatedNotification)
            );

            return updatedNotification;
          });

          // setNotification((prevNotification) => [
          //   newMessageReceived,
          //   ...prevNotification,
          // ]);

          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    // const handleMessageReceived = (newMessageReceived) => {
    //   console.log(newMessageReceived)

    //   if (
    //     !selectedChatCompare ||
    //     selectedChatCompare._id !== newMessageReceived.chat._id
    //   ) {
    //     console.log("HIIIIIIIIIIIIIIIIIIII");

    //     if (
    //       !notification.some((notif) => notif._id === newMessageReceived._id)
    //     ) {

    //       console.log("Notification incoming");
    //       // setNotification((prevNotification) => {
    //       //   const existingNotificationIndex = prevNotification.findIndex(
    //       //     (notif) => notif.sender._id === newMessageReceived.sender._id
    //       //   );

    //       //   let updatedNotification;

    //       //   if (existingNotificationIndex !== -1) {
    //       //     updatedNotification = [...prevNotification];

    //       //     updatedNotification[existingNotificationIndex] = {
    //       //       ...updatedNotification[existingNotificationIndex],
    //       //       content: newMessageReceived.content,
    //       //       createdAt: newMessageReceived.createdAt,
    //       //     };
    //       //   } else {
    //       //     updatedNotification = [newMessageReceived, ...prevNotification];
    //       //   }

    //       //   updatedNotification.sort(
    //       //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    //       //   );

    //       //   localStorage.setItem(
    //       //     "notifications",
    //       //     JSON.stringify(updatedNotification)
    //       //   );

    //       //   return updatedNotification;
    //       // });

    //       setNotification((prevNotification) => [
    //         newMessageReceived,
    //         ...prevNotification
    //       ]);
    //       setFetchAgain(!fetchAgain);
    //     }
    //   } else {
    //     setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
    //   }

    return () => {
      socket.off("message received");
    };
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        };

        setNewMessage("");
        const response = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log("message sent", response);
        socket.emit("new message", response.data.newMessage);

        setMessages([...messages, response.data.newMessage]);
      } catch (error) {
        console.log("Error sending the message", error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const removeNotification = (chat, notification) => {
    const updatedNotification = notification.filter(
      (notif) => notif.chat._id !== chat._id
    );
    localStorage.setItem(
      "storedNotification",
      JSON.stringify(updatedNotification)
    );
    return updatedNotification;
  };

  useEffect(() => {
    if (selectedChat) {
      setNotification((prevNotification) =>
        removeNotification(selectedChat, prevNotification)
      );
    }
  }, [selectedChat]);

  return (
    <div className={styles.container}>
      {selectedChat ? (
        <div className={styles.content}>
          <div className={styles.heading}>
            <div className={styles.arrow}>
              <FaArrowAltCircleLeft onClick={() => setSelectedChat("")} />
            </div>
            {selectedChat.isGroupChat ? (
              <div className={styles.chatTitle}>
                {selectedChat.chatName.toUpperCase()}
              </div>
            ) : (
              <div className={styles.chatTitle}>
                {getSender(selectedChat, user)}
              </div>
            )}
            {!selectedChat.isGroupChat ? (
              <div className={styles.eyeIcon}>
                <IoEye
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              </div>
            ) : (
              <div className={styles.eyeIcon}>
                <IoEye
                  onClick={() => {
                    setOpenUpdateModal(true);
                  }}
                />
              </div>
            )}

            {openModal && (
              <Modal2
                user={GetSenderFull(selectedChat, user)}
                handleClose={closeModal}
              />
            )}
            {openUpdateModal && (
              <UpdateGroupChatModal
                hideUpdateModal={hideUpdateModal}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
          </div>
          <div className={styles.chat}>
            {loading ? (
              <div className={styles.spinner}>
                <ChatLoading />
              </div>
            ) : (
              <div className={styles.messages}>
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div className={styles.msgBox}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    style={{
                      marginBottom: "15px",
                      marginLeft: "0px",
                      width: "70px",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
              <input
                type="text"
                onKeyDown={(event) => sendMessage(event)}
                onChange={(event) => typingHandler(event)}
                value={newMessage}
                placeholder="Type your message..."
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.text}>Click on a user to start chatting</div>
      )}
    </div>
  );
};

export default SingleChat;
