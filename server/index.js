const express = require("express")
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

const app = express()

const server = http.createServer(app)
app.use(cors())

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

io.on("connection",(socket)=>{
    console.log(socket?.id);

    socket.on("send_message",(data) => {
        io.emit("receive_message",data)
        console.log("message",data);
    })
 
    socket.off("disconnect",()=>{
        console.log(("disconnectedddd",socket?.id));
    })
})

server.listen(3001,()=>{
    console.log("SERVER IS RUNNINING");
})