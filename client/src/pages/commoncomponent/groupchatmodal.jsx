import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "./chatprovider";
import { baseURL } from "../components/baseurl";
import UserListItem from "./userlistitem";
import UserBadgeItem from "./userbadgeitem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("userdata"));

  const { chats, setChats } = ChatState();

  const handleAddUsers = async (value) => {
    setSearch(value);
    if (!value) {
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
      console.log(data, "MMMMMMMM");
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

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const response = await fetch(`${baseURL}/user/chat/group`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupChatName,
          users: selectedUsers?.map((ele) => ele._id),
        }),
      });
      const data = await response.json();
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group chat created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
  
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  

  const handleDelete = (deleteuser) => {
    setSelectedUsers(
      selectedUsers?.filter((ele) => ele._id !== deleteuser._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };
  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleAddUsers(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers?.map((ele) => (
                <UserBadgeItem
                  key={user._id}
                  user={ele}
                  handleFunction={() => handleDelete(ele)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default GroupChatModal;
