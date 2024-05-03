import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import SideDrawer from "./sidedrawer";
import MyChats from "./mychats";
import ChatBox from "./chatbox";

const ChatPage = () => {
  const user = JSON.parse(localStorage.getItem("userdata"));
  console.log(user,"(((((((((");
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >

        {user && <MyChats fetchAgain={fetchAgain} storted_data = {user}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};
export default ChatPage;
