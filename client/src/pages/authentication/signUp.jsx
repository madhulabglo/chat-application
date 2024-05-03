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

const SignUp = () => {
  const navigate = useNavigate()
  const [signupdata, setSignupdata] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password:""
  });
  const [pic,setPic]=useState()
  const [show, setShow] = useState({
    password: false,
    confirm_password: false,
  });
  const [loading,setLoading]=useState(false)
  const toast = useToast()

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

  const postDetails = (pics) =>{
    setLoading(true)
    if(pics === undefined){
      toast({
        title: 'Please select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
      return
    }
    if(pics.type === "image/jpeg" || pics.type === "image/png"){
      const data = new FormData()
      data.append("file",pics)
      data.append("upload_preset","chatapplication")
      data.append("cloud_name","dmiakpy7n")
      fetch("https://api.cloudinary.com/v1_1/dmiakpy7n/image/upload",{
        method:"POST",
        body:data
      })
      .then((res)=>res.json())
      .then((data)=>{
        setPic(data.url.toString())
        setLoading(false)
      })
      .catch((err)=>{
        console.log(err)
        setLoading(false)
      })
    }else{
      toast({
        title: 'Please select an Image',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"bottom"
      })
      setLoading(false)
      return
    }
  }
  const submitHandler = async (e) => {
    setLoading(true);
    try {
      if (!signupdata?.name || !signupdata?.email || !signupdata?.password || !signupdata?.confirm_password) {
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
      if (signupdata?.password !== signupdata?.confirm_password) {
        toast({
          title: 'Passwords do not match',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom"
        });
        setLoading(false);
        return;
      }
      const req_data = {
        name: signupdata?.name,
        email: signupdata?.email,
        password: signupdata?.password,
        pic: pic
      };
      const response = await fetch(`${baseURL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req_data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data,"registered ddtatatat")
      localStorage.setItem("userdata", JSON.stringify(data?.data));
      setLoading(false);
      console.log(data, "dataaaa");
      navigate("/chats");
      toast({
        title: 'Successfully Registered',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: 'Error Occurred!',
        description: 'Failed to sign up. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom"
      });
      setLoading(false);
    }
  };
  
  return (
    <VStack>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={handleChange}
          name="name"
          value={signupdata?.name}
        />
      </FormControl>
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
      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show.confirm_password ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={handleChange}
            name="confirm_password"
            value={signupdata?.confirm_password}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleClick("confirm_password")}
            >
              {show.confirm_password ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e)=>postDetails(e.target.files[0])} />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};
export default SignUp;
