import React from 'react'
import {ChatState} from "../context/chatProvider.js"
import SingleChat from './SingleChat.jsx'
import styles from "../styling/ChatBox.module.scss"

const ChatBox = ({fetchAgain, setFetchAgain }) => {
  
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  
  return (
      <div className={styles.container}>
      <div className="singlechat">
        <SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    </div>
  )
}

export default ChatBox