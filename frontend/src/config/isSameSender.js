export const isSameSender = (messages, m, i, userId) => {
  if (!m?.sender) {
    console.warn(
      `Message at index ${i} is missing a sender or sender is undefined.`
    );
    return false;
  }

  return (
    // i < messages.length - 1 &&
    // messages[i + 1]?.sender?._id !== m.sender?._id &&
    // m.sender?._id !== userId
    i < messages.length - 1 &&
    messages[i + 1]?.sender?._id !== m.sender?._id
  );
};

export const isLastMessage = (messages, i, userId) => {
  if (!messages[i]?.sender) {
    console.warn(
      `Message at index ${i} is missing a sender or sender is undefined.`
    );
    return false;
  }

  return (
    // i === messages.length - 1 &&
    // messages[messages.length - 1]?.sender?._id &&
    // messages[messages.length - 1]?.sender?._id !== userId
    i === messages.length - 1
  )
};

export const isCurrentUser = (m, user) => {
  return m?.sender?._id === user?.data?.existingUser?._id;
};
