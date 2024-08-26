import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isCurrentUser } from "../config/isSameSender";
import { ChatState } from "../context/chatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              justifyContent: isCurrentUser(m, user) ? "flex-end" : "flex-start", 
              marginBottom: "10px"
            }}
            key={m._id}
          >
            {(isSameSender(messages, m, i, user?.data?.existingUser?._id) ||
              isLastMessage(messages, i, user?.data?.existingUser?._id)) && (
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  marginLeft: isCurrentUser(m, user)? "10px" : "10px",
                  marginRight: isCurrentUser(m, user) ? "10px" : "10px",
                  marginTop: "10px",
                  borderRadius: "50%",
                }}
              >
                <img
                  style={{ width: "90%", height: "90%", objectFit: "cover", borderRadius: "50%" }}
                  src={m.sender?.pic}
                  alt={m.sender?.name}
                  title={m.sender?.name}
                />
              </div>
            )}
            <div
              style={{
                backgroundColor: `${
                  isCurrentUser(m, user)
                    ? "green"
                    : "blue"
                }`,
                padding: "5px",
                color: "white",
                maxWidth: "50%",
                flexWrap: "wrap",
                borderRadius: "10px",
                marginRight : isCurrentUser(m, user)? "10px" : "0px",
              marginLeft : isCurrentUser(m, user)? "10px" : "0px",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
