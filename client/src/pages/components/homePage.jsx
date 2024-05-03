import React, { useEffect } from "react";

import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import SignUp from "../authentication/signUp";
import SignIn from "../authentication/signIn";
import { useLocation, useNavigate } from "react-router-dom";

const HomePage = () => {
  const location = useLocation()
  const pathname = location.pathname
  const navigate =useNavigate()

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userdata"))
    if(user) navigate("/chats")
  },[pathname])
  return (
    <Container maxW="x1" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="whitesmoke"
        w="30%"
        m="40px 0 15px 0"
        borderRadius="1g"
        borderWidth="1px"
      >
        <Text fontSize="4x1">
          Chat Application
        </Text>
      </Box>
      <Box bg="whitesmoke" w="30%" p={4} borderRadius="1g" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%">Sign In</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <SignIn/>
            </TabPanel>
            <TabPanel>
            <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
export default HomePage;
