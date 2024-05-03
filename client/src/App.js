import React from "react";
import "./App.css";

import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/components/homePage";
import ChatPage from "./pages/components/chatpage";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
        <Route exact path="/" Component={HomePage}  />
        <Route exact path="/chats" Component={ChatPage}/>
        </Routes>
      </div>
    </>
  );
}

export default App;
