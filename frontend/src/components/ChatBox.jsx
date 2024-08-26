import React from 'react'
import SingleChat from './SingleChat.jsx'
import styles from "../styling/ChatBox.module.scss"

const ChatBox = ({fetchAgain, setFetchAgain }) => {
  
  
  return (
      <div className={styles.container}>
      <div className="singlechat">
        <SingleChat fetchAgain = {fetchAgain} setFetchAgain={setFetchAgain}/>
      </div>
    </div>
  )
}

export default ChatBox