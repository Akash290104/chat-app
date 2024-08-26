const GetSender = (chat, loggedUser) => {
  // console.log("logged user is ", loggedUser);
  
  return chat.users[0]._id === loggedUser.data.existingUser._id
    ? chat.users[1].name
    : chat.users[0].name;
};

export default GetSender;
