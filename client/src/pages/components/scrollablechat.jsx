import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSenderMargin, isSameUser, issameSender } from "../context/chatlogic";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  console.log(messages, "medsferewr");
  const user = JSON.parse(localStorage.getItem("userdata"));
  return (
    <ScrollableFeed>
      {messages &&
        messages?.map((ele, index) => (
          <div style={{ display: "flex" }} key={ele?._id}>
            {(issameSender(messages, ele, index, user.user_id) ||
              isLastMessage(messages, index, user.user_id)) && (
              <Tooltip
                label={ele?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt={7}
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={ele?.sender?.name}
                  src={ele?.sender?.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  ele?.sender._id === user.user_id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius:"20px",
                padding:"5px 15px",
                maxWidth:"75%",
                marginLeft: isSameSenderMargin(messages,ele,index,user.user_id),
                marginTop:isSameUser(messages,ele,index,user.user_id) ? 3 :10
            }}
            >{ele?.content}</span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
