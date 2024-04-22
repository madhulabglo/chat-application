import React, { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import {scrolltoBottom} from "react-scroll-to-bottom"

const socket = io.connect("http://localhost:3001");
function App() {
  const [currentmessage, setCurrentmessage] = useState("");
  const [list, setList] = useState([]);

  const sendMessageClick = async () => {
    if (currentmessage !== "") {
      const data = {
        message: currentmessage,
        time:
          new Date(Date?.now())?.getHours() +
          ":" +
          new Date(Date?.now())?.getMinutes(),
      };
      await socket.emit("send_message", data);
      setCurrentmessage("")
    }
  };

  useEffect(() => {
    const handleMessage = (data) => {
      setList((prev) => [...prev, data]);
      console.log("receive_message", data);
    };
  
    socket.on("receive_message", handleMessage);
  
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [socket]);
  
  console.log(list, "lissssddddddd");
  return (
    <div className="App">
      <div className="chat-header">
        <p>Chat</p>
      </div>
      <div className="chat-body">
        <div className="messages-wrapper">
        <scrolltoBottom  className="messages-container">
        {list?.map((ele) => {
          return (
            <div  className="chat-message">
              <h5>{ele?.message}</h5>
              <p className="message-time">{ele?.time}</p>
            </div>
          );
        })}
        </scrolltoBottom>
        </div>
      </div>
      <div className="chat-footer">
        <input
         className="message-input"
          placeholder="Message"
          type="text"
          onChange={(event) => setCurrentmessage(event.target.value)}
          value={currentmessage}
          onKeyPress={(event) => event?.key === "Enter" && sendMessageClick()}
        />
        <button className="send-button" onClick={sendMessageClick}>&#9658;</button>
      </div>
    </div>
  );
}

export default App;
