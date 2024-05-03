const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split the header to extract the token correctly
      token = req.headers.authorization.split(" ")[1]; // Corrected syntax

      console.log("Received token:", token); // Log the token

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      // console.log(token, process.env.JWT_ACCESS_SECRET, decoded, "dderer");
      req.user = await userModel.findById(decoded.userId).select("-password"); // Changed to req.user
      next();
    } catch (error) {
      console.error("Token verification error:", error); // Log any token verification errors
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // If no token is provided
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


module.exports = { protect };
