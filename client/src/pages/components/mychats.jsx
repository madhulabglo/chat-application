import React, { useEffect, useState } from "react";
import { ChatState } from "../commoncomponent/chatprovider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { baseURL } from "./baseurl";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../commoncomponent/chatloading";
import { getSender } from "../context/chatlogic";
import GroupChatModal from "../commoncomponent/groupchatmodal";

const MyChats = ({ fetchAgain, storted_data }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedchat, setSelectedchat, chats, setChats } = ChatState();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("userdata"));
  console.log(storted_data, user, loggedUser, "storted data");

  const fetchChats = async () => {
    try {
      const response = await fetch(`${baseURL}/user/chat`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data, "chat get");
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Reults",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userdata")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedchat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="1g"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="1g"
        overflowY="hidden"
      >
        {chats && chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat) => (
              <Box
                onClick={() => setSelectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="1g"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat?.chatName}
                </Text>
                {console.log(chat, "mapppp")}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};
export default MyChats;
