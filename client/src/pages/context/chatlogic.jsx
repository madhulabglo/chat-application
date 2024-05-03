export const getSender = (loggedUser,users)=>{
    console.log(loggedUser,users,"loggeddd");
    return users[0]._id ===loggedUser?.user_id ? users[1]?.name : users[0]?.name
}

export const getSenderFull = (loggedUser,users)=>{
    console.log(loggedUser,users,"loggeddd");
    return users[0]._id ===loggedUser?.user_id ? users[1] : users[0]
}

export const issameSender = (messages,ele,index,userId)=>{
    return(
        index < messages.length -1 &&
        (messages[index+1].sender._id !== ele.sender._id ||
        messages[index+1].sender._id === undefined)&&
        messages[index].sender._id !== userId
    )
}


export const isLastMessage = (messages,index,userId)=>{
    return(
        index === messages.length -1 &&
        messages[messages.length - 1].sender._id !== userId &&
        messages[messages.length - 1].sender._id
    )
}

export const isSameSenderMargin = (messages, ele,index,userId) => {
    if(index <  messages.length - 1 &&
    messages[index + 1].sender._id === ele.sender._id &&
messages[index].sender._id !== userId)
return 33;
else if((index < messages.lenfth -1 && messages[index + 1].sender._id&&
messages[index].sender._id !== userId) || (index === messages.length - 1 && messages[index].sender._if !== userId))
return 0
else return "auto"
}  

export const isSameUser = (messages,ele,index) => {
    return index > 0 && messages[index - 1].sender._id === ele.sender._id
}