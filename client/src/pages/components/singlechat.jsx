import React, { useEffect, useState } from "react";
import { ChatState } from "../commoncomponent/chatprovider";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../context/chatlogic";
import ProfileModal from "../commoncomponent/profilemodal";
import UpdateGroupChatModal from "../commoncomponent/updategroupchatmodal";
import { baseURL } from "./baseurl";

import "../../style/style.css";
import ScrollableChat from "./scrollablechat";
import  Lottie  from "react-lottie";
import animationData from "../animation/typing.json"

import io from "socket.io-client";

const ENDPOINT = "http://localhost:3001";
let socket;
let selectedChatCompare;

const defaultOptions = {
  loop:true,
  autoplay:true,
  animationData :animationData,
  rendererSettings:{
    preserveAspectRatio :"xMidYMid slice"
  }
}

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const user = JSON.parse(localStorage.getItem("userdata"));
  const { selectedchat, setSelectedchat,notification,setNotification } = ChatState();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIstyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedchat) return;
    try {
      const response = await fetch(
        `${baseURL}/user/message/${selectedchat._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data, "BBBBBBBBB");
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedchat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  console.log(selectedchat, "selectfdf");
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIstyping(true));
    socket.on("stop typing", () => setIstyping(false));
  }, []);

  useEffect(() => {
    console.log("fetchmessage calling");
    fetchMessages();
    selectedChatCompare = selectedchat;
  }, [selectedchat]);
  console.log(selectedChatCompare, "selectedChatCompare");

  useEffect(() => {
    console.log("inside the message re");
    socket.on("message received", (newMessage) => {
      console.log(newMessage,"LLLLLLL");
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage?.chat._id
      ) {
        console.log(newMessage,"newMessager");
        if(!notification.includes(newMessage)){
          setNotification([newMessage,...notification])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  },);
  console.log(notification,"notification-------------");
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedchat._id);
      try {
        setNewMessage("");
        const response = await fetch(`${baseURL}/user/message`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
            chatId: selectedchat._id,
          }),
        });
        const data = await response.json();
        socket.emit("new message", data);
        setMessages([...messages, data]);
        console.log(data, ">>>>>>>>>>>>>>>>>>>>>>");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedchat._id);
    }
    
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedchat._id);
        setTyping(false);
  
      }
    }, timerLength);
  };

  console.log(istyping,typing,"typingggggg");
  return (
    <Box height="85vh" width="130vh" display="flex" flexDirection="column">
      {selectedchat ? (
        <>
          <Box>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignContent="start"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedchat("")}
              />
              {!selectedchat?.isGroupChat ? (
                <>
                  {getSender(user, selectedchat?.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedchat?.users)}
                  />
                </>
              ) : (
                <>
                  {selectedchat?.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </Text>
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="1g"
            overflowY="hidden"
          >
            {/* Your content here */}
            <div className="messages">
              <ScrollableChat messages={messages} />
            </div>
            {loading ? (
              <Flex
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
              >
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Box>
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                  {istyping ? (
                    <div>
                      <Lottie
                      options={defaultOptions}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter message"
                    onChange={typingHandler}
                    value={newMessage}
                  />
                </FormControl>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3x1" pb={2}>
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </Box>
  );
};
export default SingleChat;
