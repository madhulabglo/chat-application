import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import PrivateRouter from "./privaterouter";



const RegisterPage = lazy(() => import("../components/signup"));
const LoginPage = lazy(()=>import("../components/login"))
const ChatPage = lazy(()=>import("../components/chat"))

const routers = createBrowserRouter([
  {
    path: "/register",
    element: (
      <Suspense>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/chat",
    element: (
      <Suspense>
        <PrivateRouter>
        <ChatPage />
        </PrivateRouter>
      </Suspense>
    ),
  },
]);
export default routers
