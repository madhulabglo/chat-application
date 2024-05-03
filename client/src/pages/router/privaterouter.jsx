import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRouter = ({ children }) => {
  const token =JSON.parse(localStorage.getItem("userdata"));
  return token?.access ? children : <Navigate to={`/`} />;
};
export default PrivateRouter;