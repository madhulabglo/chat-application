import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModal from "../commoncomponent/profilemodal";
import { useNavigate } from "react-router-dom";
import { baseURL } from "./baseurl";
import ChatLoading from "../commoncomponent/chatloading";
import UserListItem from "../commoncomponent/userlistitem";
import { ChatState } from "../commoncomponent/chatprovider";
import { getSender } from "../context/chatlogic";
import NotificationBadge from "react-notification-badge"
import {Effect} from "react-notification-badge"

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { setSelectedchat, chats, setChats, notification, setNotification } =
    ChatState();

  const user = JSON.parse(localStorage.getItem("userdata"));

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userdata");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/user?search=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data,"search data");
      setLoading(false);
      setSearchResult(data);
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

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const response = await fetch(`${baseURL}/user/chat/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      console.log(data, "datatt");
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingChat(false);
      setSelectedchat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the Chat",
        description: error?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  console.log(notification, "noto");
  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="whitesmoke"
        p="10px"
        border="1px solid"
      >
        <Box flex="1">
          <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <Text d={{ base: "none", md: "inline" }} pl="2">
                Search User
              </Text>
            </Button>
          </Tooltip>
        </Box>

        <Text fontSize="2xl" flex="2" textAlign="center">
          Chat App
        </Text>

        <Box flex="1" textAlign="right">
          <Menu>
            <MenuButton as={Button} p="1">
              <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}/>
              <BellIcon fontSize="md" m="1" />
            </MenuButton>
            <MenuList>
              {!notification?.length && <MenuItem>No new messages</MenuItem>}
              {notification?.map((ele) => (
                <MenuItem
                  key={ele._id}
                  onClick={() => {
                    setSelectedchat(ele?.chat);
                    setNotification(notification.filter((el) => el !== ele));
                  }}
                >
                  {ele?.chat?.isGroupChat
                    ? `New message in ${ele?.chat?.chatName}`
                    : `New message from ${getSender(user, ele?.chat?.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              p="1"
              ml="2"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
