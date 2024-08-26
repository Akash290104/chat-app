import React from 'react'

const GetSenderFull = (chat, loggedUser) => {
  return (
    (chat.users[0]._id === loggedUser.data.existingUser._id) ? chat.users[1] : chat.users[0]
  )
}

export default GetSenderFull
