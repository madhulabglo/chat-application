const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

require("dotenv").config();

const userModel = require("../models/userModel");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

const Register = async (req, res) => {
  const { name, email, password, pic } = req.body;
  console.log(req.body, name, email, password, "body");
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email Format" });
    }
    // if (!validator.isMobilePhone(mobile_no, "any", { strictMode: false })) {
    //   return res.status(400).json({ mobile_no: "Enter a valid mobile number" });
    // }
    const existingEmail = await userModel.findOne({ email });
    console.log(existingEmail, "exit");

    if (existingEmail) {
      res.status(400).json({ message: "Already used this email" });
    }

    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      name,
      email,
      password: hash_password,
      pic,
    });
    const token = generateAccessToken(newUser._id);
    console.log(token, "tokennn");

    // const userWithoutPassword = await userModel
    //   .findById(newUser._id)
    //   .select("-password");
    if (newUser) {
      res.status(201).json({
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          pic: newUser.pic,
          access: token,
        },
        successMessage: "User Registered Successfully",
      });
    } else {
      res.status(400).json({message:  "Failed to Create the user"})
     
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const loginData = await userModel.findOne({ email });
    console.log(loginData, "loginssssssssssss");

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "Email and Password Fields are Required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email Format" });
    }

    const passwordMatch = await bcrypt.compare(password, loginData.password);

    if (passwordMatch) {
      const accessToken = generateAccessToken(loginData._id);
      const refreshToken = generateRefreshToken(loginData._id);

      res.status(200).json({
        access: accessToken,
        refresh: refreshToken,
        name: loginData.name,
        email: loginData.email,
        pic:loginData.pic,
        user_id: loginData._id,
      });
    } else {
      res.status(400).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//user?search=

const allUsers= async(req,res)=>{
  console.log(req.query,"query");
  const keyword = req.query.search?{
    $or:[
      {name:{$regex:req.query.search,$options:"i"}},
      {email:{$regex:req.query.search,$options:"i"}}
    ]
  }:{}
  const users = await userModel.find(keyword)
  res.send(users)
}

const userList = async (req, res) => {
  console.log(req.headers.authorization, "reqqqq");
  try {
    const allList = await userModel.find();
    if (!req.headers.authorization) {
      res.status(400).json({ message: "Token missing" });
    }
    if (allList) {
      res.status(200).json({ data: allList });
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  Register,
  Login,
  userList,
  allUsers
};
