import {
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
import { baseURL } from "../components/baseurl";
import { useNavigate } from "react-router-dom";
  
  const SignIn = () => {
    const toast = useToast()
    const navigate = useNavigate()
    const [signupdata, setSignupdata] = useState({
      email: "",
      password: "",
    });
    const [show, setShow] = useState({
      password: false,
      confirm_password: false,
    });
    const [loading,setLoading]=useState(false)
  
    const handleChange = (e) => {
      setSignupdata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    const handleClick = (name) => {
      console.log(name, show, "namemeerer");
      setShow((prev) => ({
        ...prev,
        [name]: !show[name],
      }));
    };
    const submitHandler = async(e) => {
      setLoading(true);
      try {
        if ( !signupdata?.email || !signupdata?.password ) {
          toast({
            title: 'Please fill all the fields',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false);
          return;
        }
        const response = await fetch(`${baseURL}/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupdata),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        localStorage.setItem("userdata", JSON.stringify(data));
        setLoading(false);
        console.log(data, "dataaaa");
        navigate("/chats");
        toast({
          title: 'Successfully login!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: 'Error Occurred!',
          description: error?.response?.data?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
      }
    //   const formDataWithPic = {
    //       ...signupdata,
    //       pic: pic, // Add pic to the formData
    //     };
    //   console.log(formDataWithPic,"piccc")
  
    }
    return (
      <VStack>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            onChange={handleChange}
            name="email"
            value={signupdata?.email}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show.password ? "text" : "password"}
              placeholder="Enter your Password"
              onChange={handleChange}
              name="password"
              value={signupdata?.password}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => handleClick("password")}
              >
                {show.password ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Sign In
        </Button>
      </VStack>
    );
  };
  export default SignIn;
  