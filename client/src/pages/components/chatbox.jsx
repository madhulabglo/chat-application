import React from "react";
import { ChatState } from "../commoncomponent/chatprovider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./singlechat";

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { selectedchat } = ChatState;
  return (
    <Box 
		display={{ base: selectedchat ? "flex" : "none", md: "flex" }}
		alignItems="center"
		flexDir="column"
		p={3}
		bg="white"
		w={{base:"100%", md:"68%"}}
		borderRadius="1g"
		borderWidth="1px">
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  );
};
export default ChatBox;
