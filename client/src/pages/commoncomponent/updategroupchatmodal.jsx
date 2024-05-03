import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "./chatprovider";
import UserBadgeItem from "./userbadgeitem";
import { baseURL } from "../components/baseurl";
import UserListItem from "./userlistitem";

const UpdateGroupChatModal = ({ setFetchAgain, fetchAgain,fetchMessages}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedchat, setSelectedchat } = ChatState();
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem("userdata"));
	console.log(user,"useytytrytryt");

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRemove = async(user1) => {
		console.log(user1,selectedchat?.groupAdmin._id,user1?.user_id,"user111");
		if(selectedchat.groupAdmin._id !== user1.user_id){
			toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
			return
		}
		try {
			setLoading(true)
			const response = await fetch(`${baseURL}/user/chat/groupremove`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedchat._id,
          userId: user1.user_id,
        }),
      });
      const data = await response.json();
			console.log()
     user1.user_id === user.user_id?setSelectedchat(""): setSelectedchat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
			
		} catch (error) {
			toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
		}
		}

    const handleRemoveusers = async(user1) =>{
      console.log(user1,selectedchat,"++++++++++");
      if(selectedchat.groupAdmin._id !== user.user_id && user1._id !== user.user_id){
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return
      }
      try {
        setLoading(true)
        const response = await fetch(`${baseURL}/user/chat/groupremove`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.access}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatId: selectedchat._id,
            userId: user1._id,
          }),
        });
        const data = await response.json();
        console.log()
       user1.user_id === user.user_id?setSelectedchat(""): setSelectedchat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
	

	const handleAddUser = async(user1) => {
		console.log(user1,"::::::::::::");
		if(selectedchat.users.find((ele)=>ele._id === user1._id)){
			toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
			return
		}
		if(selectedchat?.groupAdmin._id !== user.user_id){
			toast({
        title: "Only admins can add someone",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
			return
		}
		try {
			setLoading(true)
			const response = await fetch(`${baseURL}/user/chat/groupadd`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedchat._id,
          userId: user1._id,
        }),
      });
      const data = await response.json();
      setSelectedchat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
			
		} catch (error) {
			toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
		}
	}

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const response = await fetch(`${baseURL}/user/chat/rename`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.access}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedchat._id,
          chatName: groupChatName,
        }),
      });
      const data = await response.json();
      setSelectedchat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

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
  return (
    <div>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            {selectedchat?.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedchat.users?.map((ele) => (
                <UserBadgeItem
                  key={user._id}
                  user={ele}
                  handleFunction={() => handleRemoveusers(ele)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                backgroundColor="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to group"
                mb={1}
                onChange={(e) => handleAddUsers(e.target.value)}
              />
            </FormControl>
						{loading ?(
							<Spinner size="lg"/>
						):(
							searchResult?.map((user)=>(
								<UserListItem
								key={user._id}
								user={user}
								handleFunction={()=>handleAddUser(user)}/>
							))
						)}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
export default UpdateGroupChatModal;
