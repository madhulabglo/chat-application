import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedchat, setSelectedchat] = useState("");
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedchat,
        setSelectedchat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
