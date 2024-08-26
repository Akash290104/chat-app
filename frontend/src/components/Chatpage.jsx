
import React, {  useState } from 'react'
import { ChatState } from '../context/chatProvider'
import SideDrawer from "./SideDrawer.jsx"
import MyChats from './MyChats.jsx'
import ChatBox from './ChatBox.jsx'

const Chatpage = () => {
  
  

  const {user} = ChatState()
  const [fetchAgain, setFetchAgain]= useState(false)
  return (
    <div style={{width : "100%"}}>
       {user && <SideDrawer/>}
       <div style = {{display : "flex", justifyContent : "space-between", width : "100%", padding : "10px"}}>
       {user && <MyChats fetchAgain = {fetchAgain}/>}
       {user && <ChatBox fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain}/>}
        </div>   
    </div>
  )
}

export default Chatpage
